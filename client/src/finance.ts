export type FinanceEntry = { amount: number; type: 'income' | 'expense'; date: string; category: string }
export type SavingsGoal = { target: number; saved: number }

export const sum = (rows: FinanceEntry[], predicate: (row: FinanceEntry) => boolean) => rows.filter(predicate).reduce((total, row) => total + Number(row.amount || 0), 0)

export function monthlyTotals(rows: FinanceEntry[], year: number, monthIndex: number) {
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`
  const monthRows = rows.filter(row => row.date.startsWith(prefix))
  const income = sum(monthRows, row => row.type === 'income')
  const expenses = sum(monthRows, row => row.type === 'expense')
  return { income, expenses, net: income - expenses, savingsRate: income ? Math.round((income - expenses) / income * 100) : 0 }
}

export function categoryTotals(rows: FinanceEntry[], prefix: string) {
  return rows.filter(row => row.type === 'expense' && row.date.startsWith(prefix)).reduce<Record<string, number>>((totals, row) => {
    totals[row.category] = (totals[row.category] || 0) + Number(row.amount || 0)
    return totals
  }, {})
}

export function estimateGoalMonths(goal: SavingsGoal, monthlyContribution: number) {
  if (!goal || goal.target <= goal.saved || monthlyContribution <= 0) return null
  return Math.ceil((goal.target - goal.saved) / monthlyContribution)
}

export function findLargeExpenses(rows: FinanceEntry[], threshold = 3000) {
  return rows.filter(row => row.type === 'expense' && Number(row.amount) >= threshold)
}

export function healthScore({ income, expenses, budgetUsed, budgetLimit, savings, savingsGoal }: { income:number;expenses:number;budgetUsed:number;budgetLimit:number;savings:number;savingsGoal:number }) {
  if (income <= 0 && expenses <= 0 && budgetLimit <= 0 && savingsGoal <= 0) return 0
  const savingsRate = income > 0 ? Math.max(0, Math.min(1, (income - expenses) / income)) : 0
  const budgetRate = budgetLimit > 0 ? Math.max(0, Math.min(1, budgetUsed / budgetLimit)) : 0
  const emergencyRate = savingsGoal > 0 ? Math.max(0, Math.min(1, savings / savingsGoal)) : 0
  return Math.round(35 * savingsRate + 35 * (1 - budgetRate) + 30 * emergencyRate)
}
