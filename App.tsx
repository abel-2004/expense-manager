import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import AddTransactionScreen from './components/AddTransactionScreen';
import StatisticsScreen from './components/StatisticsScreen';
import BottomNav from './components/BottomNav';
import { useTransactions } from './hooks/useTransactions';
import { Transaction } from './types';

export type Screen = 'home' | 'stats' | 'add';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddScreen = () => {
    setEditingTransaction(null);
    setActiveScreen('add');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveScreen('add');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen transactions={transactions} onAddTransaction={handleAddScreen} onEditTransaction={handleEditTransaction} deleteTransaction={deleteTransaction} />;
      case 'stats':
        return <StatisticsScreen transactions={transactions} />;
      case 'add':
        return <AddTransactionScreen addTransaction={addTransaction} onTransactionAdded={() => setActiveScreen('home')} existingTransaction={editingTransaction} />;
      default:
        return <HomeScreen transactions={transactions} onAddTransaction={handleAddScreen} onEditTransaction={handleEditTransaction} deleteTransaction={deleteTransaction} />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans max-w-lg mx-auto bg-white dark:bg-black shadow-2xl">
      <main className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </main>
      <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} onAddClick={handleAddScreen} />
    </div>
  );
};

export default App;