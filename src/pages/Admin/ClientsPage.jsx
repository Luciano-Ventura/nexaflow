import { Users, Search, MoreHorizontal, Edit, Mail, Trash2, Ban, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

const ClientsPage = () => {
    const { boardData, deleteLead, addLead, updateLead } = useCrm();
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingClient, setIsAddingClient] = useState(false);
    const [isEditingClient, setIsEditingClient] = useState(false);
    const [formData, setFormData] = useState({ name: '', company: '', cnpj: '', phone: '', email: '', notes: '' });

    const toggleDropdown = (id) => {
        if (openDropdownId === id) {
            setOpenDropdownId(null);
        } else {
            setOpenDropdownId(id);
        }
    };

    const handleActionClick = (action, clientName) => {
        alert(`Ação "${action}" disparada para ${clientName}.`);
        setOpenDropdownId(null);
    };

    const handleSaveClient = (e) => {
        e.preventDefault();
        if (isEditingClient) {
            updateLead({ ...formData });
        } else {
            const newClient = {
                ...formData,
                id: 'c' + Date.now(),
                columnId: 'new',
                date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
                value: 0
            };
            addLead(newClient);
        }
        setIsAddingClient(false);
    };

    return (
        <div onClick={() => setOpenDropdownId(null)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className="text-2xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users color="var(--accent-secondary)" /> Clientes Registrados
                </h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem', color: 'var(--text-secondary)' }} />
                        <input type="text" placeholder="Buscar clientes..." className="input-field" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '2.5rem', width: '250px', borderRadius: 'var(--radius-full)' }} />
                    </div>
                    <button onClick={() => { setFormData({ name: '', company: '', cnpj: '', phone: '', email: '', notes: '' }); setIsEditingClient(false); setIsAddingClient(true); }} className="btn btn-primary btn-animated" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
                        <Plus size={18} /> Novo Cliente
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'visible' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Nome</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Empresa</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>E-mail</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>CNPJ</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boardData.cards
                            .filter(card => {
                                const term = searchTerm.toLowerCase();
                                return (
                                    (card.name && card.name.toLowerCase().includes(term)) ||
                                    (card.company && card.company.toLowerCase().includes(term)) ||
                                    (card.email && card.email.toLowerCase().includes(term)) ||
                                    (card.cnpj && card.cnpj.toLowerCase().includes(term))
                                );
                            })
                            .map(client => (
                                <tr key={client.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{client.name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{client.company}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{client.email || 'N/A'}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{client.cnpj || '---'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            backgroundColor: client.columnId === 'closed' ? 'rgba(16, 185, 129, 0.1)' : client.columnId === 'lost' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: client.columnId === 'closed' ? 'var(--success)' : client.columnId === 'lost' ? 'var(--error)' : '#3b82f6',
                                            padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600
                                        }}>
                                            {boardData.columns.find(col => col.id === client.columnId)?.title || 'Lead'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', position: 'relative' }}>
                                        <button
                                            style={{ color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', background: openDropdownId === client.id ? 'var(--bg-primary)' : 'transparent', transition: 'background 0.2s' }}
                                            onClick={(e) => { e.stopPropagation(); toggleDropdown(client.id); }}
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>

                                        {openDropdownId === client.id && (
                                            <div style={{
                                                position: 'absolute',
                                                right: '25px', top: '25px',
                                                backgroundColor: 'var(--bg-card)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: 'var(--radius-md)',
                                                boxShadow: 'var(--shadow-lg)',
                                                minWidth: '200px',
                                                zIndex: 100,
                                                display: 'flex', flexDirection: 'column',
                                                padding: '0.5rem',
                                                textAlign: 'left'
                                            }} onClick={(e) => e.stopPropagation()}>

                                                <button
                                                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', background: 'transparent', transition: 'background 0.2s', color: 'var(--text-primary)', zIndex: 101 }}
                                                    onMouseOver={(e) => e.target.style.background = 'var(--bg-primary)'}
                                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                                    onClick={(e) => { e.stopPropagation(); setFormData(client); setIsEditingClient(true); setIsAddingClient(true); setOpenDropdownId(null); }}
                                                >
                                                    <Edit size={16} /> Editar Dados
                                                </button>

                                                <button
                                                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', background: 'transparent', transition: 'background 0.2s', color: 'var(--text-primary)', zIndex: 101 }}
                                                    onMouseOver={(e) => e.target.style.background = 'var(--bg-primary)'}
                                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                                    onClick={(e) => { e.stopPropagation(); handleActionClick('Enviar E-mail', client.name); }}
                                                >
                                                    <Mail size={16} /> Enviar E-mail
                                                </button>

                                                <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }} />

                                                <button
                                                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', background: 'transparent', transition: 'background 0.2s', color: 'var(--warning)', zIndex: 101 }}
                                                    onMouseOver={(e) => e.target.style.background = 'rgba(245, 158, 11, 0.1)'}
                                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                                    onClick={(e) => { e.stopPropagation(); handleActionClick('Suspender', client.name); }}
                                                >
                                                    <Ban size={16} /> Suspender Conta
                                                </button>

                                                <button
                                                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', background: 'transparent', transition: 'background 0.2s', color: 'var(--error)', zIndex: 101 }}
                                                    onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                                    onClick={(e) => { e.stopPropagation(); deleteLead(client.id); setOpenDropdownId(null); }}
                                                >
                                                    <Trash2 size={16} /> Excluir Cliente
                                                </button>

                                            </div>
                                        )}

                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Client Modal */}
            {isAddingClient && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', padding: '2rem', boxShadow: 'var(--shadow-lg)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="text-xl font-bold">{isEditingClient ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                            <button onClick={() => setIsAddingClient(false)} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSaveClient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Nome Completo</label>
                                <input type="text" required className="input-field" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Nome da Empresa</label>
                                    <input type="text" required className="input-field" value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>CNPJ</label>
                                    <input type="text" className="input-field" placeholder="00.000.000/0000-00" value={formData.cnpj || ''} onChange={e => setFormData({ ...formData, cnpj: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Telefone / WhatsApp</label>
                                    <input type="tel" required className="input-field" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>E-mail</label>
                                    <input type="email" required className="input-field" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Anotações</label>
                                <textarea className="input-field" rows={3} value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsAddingClient(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditingClient ? 'Salvar Configurações' : 'Adicionar Cliente'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientsPage;
