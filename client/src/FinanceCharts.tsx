import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Month = { month: string; income: number; expenses: number }
type Category = { name: string; value: number; color: string }
type Props = { kind: 'cashflow' | 'spending' | 'analytics'; months?: Month[]; categories?: Category[] }
const formatMoney = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
function Tip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return <div className="chart-tooltip"><b>{label}</b>{payload.map(p => <span key={p.name}><i style={{ background: p.color }}/>{p.name} <strong>{formatMoney(p.value)}</strong></span>)}</div>
}

export default function FinanceCharts({ kind, months = [], categories = [] }: Props) {
  if (kind === 'spending') {
    const data = categories.length ? categories : [{ name: 'No spending yet', value: 1, color: '#c7ceda' }]
    return <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={84} paddingAngle={3} stroke="none" cornerRadius={4}>{data.map(d => <Cell key={d.name} fill={d.color}/>)}</Pie><Tooltip formatter={value => formatMoney(Number(value))}/></PieChart></ResponsiveContainer>
  }
  if (kind === 'analytics') return <ResponsiveContainer width="100%" height="100%"><BarChart data={months} barGap={9} margin={{top:12,right:12,left:-10,bottom:0}}><CartesianGrid vertical={false} stroke="#edf0f5" strokeDasharray="4 6"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#98a0af',fontSize:11}} dy={9}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#a6adba',fontSize:10}} tickFormatter={v=>`${v/1000}k`}/><Tooltip content={<Tip/>}/><Bar dataKey="income" name="Income" fill="#7587df" radius={[5,5,0,0]} maxBarSize={20}/><Bar dataKey="expenses" name="Expenses" fill="#f2b07a" radius={[5,5,0,0]} maxBarSize={20}/></BarChart></ResponsiveContainer>
  return <ResponsiveContainer width="100%" height="100%"><AreaChart data={months} margin={{top:12,right:10,left:-18,bottom:0}}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#677bd7" stopOpacity={.18}/><stop offset="95%" stopColor="#677bd7" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0f5" strokeDasharray="4 6"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#98a0af',fontSize:11}} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#a6adba',fontSize:10}} tickFormatter={v=>`${v/1000}k`}/><Tooltip content={<Tip/>}/><Area type="monotone" dataKey="income" name="Income" stroke="#6579d4" strokeWidth={2.5} fill="url(#incomeFill)" activeDot={{r:5,strokeWidth:3,stroke:'#fff'}}/><Area type="monotone" dataKey="expenses" name="Expenses" stroke="#efaa70" strokeWidth={2.5} fill="transparent" activeDot={{r:5,strokeWidth:3,stroke:'#fff'}}/></AreaChart></ResponsiveContainer>
}
