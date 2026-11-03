import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Month = { month: string; income: number; expenses: number }
type Category = { name: string; value: number; color: string }
type Props = { kind: 'cashflow' | 'spending' | 'analytics'; months?: Month[]; categories?: Category[] }
const formatMoney = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

function Tip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip glass-tooltip">
      <div className="tooltip-header">
        <span className="tooltip-sparkle">✦</span>
        <b>{label}</b>
      </div>
      <div className="tooltip-body">
        {payload.map(p => (
          <div className="tooltip-row" key={p.name}>
            <span className="tooltip-dot" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}88` }} />
            <span className="tooltip-name">{p.name}</span>
            <strong className="tooltip-val">{formatMoney(p.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FinanceCharts({ kind, months = [], categories = [] }: Props) {
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (kind === 'spending') {
    const data = categories.length ? categories : [{ name: 'No spending yet', value: 1, color: '#c7ceda' }]
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={64}
            outerRadius={86}
            paddingAngle={3.5}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth={2}
            cornerRadius={5}
            isAnimationActive={!reduceMotion}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map(d => (
              <Cell key={d.name} fill={d.color} style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))', transition: 'all 0.3s ease' }} />
            ))}
          </Pie>
          <Tooltip content={<Tip />} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (kind === 'analytics') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={months} barGap={8} margin={{ top: 14, right: 14, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="barIncomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c8ff0" />
              <stop offset="100%" stopColor="#5569c7" />
            </linearGradient>
            <linearGradient id="barExpenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7ba87" />
              <stop offset="100%" stopColor="#e2874e" />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(140, 160, 200, 0.12)" strokeDasharray="3 5" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8d97aa', fontSize: 11, fontWeight: 500 }} dy={9} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9da7b8', fontSize: 10 }} tickFormatter={v => `${v / 1000}k`} />
          <Tooltip content={<Tip />} />
          <Bar
            dataKey="income"
            name="Income"
            fill="url(#barIncomeGrad)"
            radius={[6, 6, 0, 0]}
            maxBarSize={22}
            isAnimationActive={!reduceMotion}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="url(#barExpenseGrad)"
            radius={[6, 6, 0, 0]}
            maxBarSize={22}
            isAnimationActive={!reduceMotion}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={months} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeLuminous" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#677bd7" stopOpacity={0.35} />
            <stop offset="50%" stopColor="#8ea0f8" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#677bd7" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseLuminous" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3a970" stopOpacity={0.25} />
            <stop offset="70%" stopColor="#f8c89c" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#f3a970" stopOpacity={0} />
          </linearGradient>
          <filter id="glowShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#677bd7" floodOpacity="0.3" />
          </filter>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(140, 160, 200, 0.12)" strokeDasharray="3 5" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8d97aa', fontSize: 11, fontWeight: 500 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9da7b8', fontSize: 10 }} tickFormatter={v => `${v / 1000}k`} />
        <Tooltip content={<Tip />} />
        <Area
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="#6579d4"
          strokeWidth={2.8}
          fill="url(#incomeLuminous)"
          activeDot={{ r: 6, strokeWidth: 3, stroke: '#ffffff', fill: '#6579d4', style: { filter: 'drop-shadow(0 0 6px rgba(101, 121, 212, 0.8))' } }}
          isAnimationActive={!reduceMotion}
          animationDuration={850}
          animationEasing="ease-out"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          name="Expenses"
          stroke="#efaa70"
          strokeWidth={2.6}
          fill="url(#expenseLuminous)"
          activeDot={{ r: 6, strokeWidth: 3, stroke: '#ffffff', fill: '#efaa70', style: { filter: 'drop-shadow(0 0 6px rgba(239, 170, 112, 0.8))' } }}
          isAnimationActive={!reduceMotion}
          animationDuration={850}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
