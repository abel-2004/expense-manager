
import { Transaction } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const exportToCSV = (data: Transaction[]) => {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = data.map(t => [
        t.id,
        t.date,
        t.type,
        t.category,
        t.amount.toString(),
        `"${t.note.replace(/"/g, '""')}"` // Escape double quotes
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
