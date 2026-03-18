import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, Pickaxe, Users, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCrm } from '../../context/CrmContext';
import { useMemo } from 'react';

const parseDateBR = (dateStr) => {
    if (!dateStr) return new Date();
    const str = dateStr.toLowerCase().replace(/ de /g, ' ');
    const parts = str.split(' ');
    if (parts.length < 3) return new Date();
    const day = parseInt(parts[0]);
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const month = months.findIndex(m => parts[1].startsWith(m));
    const year = parseInt(parts[2]);
    return new Date(year, month !== -1 ? month : new Date().getMonth(), day);
};

const StatCard = ({ title, value, icon, trend, trendValue }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</h3>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-secondary)' }}>
                {icon}
            </div>
        </div>
        <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: trend === 'up' ? 'var(--success)' : 'var(--error)', display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                    {trend === 'up' ? <TrendingUp size={16} style={{ marginRight: '0.25rem' }} /> : <TrendingUp size={16} style={{ marginRight: '0.25rem', transform: 'scaleY(-1)' }} />}
                    {trendValue}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>vs mês anterior</span>
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    const { metrics, activities, transactions, boardData } = useCrm();

    const revenueData = useMemo(() => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            data.push({
                name: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()],
                month: d.getMonth(),
                year: d.getFullYear(),
                revenue: 0,
                expenses: 0
            });
        }

        transactions.forEach(trx => {
            const d = parseDateBR(trx.date);
            const bucket = data.find(b => b.month === d.getMonth() && b.year === d.getFullYear());
            if (bucket) {
                if (trx.type === 'in') bucket.revenue += trx.amount;
                if (trx.type === 'out') bucket.expenses += trx.amount;
            }
        });
        return data;
    }, [transactions]);

    const leadsData = useMemo(() => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            data.push({
                name: days[d.getDay()],
                dateStr: d.toDateString(),
                leads: 0
            });
        }

        boardData.cards.forEach(card => {
            const d = parseDateBR(card.date);
            d.setHours(0, 0, 0, 0);
            const bucket = data.find(b => b.dateStr === d.toDateString());
            if (bucket) {
                bucket.leads += 1;
            }
        });
        return data;
    }, [boardData]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>Visão Geral</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Acompanhe o desempenho das suas vendas e receitas.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <Calendar size={18} color="var(--text-secondary)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Últimos 30 dias</span>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Receita Prevista (MRR)" value={`R$ ${metrics.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<DollarSign size={20} />} trend="up" trendValue="+14%" />
                <StatCard title="Novos Leads" value={metrics.newLeads.toString()} icon={<Users size={20} />} trend="up" trendValue="+22%" />
                <StatCard title="Taxa de Conversão" value={`${metrics.conversionRate}%`} icon={<Pickaxe size={20} />} trend="up" trendValue="+1.2%" />
                <StatCard title="Negócios Fechados" value={metrics.closedDeals.toString()} icon={<TrendingUp size={20} />} trend="up" trendValue="+5%" />
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Receita Chart */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="text-xl font-bold">Fluxo de Receita</h3>
                        <Link to="/admin/reports" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', textDecoration: 'none' }}>Relatório Completo <ArrowUpRight size={16} /></Link>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} dy={10} />
                                <YAxis width={55} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(value) => `R$${value / 1000}k`} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} itemStyle={{ color: 'var(--text-primary)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Leads Chart */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                    <h3 className="text-xl font-bold">Captura de Leads (Semana)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={leadsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                                <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                                <Bar dataKey="leads" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Atividades Recentes Placeholder */}
            <div className="card">
                <h3 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Atividades Recentes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activities.map((activity, i) => (
                        <div key={activity.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: i !== activities.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)', marginTop: '0.4rem' }} />
                            <div>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{activity.time}</p>
                                <p style={{ margin: 0, fontWeight: 500 }}>
                                    <strong>{activity.user}</strong> {activity.action} <span style={{ color: 'var(--accent-secondary)' }}>{activity.target}</span>.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
