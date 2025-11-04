
export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export enum Category {
  Food = 'Food',
  Travel = 'Travel',
  Rent = 'Rent',
  Groceries = 'Groceries',
  Entertainment = 'Entertainment',
  Salary = 'Salary',
  Freelance = 'Freelance',
  Other = 'Other',
}

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  type: TransactionType;
  note: string;
  date: string; // Stored as ISO string: YYYY-MM-DD
}
