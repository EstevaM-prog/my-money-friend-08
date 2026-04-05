import { Transaction } from "./finance-data";
import { format, isSameDay, parseISO } from "date-fns";

/**
 * Simula a rotina de Cron Job disparada diariamente.
 * Em um cenário real, isso rodaria em um servidor Node.js (ex: node-cron ou Vercel Cron).
 */
export async function checkPendingNotifications(transactions: Transaction[]) {
  const today = new Date();
  
  // Filtra despesas com notificação ativa e vencimento hoje
  const pending = transactions.filter((t) => {
    const isExpense = t.type === "expense";
    const isActive = t.email_notification_active === true;
    const isDueToday = isSameDay(parseISO(t.date), today);
    
    return isExpense && isActive && isDueToday;
  });

  if (pending.length === 0) return;

  console.log(`[Cron Job 08:00 AM] Processando ${pending.length} notificações...`);

  for (const t of pending) {
    try {
      // Aqui entraria a integração com Resend ou outro serviço de e-mail
      // Exemplo:
      // await sendEmail({
      //   to: t.userEmail, // Precisaria do e-mail do usuário no objeto Transaction
      //   subject: `Vencimento de conta: ${t.description}`,
      //   body: `Olá! Lembramos que sua conta "${t.description}" de valor ${t.amount} vence hoje.`
      // });
      
      console.log(`Notificação enviada para: ${t.description} - R$ ${t.amount}`);
      
      // Marcar como enviada para não repetir
      t.email_notification_active = false; 
    } catch (error) {
      console.error(`Erro ao enviar notificação para ${t.id}:`, error);
    }
  }
}

/**
 * Exemplo de estrutura para um Cron real no backend
 * 
 * const cron = require('node-cron');
 * cron.schedule('0 8 * * *', async () => {
 *   const transactions = await db.transactions.find({ 
 *     email_notification_active: true, 
 *     date: today 
 *   });
 *   await checkPendingNotifications(transactions);
 * });
 */
