import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, Download, X, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

const FinancePage = () => {
    const { transactions, addTransaction, updateTransaction, metrics, boardData } = useCrm();
    const [isAddingTrx, setIsAddingTrx] = useState(false);
    const [isEditingTrx, setIsEditingTrx] = useState(false);
    const [formData, setFormData] = useState({ client: '', desc: '', type: 'in', amount: '', status: 'Pago', category: 'recurring' });

    const handleExport = () => {
        const headers = ['ID', 'Data', 'Cliente/Fornecedor', 'Descrição', 'Tipo', 'Valor', 'Status'];
        const csvContent = [
            headers.join(','),
            ...transactions.map(t => `${t.id},${t.date},${t.client},${t.desc},${t.type},${t.amount},${t.status}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'nexaflow_relatorio_financeiro.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddTrx = (e) => {
        e.preventDefault();

        if (isEditingTrx) {
            updateTransaction({
                ...formData,
                client: formData.client === 'Outro' ? formData.customClient : formData.client,
                amount: parseFloat(formData.amount) || 0
            });
        } else {
            const newTrx = {
                id: `TRX-${100 + transactions.length + 1}`,
                date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
                ...formData,
                client: formData.client === 'Outro' ? formData.customClient : formData.client,
                amount: parseFloat(formData.amount) || 0
            };
            addTransaction(newTrx);
        }

        setIsAddingTrx(false);
        setIsEditingTrx(false);
        setFormData({ client: '', customClient: '', desc: '', type: 'in', amount: '', status: 'Pago', category: 'recurring' });
    };

    const handleEditTrx = (trx) => {
        setFormData(trx);
        setIsEditingTrx(true);
        setIsAddingTrx(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="text-3xl font-bold">Gestão Financeira</h1>
                <button onClick={handleExport} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem' }}>
                    <Download size={18} /> Exportar Relatório
                </button>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ background: 'var(--grad-primary)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.8)' }}>Saldo Disponível</span>
                        <Wallet size={24} />
                    </div>
                    <h2 className="text-4xl font-bold" style={{ color: 'white', margin: 0 }}>R$ {metrics.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>Última atualização: Hoje, 10:45</p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Receitas (Mês)</span>
                        <ArrowUpRight size={24} color="var(--success)" />
                    </div>
                    <h2 className="text-3xl font-bold text-gradient">R$ {metrics.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--success)' }}>+15% em relação ao mês anterior</p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Despesas (Mês)</span>
                        <ArrowDownRight size={24} color="var(--error)" />
                    </div>
                    <h2 className="text-3xl font-bold">R$ {metrics.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Dentro do orçamento previsto</p>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="text-xl font-bold">Transações Recentes</h3>
                    <button onClick={() => { setIsEditingTrx(false); setFormData({ client: '', customClient: '', desc: '', type: 'in', amount: '', status: 'Pago', category: 'recurring' }); setIsAddingTrx(true); }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>+ Nova Transação</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem' }}>Data</th>
                            <th style={{ padding: '1rem' }}>Cliente/Fornecedor</th>
                            <th style={{ padding: '1rem' }}>Descrição</th>
                            <th style={{ padding: '1rem' }}>Valor</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((trx, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{trx.id}</td>
                                <td style={{ padding: '1rem' }}>{trx.date}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{trx.client}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{trx.desc}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold', color: trx.type === 'in' ? 'var(--success)' : 'var(--text-primary)' }}>
                                    {trx.type === 'in' ? '+ ' : '- '}R$ {trx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        backgroundColor: trx.status === 'Pago' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: trx.status === 'Pago' ? 'var(--success)' : 'var(--warning)',
                                        padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600
                                    }}>
                                        {trx.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => handleEditTrx(trx)} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Nova/Editar Transação */}
            {isAddingTrx && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '450px', padding: '2rem', boxShadow: 'var(--shadow-lg)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="text-xl font-bold">{isEditingTrx ? 'Editar Transação' : 'Nova Transação'}</h2>
                            <button onClick={() => setIsAddingTrx(false)} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleAddTrx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Cliente / Fornecedor</label>
                                <select required className="input-field" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })}>
                                    <option value="" disabled>Selecione ou adicione um...</option>
                                    {boardData.cards.map(lead => (
                                        <option key={lead.id} value={lead.name}>{lead.name} {lead.company ? `(${lead.company})` : ''}</option>
                                    ))}
                                    <option value="Outro">Outro Cliente / Despesa Livre</option>
                                </select>
                                {formData.client === 'Outro' && (
                                    <input type="text" required placeholder="Nome do favorecido..." className="input-field" style={{ marginTop: '0.5rem' }} value={formData.customClient || ''} onChange={e => setFormData({ ...formData, customClient: e.target.value })} />
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Descrição</label>
                                <input type="text" required className="input-field" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Tipo</label>
                                    <select className="input-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="in">Receita (Entrada)</option>
                                        <option value="out">Despesa (Saída)</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Valor (R$)</label>
                                    <input type="number" step="0.01" required className="input-field" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Frequência (Receita)</label>
                                    <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="recurring">Recorrente (Soma no MRR)</option>
                                        <option value="one-time">Pagamento Único</option>
                                        <option value="expense">Despesa Extra</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Status</label>
                                    <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="Pago">Pago</option>
                                        <option value="Pendente">Pendente</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsAddingTrx(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditingTrx ? 'Salvar Alterações' : 'Registrar Transação'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default FinancePage;
