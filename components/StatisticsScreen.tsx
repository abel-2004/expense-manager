
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/helpers';

interface StatisticsScreenProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19D4FF'];

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ transactions }) => {
  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    return Object.keys(categoryTotals).map(category => ({
      name: category,
      value: categoryTotals[category],
    })).sort((a,b) => b.value - a.value);
  }, [transactions]);

  const totalExpenses = useMemo(() => expenseData.reduce((sum, item) => sum + item.value, 0), [expenseData]);

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-full">
      <h1 className="text-2xl font-bold mb-2 text-center">Expense Statistics</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">A breakdown of your spending by category.</p>

      {expenseData.length > 0 ? (
        <>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                <h3 className="font-semibold text-lg">Total Expenses</h3>
                <p className="text-red-500 font-bold text-xl">{formatCurrency(totalExpenses)}</p>
            </div>
            <ul className="mt-4 space-y-2">
                {expenseData.map((item, index) => (
                    <li key={item.name} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(item.value)}</span>
                    </li>
                ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">No expense data to display.</p>
            <p className="text-sm text-gray-400">Add some expenses to see your statistics.</p>
        </div>
      )}
    </div>
  );
};

export default StatisticsScreen;
