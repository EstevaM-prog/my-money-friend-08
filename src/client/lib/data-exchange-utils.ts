import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Transaction, Category, PaymentMethod } from "./finance-data";

export const handleExportCSV = (transactions: Transaction[]) => {
  const headers = ["Descrição", "Valor", "Tipo", "Categoria", "Forma de Pagamento", "Data"];
  const rows = transactions.map((t) => [
    t.description,
    t.amount,
    t.type === "income" ? "Receita" : "Despesa",
    t.category,
    t.paymentMethod,
    format(new Date(t.date), "dd/MM/yyyy"),
  ]);

  const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.body.appendChild(document.createElement("a"));
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `extrato-${format(new Date(), "yyyy-MM-dd")}.csv`);
  link.click();
  document.body.removeChild(link);
};

export const handleExportExcel = (transactions: Transaction[]) => {
  const data = transactions.map((t) => ({
    Descrição: t.description,
    Valor: t.amount,
    Tipo: t.type === "income" ? "Receita" : "Despesa",
    Categoria: t.category,
    "Forma de Pagamento": t.paymentMethod,
    Data: format(new Date(t.date), "dd/MM/yyyy"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");
  XLSX.writeFile(workbook, `extrato-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
};

export const handleExportPDF = (transactions: Transaction[]) => {
  const doc = new jsPDF();
  doc.text("Relatório de Transações - My Money Friend", 14, 15);
  
  const tableData = transactions.map((t) => [
    t.description,
    `R$ ${t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    t.type === "income" ? "Receita" : "Despesa",
    t.category,
    t.paymentMethod,
    format(new Date(t.date), "dd/MM/yyyy"),
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["Descrição", "Valor", "Tipo", "Categoria", "Pgmto", "Data"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
  });

  doc.save(`extrato-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export const parseRawDataToTransactions = (data: any[]): Omit<Transaction, "id">[] => {
  return data.map((row) => {
    const desc = row.Descrição || row.Lancamento || row.Lançamento || row.Histórico || row.Description || row.item || row.Mercadoria || "";
    const val = row.Valor || row.Montante || row.Quantia || row.Amount || row.Saldo || 0;
    const credito = row.Crédito || row.Credito || row.Credit || 0;
    const debito = row.Débito || row.Debito || row.Debit || 0;
    const cat = row.Categoria || row.Category || "Outros";
    const dateRaw = row.Data || row.Date || row.Vencimento || "";
    
    let parsedDate = new Date();
    if (dateRaw) {
      const dateStr = dateRaw.toString();
      const dmy = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
      if (dmy) {
        const day = parseInt(dmy[1]);
        const month = parseInt(dmy[2]) - 1;
        const year = dmy[3].length === 2 ? 2000 + parseInt(dmy[3]) : parseInt(dmy[3]);
        parsedDate = new Date(year, month, day);
      } else {
        parsedDate = new Date(dateStr);
      }
    }
    if (isNaN(parsedDate.getTime())) parsedDate = new Date();
    
    let amount = 0;
    let type: "income" | "expense" = "expense";

    if (credito && parseFloat(String(credito).replace(",", ".")) !== 0) {
      amount = Math.abs(parseFloat(String(credito).replace(",", ".")));
      type = "income";
    } else if (debito && parseFloat(String(debito).replace(",", ".")) !== 0) {
      amount = Math.abs(parseFloat(String(debito).replace(",", ".")));
      type = "expense";
    } else {
      const numericVal = parseFloat(String(val).replace(/\s/g, "").replace(".", "").replace(",", "."));
      amount = Math.abs(numericVal);
      type = numericVal >= 0 ? "income" : "expense";
    }

    if (!desc.toString().trim() || isNaN(amount) || amount === 0) return null;

    return {
      description: desc.toString(),
      amount: amount,
      type: (row.Tipo === "Receita" || row.Tipo === "income") ? "income" : (row.Tipo === "Despesa" || row.Tipo === "expense") ? "expense" : type,
      category: cat as Category,
      paymentMethod: (row["Forma de Pagamento"] || row.Method || row.Pagamento || "Dinheiro") as PaymentMethod,
      date: parsedDate.toISOString(),
    };
  }).filter(Boolean) as Omit<Transaction, "id">[];
};
