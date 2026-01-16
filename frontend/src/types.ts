export type Category = 
  | 'Food' 
  | 'Dining'
  | 'Travel' 
  | 'Bills' 
  | 'Insurance' 
  | 'Investment' 
  | 'Luxury' 
  | 'Education' 
  | 'Health' 
  | 'Shopping'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
  isTaxDeductible: boolean;
  gstRate: number; // 0, 5, 12, 18, 28
}

export interface UserProfile {
  name: string;
  annualIncome: number;
  regime: 'Old' | 'New';
  investments80C: number;
}
