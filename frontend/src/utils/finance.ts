import type { Transaction, UserProfile } from '../types';

// GST Rates Mapping
export const GST_RATES: Record<string, number> = {
  'Vegetables': 0, 'Education': 0, 'Health': 0,
  'Packaged Food': 5, 'Cab': 5,
  'Air Travel (Business)': 12,
  'Dining': 18, 'Electronics': 18, 'Bills': 18,
  'Luxury Hotel': 28, 'Luxury Car': 28
};

// GST Reverse Calculation: Base = Total / (1 + Rate/100)
export const calculateGSTComponent = (total: number, rate: number): number => {
  const basePrice = total / (1 + (rate / 100));
  return total - basePrice;
};

// Health Score (0-100) based on 50/30/20 Rule
// Simplified: Score penalty if Wants > 30% or Needs > 50%
export const calculateHealthScore = (transactions: Transaction[], monthlyIncome: number): number => {
  // Categorize roughly (Mock logic)
  const needs = transactions.filter(t => ['Food', 'Bills', 'Health', 'Education'].includes(t.category))
                            .reduce((sum, t) => sum + t.amount, 0);
  const wants = transactions.filter(t => ['Travel', 'Luxury', 'Shopping', 'Dining'].includes(t.category))
                            .reduce((sum, t) => sum + t.amount, 0);
  const savings = transactions.filter(t => ['Investment'].includes(t.category))
                              .reduce((sum, t) => sum + t.amount, 0);

  let score = 100;

  // Penalize if Needs > 50% of income
  if (needs > monthlyIncome * 0.5) score -= 10;
  // Penalize if Wants > 30% of income
  if (wants > monthlyIncome * 0.3) score -= 20;
  // Reward if Savings > 20% of income
  if (savings > monthlyIncome * 0.2) score += 10;
  else score -= 10;

  return Math.max(0, Math.min(100, score));
};

// Tax Liability (FY 2025-26 Assumption)
export const calculateTaxLiability = (profile: UserProfile): number => {
  let taxableIncome = profile.annualIncome;

  if (profile.regime === 'Old') {
    // Deduct 80C (Max 1.5L)
    const deduction = Math.min(profile.investments80C, 150000);
    taxableIncome -= deduction;
    // Standard Deduction assumption
    taxableIncome -= 50000; 
  } else {
    // New Regime Standard Deduction
    taxableIncome -= 75000;
  }

  if (taxableIncome <= 300000) return 0;

  let tax = 0;
  // Simplified Slabs
  if (taxableIncome > 1500000) {
    tax += (taxableIncome - 1500000) * 0.30;
    taxableIncome = 1500000;
  }
  if (taxableIncome > 1200000) {
    tax += (taxableIncome - 1200000) * 0.20;
    taxableIncome = 1200000;
  }
  if (taxableIncome > 1000000) {
    tax += (taxableIncome - 1000000) * 0.15;
    taxableIncome = 1000000;
  }
  if (taxableIncome > 700000) {
    tax += (taxableIncome - 700000) * 0.10;
    taxableIncome = 700000;
  }
  if (taxableIncome > 300000) {
    tax += (taxableIncome - 300000) * 0.05;
  }

  return Math.round(tax);
};
