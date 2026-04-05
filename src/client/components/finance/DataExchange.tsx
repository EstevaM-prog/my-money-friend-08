import { useState, useRef } from "react";
import { Download, Upload, FileText, FileSpreadsheet, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/client/hooks/use-toast";
import { Transaction } from "@/client/lib/finance-data";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist";
import {
  handleExportCSV,
  handleExportExcel,
  handleExportPDF,
  parseRawDataToTransactions
} from "@/client/lib/data-exchange-utils";

// Configure PDF worker
const PDF_JS_VERSION = "4.0.379";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.worker.min.js`;

interface DataExchangeProps {
  onImport: (transactions: Omit<Transaction, "id">[]) => void;
  transactions: Transaction[];
}

export function DataExchange({ onImport, transactions }: DataExchangeProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.name.endsWith(".csv")) {
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          let workbook;

          if (file.name.endsWith(".csv")) {
            const text = new TextDecoder().decode(result as ArrayBuffer);
            workbook = XLSX.read(text, { type: "string", raw: true });
          } else {
            workbook = XLSX.read(result, { type: "array" });
          }

          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          const importedTransactions = parseRawDataToTransactions(data);

          if (importedTransactions.length > 0) {
            onImport(importedTransactions);
            toast({
              title: "Importação concluída",
              description: `${importedTransactions.length} transações identificadas.`,
            });
          } else {
            throw new Error("Dados não encontrados nas colunas esperadas.");
          }
        } catch (error: any) {
          toast({
            title: "Erro na importação",
            description: error.message || "Tente salvar seu arquivo em outro formato.",
            variant: "destructive",
          });
        } finally {
          setIsImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith(".pdf")) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const c = await page.getTextContent();
          fullText += c.items.map((item: any) => item.str).join(" ") + "\n";
        }

        // Basic pattern matching for PDF (very simplified version of previous logic)
        const datePattern = /(\d{2}\/\d{2}(\/\d{2,4})?)/g;
        const amountPattern = /(-?\d+[\.,]\d{2})/g;
        const lines = fullText.split("\n");
        const imported: Omit<Transaction, "id">[] = [];

        lines.forEach(line => {
          const dates = line.match(datePattern);
          const amounts = line.match(amountPattern);
          if (dates && amounts) {
            const amountStr = amounts[amounts.length - 1].replace(",", ".");
            imported.push({
              description: line.substring(0, 30).trim() || "Importado via PDF",
              amount: Math.abs(parseFloat(amountStr)),
              type: parseFloat(amountStr) < 0 ? "expense" : "income",
              category: "Outros",
              paymentMethod: "Dinheiro",
              date: new Date().toISOString(),
            });
          }
        });

        if (imported.length > 0) {
          onImport(imported);
          toast({ title: "Importação PDF (Beta)", description: `${imported.length} itens encontrados.` });
        } else throw new Error();
      } catch {
        toast({ title: "Erro no PDF", description: "Use arquivos Excel ou CSV para maior precisão.", variant: "destructive" });
      } finally {
        setIsImporting(false);
      }
    } else {
      toast({ title: "Formato inválido", description: "Use .xlsx, .csv ou .pdf", variant: "destructive" });
      setIsImporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls,.csv,.pdf" onChange={handleFileChange} />

      <Button
        className="gap-2 gradient-primary border-0 text-primary-foreground font-semibold shadow-md h-9 sm:h-10"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
      >
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Importar</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2 gradient-primary border-0 text-primary-foreground font-semibold shadow-md h-9 sm:h-10">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Escolha o formato</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleExportExcel(transactions)} className="cursor-pointer gap-2">
            <FileSpreadsheet className="h-4 w-4 text-green-600" /> Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExportPDF(transactions)} className="cursor-pointer gap-2">
            <FileText className="h-4 w-4 text-red-600" /> PDF (.pdf)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExportCSV(transactions)} className="cursor-pointer gap-2">
            <File className="h-4 w-4 text-blue-600" /> CSV (.csv)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
