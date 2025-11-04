import React, { useState, useMemo } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import TransactionItem from './TransactionItem';
import { formatCurrency, exportToCSV } from '../utils/helpers';
import { useDarkMode } from '../hooks/useDarkMode';
import { useNotifications } from '../hooks/useNotifications';

interface HomeScreenProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

const ThemeToggleIcon: React.FC<{ theme: string }> = ({ theme }) =>
  theme === 'dark' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
  );

const NotificationBellIcon: React.FC<{ enabled: boolean, permission: NotificationPermission }> = ({ enabled, permission }) => {
    // Icon when permission is denied
    if (permission === 'denied') {
        return (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9m12 2l-3-3m0 0l-3 3m3-3v7.5" transform="rotate(45 12 12) translate(-2, -2)" /><line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" /></svg>
        );
    }
    // Icon when enabled
    if (enabled) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        );
    }
    // Icon when disabled but available
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9m-3-12l14 14" />
        </svg>
    );
};


const HomeScreen: React.FC<HomeScreenProps> = ({ transactions, onEditTransaction, deleteTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [theme, toggleTheme] = useDarkMode();
  const { isReminderEnabled, toggleDailyReminder, permission, isSupported } = useNotifications();

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [transactions, searchTerm, filterCategory]);

  const getNotificationTooltip = () => {
      if (!isSupported) return "Notifications not supported in this browser.";
      if (permission === 'denied') return "Notifications blocked. Enable in browser settings.";
      return isReminderEnabled ? "Disable daily expense reminders" : "Enable daily expense reminders";
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-full">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Hello,</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome to your Expense Manager</p>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={toggleDailyReminder} 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={getNotificationTooltip()}
                disabled={!isSupported || permission === 'denied'}
            >
                <NotificationBellIcon enabled={isReminderEnabled} permission={permission} />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ThemeToggleIcon theme={theme} />
            </button>
        </div>
      </header>

      <div className="bg-blue-600 dark:bg-blue-800 text-white p-6 rounded-2xl mb-6 shadow-lg">
        <p className="text-sm opacity-80">Total Balance</p>
        <p className="text-4xl font-bold tracking-tight">{formatCurrency(balance)}</p>
        <div className="flex justify-between mt-4">
          <div>
            <p className="text-xs opacity-80 flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Income</p>
            <p className="font-semibold">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>Expense</p>
            <p className="font-semibold">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
          className="w-full sm:w-48 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <button 
          onClick={() => exportToCSV(transactions)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Export CSV
        </button>
      </div>
      
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(t => (
            <TransactionItem key={t.id} transaction={t} onEdit={onEditTransaction} onDelete={deleteTransaction} />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;