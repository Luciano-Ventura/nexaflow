import { useState, useRef } from 'react';
import { MoreHorizontal, Plus, Search, X, MessageSquare, Mail, Phone, Trash } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

const CrmBoard = () => {
    const { boardData, updateBoardData, addLead, updateLead, deleteLead } = useCrm();
    const data = boardData;
    const [selectedLead, setSelectedLead] = useState(null);
    const [isAddingLead, setIsAddingLead] = useState(false);
    const [isEditingLead, setIsEditingLead] = useState(false);
    const [formData, setFormData] = useState({ name: '', company: '', cnpj: '', phone: '', email: '', notes: '' });
    const dragItem = useRef();
    const dragNode = useRef();

    const handleWhatsApp = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    const handleSaveLead = (e) => {
        e.preventDefault();
        if (isEditingLead) {
            updateLead({ ...formData });
        } else {
            const newCard = {
                ...formData,
                id: 'c' + Date.now(),
                columnId: 'new',
                date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
                value: 0
            };
            addLead(newCard);
        }
        setIsAddingLead(false);
    };

    const handleDragStart = (e, params) => {
        dragItem.current = params;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', handleDragEnd);
    };

    const handleDragEnter = (e, targetColumnId) => {
        if (dragNode.current !== e.target) {
            let newData = JSON.parse(JSON.stringify(boardData));
            const itemToMove = newData.cards.findIndex(card => card.id === dragItem.current.cardId);
            if (newData.cards[itemToMove].columnId !== targetColumnId) {
                newData.cards[itemToMove].columnId = targetColumnId;
                dragItem.current.columnId = targetColumnId;
                updateBoardData(newData, dragItem.current.cardId, targetColumnId);
            }
        }
    };

    const handleDragEnd = () => {
        if (dragNode.current) {
            dragNode.current.removeEventListener('dragend', handleDragEnd);
            dragItem.current = null;
            dragNode.current = null;
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleLeadClick = (card) => {
        setSelectedLead(card);
    };

    const closeLeadModal = () => {
        setSelectedLead(null);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className="text-2xl font-bold">Funil de Vendas (CRM)</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem', color: 'var(--text-secondary)' }} />
                        <input type="text" placeholder="Buscar leads..." className="input-field" style={{ paddingLeft: '2.5rem', paddingRight: '1rem', width: '250px', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: 'var(--radius-full)' }} />
                    </div>
                    <button onClick={() => { setFormData({ name: '', company: '', cnpj: '', phone: '', email: '', notes: '' }); setIsEditingLead(false); setIsAddingLead(true); }} className="btn btn-primary btn-animated" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
                        <Plus size={18} /> Novo Lead
                    </button>
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                flex: 1,
                alignItems: 'flex-start'
            }}>
                {data.columns.map(column => (
                    <div
                        key={column.id}
                        style={{
                            minWidth: '300px',
                            width: '300px',
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '100%'
                        }}
                        onDragEnter={e => handleDragEnter(e, column.id)}
                        onDragOver={handleDragOver}
                    >
                        <div style={{
                            padding: '1rem',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: column.color }} />
                                <h3 className="font-bold">{column.title}</h3>
                                <span style={{
                                    backgroundColor: 'var(--bg-primary)', padding: '0.125rem 0.5rem',
                                    borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 'bold'
                                }}>
                                    {data.cards.filter(c => c.columnId === column.id).length}
                                </span>
                            </div>
                            <button style={{ color: 'var(--text-secondary)' }} onClick={() => alert('Opções da coluna: ' + column.title)}>
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: '150px' }}>
                            {data.cards
                                .filter(card => card.columnId === column.id)
                                .map(card => (
                                    <div
                                        key={card.id}
                                        draggable
                                        onDragStart={e => handleDragStart(e, { cardId: card.id, columnId: column.id })}
                                        style={{
                                            backgroundColor: 'var(--bg-primary)',
                                            padding: '1rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            cursor: 'grab',
                                            boxShadow: 'var(--shadow-sm)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ fontWeight: '600', margin: 0 }}>{card.name}</h4>
                                            <button style={{ color: 'var(--text-secondary)', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }} onClick={() => handleLeadClick(card)}>
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '0 0 0.25rem 0' }}>{card.company}</p>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0 }}>{card.phone}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lead Details Modal */}
            {selectedLead && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={closeLeadModal}>
                    <div style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-lg)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="text-2xl font-bold">Detalhes do Lead</h2>
                            <button onClick={closeLeadModal} style={{ color: 'var(--text-secondary)' }}><X size={24} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Nome Completo</label>
                                <div style={{ fontSize: '1.125rem', fontWeight: '500' }}>{selectedLead.name}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Empresa</label>
                                    <div>{selectedLead.company}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>CNPJ</label>
                                    <div>{selectedLead.cnpj || 'Não informado'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Telefone</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {selectedLead.phone}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>E-mail</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {selectedLead.email}</div>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Notas</label>
                                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                                    {selectedLead.notes}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                            <button onClick={() => handleWhatsApp(selectedLead.phone)} className="btn btn-primary" style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                <MessageSquare size={18} /> Chamar no WhatsApp
                            </button>
                            <button onClick={() => { setFormData(selectedLead); setIsEditingLead(true); setIsAddingLead(true); setSelectedLead(null); }} className="btn btn-secondary">
                                Editar Lead
                            </button>
                            <button onClick={() => { if (window.confirm('Excluir este lead?')) { deleteLead(selectedLead.id); setSelectedLead(null); } }} className="btn" style={{ padding: '0.5rem', color: 'var(--error)' }}>
                                <Trash size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Lead Modal */}
            {isAddingLead && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', padding: '2rem', boxShadow: 'var(--shadow-lg)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="text-xl font-bold">{isEditingLead ? 'Editar Lead' : 'Novo Lead'}</h2>
                            <button onClick={() => setIsAddingLead(false)} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSaveLead} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Nome Completo</label>
                                <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Nome da Empresa</label>
                                    <input type="text" required className="input-field" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>CNPJ</label>
                                    <input type="text" className="input-field" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => setFormData({ ...formData, cnpj: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Telefone / WhatsApp</label>
                                    <input type="tel" required className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>E-mail</label>
                                    <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>Anotações Iniciais</label>
                                <textarea className="input-field" rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsAddingLead(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditingLead ? 'Salvar Configurações' : 'Adicionar Lead'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrmBoard;
