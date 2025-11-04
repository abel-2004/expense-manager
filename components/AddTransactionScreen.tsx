import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Category } from '../types';

interface AddTransactionScreenProps {
  addTransaction: (transaction: Transaction) => void;
  onTransactionAdded: () => void;
  existingTransaction: Transaction | null;
}

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({ addTransaction, onTransactionAdded, existingTransaction }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.Food);
  const [type, setType] = useState<TransactionType>(TransactionType.Expense);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingTransaction) {
      setAmount(String(existingTransaction.amount));
      setCategory(existingTransaction.category);
      setType(existingTransaction.type);
      setNote(existingTransaction.note);
      setDate(existingTransaction.date);
    }
  }, [existingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!note.trim()) {
        setError('Please enter a note for the transaction.');
        return;
    }

    const newTransaction: Transaction = {
      id: existingTransaction ? existingTransaction.id : new Date().toISOString(),
      amount: parseFloat(amount),
      category,
      type,
      note,
      date,
    };

    addTransaction(newTransaction);
    onTransactionAdded();
  };

  const incomeCategories = [Category.Salary, Category.Freelance, Category.Other];
  const expenseCategories = Object.values(Category).filter(c => !incomeCategories.includes(c));

  const availableCategories = type === TransactionType.Income ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (!availableCategories.includes(category)) {
        setCategory(availableCategories[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, availableCategories]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-center">{existingTransaction ? 'Edit' : 'Add'} Transaction</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        <div className="flex space-x-4">
            <button type="button" onClick={() => setType(TransactionType.Expense)} className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${type === TransactionType.Expense ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Expense</button>
            <button type="button" onClick={() => setType(TransactionType.Income)} className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${type === TransactionType.Income ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Income</button>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
          >
            {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
          <input
            type="text"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Coffee with friends"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
          {existingTransaction ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default AddTransactionScreen;