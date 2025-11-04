
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';

const STORAGE_KEY = 'expense-manager-transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem(STORAGE_KEY);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error("Failed to load transactions from localStorage", error);
      setTransactions([]);
    }
  }, []);

  const saveTransactions = useCallback((updatedTransactions: Transaction[]) => {
    try {
      // Sort by date descending before saving
      const sortedTransactions = updatedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedTransactions));
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error("Failed to save transactions to localStorage", error);
    }
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    let updatedTransactions;
    if (existingIndex > -1) {
      // Update existing transaction
      updatedTransactions = [...transactions];
      updatedTransactions[existingIndex] = transaction;
    } else {
      // Add new transaction
      updatedTransactions = [...transactions, transaction];
    }
    saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);

  const deleteTransaction = useCallback((id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);

  return { transactions, addTransaction, deleteTransaction };
};
