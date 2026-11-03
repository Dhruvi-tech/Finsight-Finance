import { jsPDF } from 'jspdf'

export type ReportTransaction = {
  date: string
  name: string
  category: string
  type: 'income' | 'expense'
  amount: number
  method: string
}

export type ReportGoal = { name: string; target: number; saved: number }
export type ReportBudget = { category: string; used: number; limit: number }

const currency = (value: number) => `INR ${Math.round(value).toLocaleString('en-IN')}`

function reportPrefix(period: string) {
  const now = new Date()
  if (period === 'Last month') return `${new Date(now.getFullYear(), now.getMonth() - 1, 1).getFullYear()}-${String(new Date(now.getFullYear(), now.getMonth() - 1, 1).getMonth() + 1).padStart(2, '0')}`
  if (period === 'Year to date') return String(now.getFullYear())
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function downloadFinancialPdf({
  reportType,
  period,
  transactions,
  goals,
  budgets,
}: {
  reportType: string
  period: string
  transactions: ReportTransaction[]
  goals: ReportGoal[]
  budgets: ReportBudget[]
}) {
  const prefix = reportPrefix(period)
  const rows = transactions.filter((tx) => tx.date.startsWith(prefix))
  const income = rows.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0)
  const expenses = rows.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0)
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const left = 16
  const right = 194
  let y = 18

  const addText = (value: string, x = left, size = 10, color = '#30364f') => {
    pdf.setFontSize(size)
    pdf.setTextColor(color)
    pdf.text(value, x, y)
    y += size > 16 ? 12 : size > 11 ? 8 : 6
  }
  const section = (title: string) => {
    if (y > 266) { pdf.addPage(); y = 18 }
    y += 3
    pdf.setDrawColor('#e5e8f1')
    pdf.line(left, y, right, y)
    y += 8
    addText(title, left, 12, '#5268c5')
  }
  const ensureRoom = (height = 7) => {
    if (y + height > 278) { pdf.addPage(); y = 18 }
  }

  pdf.setFillColor('#151b33')
  pdf.roundedRect(0, 0, 210, 43, 0, 0, 'F')
  addText('FinSight', left, 23, '#ffffff')
  addText(`${reportType} · ${period}`, left, 11, '#d7def7')
  y = 55
  addText('Your money, clearly summarized', left, 15, '#252b42')
  addText(`Prepared ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, left, 9, '#8a91a4')

  section('PERIOD SUMMARY')
  const metrics = [
    ['Income', currency(income)],
    ['Expenses', currency(expenses)],
    ['Net', currency(income - expenses)],
    ['Transactions', String(rows.length)],
  ]
  const colWidth = (right - left) / metrics.length
  metrics.forEach(([label, value], index) => {
    const x = left + index * colWidth
    pdf.setFillColor('#f7f8fc')
    pdf.roundedRect(x, y, colWidth - 3, 20, 2, 2, 'F')
    pdf.setFontSize(8)
    pdf.setTextColor('#8a91a4')
    pdf.text(label, x + 3, y + 7)
    pdf.setFontSize(10)
    pdf.setTextColor('#30364f')
    pdf.text(value, x + 3, y + 15)
  })
  y += 28

  if (reportType === 'Category-wise expenses' || reportType === 'Monthly summary' || reportType === 'Annual summary') {
    section('SPENDING BY CATEGORY')
    const categories = rows.filter((tx) => tx.type === 'expense').reduce<Record<string, number>>((totals, tx) => {
      totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount
      return totals
    }, {})
    const entries = Object.entries(categories).sort((a, b) => b[1] - a[1])
    if (!entries.length) { addText('No expense records for this period.', left, 9, '#8a91a4') }
    entries.forEach(([name, total]) => { ensureRoom(); addText(name, left, 9); pdf.text(currency(total), right, y - 6, { align: 'right' }) })
  }

  if (reportType === 'Budget performance' || reportType === 'Monthly summary') {
    section('BUDGET PERFORMANCE')
    if (!budgets.length) addText('No budgets have been set.', left, 9, '#8a91a4')
    budgets.forEach((budget) => {
      ensureRoom()
      const spent = rows.filter((tx) => tx.type === 'expense' && tx.category === budget.category).reduce((sum, tx) => sum + tx.amount, 0)
      addText(`${budget.category} · ${Math.round(budget.limit ? spent / budget.limit * 100 : 0)}% used`, left, 9)
      pdf.text(`${currency(spent)} / ${currency(budget.limit)}`, right, y - 6, { align: 'right' })
    })
  }

  if (reportType === 'Savings progress' || reportType === 'Monthly summary') {
    section('SAVINGS GOALS')
    if (!goals.length) addText('No savings goals have been added.', left, 9, '#8a91a4')
    goals.forEach((goal) => { ensureRoom(); addText(`${goal.name} · ${Math.round(goal.target ? goal.saved / goal.target * 100 : 0)}%`, left, 9); pdf.text(`${currency(goal.saved)} / ${currency(goal.target)}`, right, y - 6, { align: 'right' }) })
  }

  if (reportType !== 'Budget performance' && reportType !== 'Savings progress') {
    section('TRANSACTIONS')
    rows.slice(0, 40).forEach((tx) => {
      ensureRoom(8)
      addText(`${tx.date}  ·  ${tx.name.slice(0, 35)}  ·  ${tx.category}`, left, 8)
      pdf.text(`${tx.type === 'income' ? '+' : '−'}${currency(tx.amount)}`, right, y - 6, { align: 'right' })
    })
    if (rows.length > 40) addText(`Showing the first 40 of ${rows.length} transactions.`, left, 8, '#8a91a4')
    if (!rows.length) addText('No transactions for this period.', left, 9, '#8a91a4')
  }

  pdf.setFontSize(8)
  pdf.setTextColor('#9aa0af')
  pdf.text('Generated from the FinSight records stored in this browser.', left, 287)
  pdf.save(`finsight-${reportType.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-${prefix}.pdf`)
}
