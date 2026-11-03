import { describe, expect, it } from 'vitest'
import { categoryTotals, estimateGoalMonths, findLargeExpenses, healthScore, monthlyTotals } from './finance'

const rows = [
  { amount: 20000, type: 'income' as const, date: '2026-11-02', category: 'Income' },
  { amount: 1250, type: 'expense' as const, date: '2026-11-03', category: 'Education' },
  { amount: 450, type: 'expense' as const, date: '2026-11-03', category: 'Transport' },
  { amount: 500, type: 'expense' as const, date: '2026-10-30', category: 'Education' },
]

describe('financial calculations', () => {
  it('calculates a month from records and excludes other months', () => {
    expect(monthlyTotals(rows, 2026, 10)).toEqual({ income: 20000, expenses: 1700, net: 18300, savingsRate: 92 })
  })

  it('groups only expenses for the requested month', () => {
    expect(categoryTotals(rows, '2026-11')).toEqual({ Education: 1250, Transport: 450 })
  })

  it('estimates whole months until a goal is reached', () => {
    expect(estimateGoalMonths({ target: 10000, saved: 2500 }, 2000)).toBe(4)
    expect(estimateGoalMonths({ target: 10000, saved: 10000 }, 2000)).toBeNull()
  })

  it('finds large expenses without classifying income as spending', () => {
    expect(findLargeExpenses([...rows, { amount: 5000, type: 'expense', date: '2026-11-04', category: 'Rent' }])).toHaveLength(1)
  })

  it('returns a bounded explainable health score', () => {
    expect(healthScore({ income: 20000, expenses: 5000, budgetUsed: 5000, budgetLimit: 10000, savings: 25000, savingsGoal: 50000 })).toBe(59)
    expect(healthScore({ income: 0, expenses: 0, budgetUsed: 0, budgetLimit: 0, savings: 0, savingsGoal: 0 })).toBe(0)
  })
})
