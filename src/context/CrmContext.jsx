import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { supabase } from '../lib/services/supabase';
const CrmContext = createContext();

export const useCrm = () => {
    return useContext(CrmContext);
};

export const CrmProvider = ({ children }) => {
    // 1. Finance State
    const [transactions, setTransactions] = useState([]);

    // 2. Kanban Deals/Leads State
    const [boardData, setBoardData] = useState({
        columns: [
            { id: 'new', title: 'Novos Leads', color: '#3B82F6' },
            { id: 'contacted', title: 'Contatados', color: '#F59E0B' },
            { id: 'negotiation', title: 'Em Negociação', color: '#8B5CF6' },
            { id: 'closed', title: 'Fechados/Ganhos', color: '#10B981' },
            { id: 'lost', title: 'Perdidos', color: '#EF4444' }
        ],
        cards: []
    });

    // 3. System Logs (Recent Activities)
    const [activities, setActivities] = useState([]);

    const logActivity = (action, target) => {
        const time = `Hoje, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        setActivities(prev => [{ id: Date.now(), time, user: 'Você', action, target }, ...prev].slice(0, 10)); // keep last 10
    };

    // --- SUPABASE INTEGRATION ---
    const STATUS_MAP = {
        'new': 'novo',
        'contacted': 'contato',
        'negotiation': 'negociacao',
        'closed': 'fechado',
        'lost': 'perdido'
    };
    const COL_MAP = {
        'novo': 'new',
        'contato': 'contacted',
        'negociacao': 'negotiation',
        'fechado': 'closed',
        'perdido': 'lost'
    };

    const fetchLeads = async () => {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (data) {
            setBoardData(prev => ({
                ...prev,
                cards: data.map(lead => ({
                    id: lead.id,
                    columnId: COL_MAP[lead.status] || 'new',
                    name: lead.nome || '',
                    company: lead.empresa || '',
                    phone: lead.telefone || '',
                    email: lead.email || '',
                    cnpj: lead.cnpj || '',
                    notes: lead.tipo_negocio || '',
                    date: lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('pt-BR'),
                    value: 0
                }))
            }));
        } else if (error) {
            console.error("Erro ao buscar leads:", error.message);
        }
    };

    const fetchTransactions = async () => {
        const { data, error } = await supabase.from('financeiro').select('*').order('created_at', { ascending: false });
        if (data) {
            setTransactions(data.map(t => ({
                id: t.id,
                date: new Date(t.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
                client: t.cliente || '',
                desc: t.descricao || '',
                type: t.tipo === 'entrada' ? 'in' : 'out',
                amount: Number(t.valor) || 0,
                status: t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1) : 'Pendente',
                category: t.frequencia || 'one-time',
                rawDate: t.created_at
            })));
        } else if (error) {
            console.error("Erro buscar financeiro:", error);
        }
    };

    useEffect(() => {
        fetchLeads();
        fetchTransactions();

        const leadsSubscription = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'leads' },
                (payload) => {
                    console.log('Realtime DB Change:', payload);
                    fetchLeads();
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'financeiro' },
                () => {
                    fetchTransactions();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(leadsSubscription);
        };
    }, []);

    const updateLeadStatusDb = async (leadId, newColumnId) => {
        const statusName = STATUS_MAP[newColumnId] || 'novo';
        const { error } = await supabase.from('leads').update({ status: statusName }).eq('id', leadId);
        if (error) console.error("Erro ao atualizar status do lead:", error);
    };
    // ---------------------------

    // Actions
    const addTransaction = async (trx) => {
        const optimisticId = 'temp-trx-' + Date.now();
        setTransactions(prev => [{ ...trx, id: optimisticId }, ...prev]);
        logActivity('registrou uma nova transação', `de R$ ${trx.amount}`);

        const { data, error } = await supabase.from('financeiro').insert([{
            cliente: trx.client,
            descricao: trx.desc,
            tipo: trx.type === 'in' ? 'entrada' : 'saida',
            valor: trx.amount,
            status: (trx.status || 'pendente').toLowerCase(),
            frequencia: trx.category
        }]).select();

        if (error) {
            console.error("Erro inserindo finance", error);
            setTransactions(prev => prev.filter(t => t.id !== optimisticId));
        } else if (data && data[0]) {
            setTransactions(prev => prev.map(t => t.id === optimisticId ? { ...t, id: data[0].id } : t));
        }
    };

    const updateBoardData = (newData, draggedCardId, targetColumnId) => {
        setBoardData(newData);
        if (draggedCardId && targetColumnId) {
            updateLeadStatusDb(draggedCardId, targetColumnId);
            logActivity('moveu o lead no funil', '');
        }
    };

    const addLead = async (lead) => {
        const optimisticId = 'temp-lead-' + Date.now();
        const optimisticLead = { ...lead, id: optimisticId };

        // Optimistic UI updates avoid waiting for network
        setBoardData(prev => ({
            ...prev,
            cards: [optimisticLead, ...prev.cards]
        }));
        logActivity('adicionou o lead', lead.name);

        const { data, error } = await supabase.from('leads').insert([{
            nome: lead.name,
            telefone: lead.phone,
            empresa: lead.company,
            tipo_negocio: lead.notes,
            status: STATUS_MAP[lead.columnId] || 'novo',
            email: lead.email || null,
            cnpj: lead.cnpj || null
        }]).select();

        if (error) {
            console.error("Erro ao inserir lead no Supabase:", error);
            setBoardData(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== optimisticId) }));
        } else if (data && data[0]) {
            setBoardData(prev => ({
                ...prev,
                cards: prev.cards.map(c => c.id === optimisticId ? { ...c, id: data[0].id } : c)
            }));
        }
    };

    const updateLead = async (updatedLead) => {
        setBoardData(prev => ({
            ...prev,
            cards: prev.cards.map(c => c.id === updatedLead.id ? updatedLead : c)
        }));
        logActivity('editou o lead', updatedLead.name);

        // Se a ID for númerica ou string simples, é temporary ou se já esteva no BD, tenta update
        if (typeof updatedLead.id === 'number' || (typeof updatedLead.id === 'string' && updatedLead.id.length > 20)) {
            const { error } = await supabase.from('leads').update({
                nome: updatedLead.name,
                telefone: updatedLead.phone,
                empresa: updatedLead.company,
                tipo_negocio: updatedLead.notes,
                status: STATUS_MAP[updatedLead.columnId] || 'novo',
                email: updatedLead.email || null,
                cnpj: updatedLead.cnpj || null
            }).eq('id', updatedLead.id);
            if (error) console.error("Erro ao atualizar lead:", error);
        }
    };

    const deleteLead = async (leadId) => {
        const leadName = boardData.cards.find(c => c.id === leadId)?.name;
        setBoardData(prev => ({
            ...prev,
            cards: prev.cards.filter(c => c.id !== leadId)
        }));
        if (leadName) logActivity('excluiu o lead', leadName);

        // Delete in supabase
        const { error } = await supabase.from('leads').delete().eq('id', leadId);
        if (error) console.error("Erro deletando lead", error);
    };

    const deleteTransaction = async (trxId) => {
        setTransactions(prev => prev.filter(t => t.id !== trxId));
        logActivity('excluiu uma transação', trxId);

        const { error } = await supabase.from('financeiro').delete().eq('id', trxId);
        if (error) console.error("Erro ao deletar", error);
    };

    const updateTransaction = async (updatedTrx) => {
        setTransactions(prev => prev.map(t => t.id === updatedTrx.id ? updatedTrx : t));
        logActivity('atualizou a transação', updatedTrx.id);

        if (typeof updatedTrx.id !== 'string' || !updatedTrx.id.startsWith('temp-')) {
            const { error } = await supabase.from('financeiro').update({
                cliente: updatedTrx.client,
                descricao: updatedTrx.desc,
                tipo: updatedTrx.type === 'in' ? 'entrada' : 'saida',
                valor: updatedTrx.amount,
                status: (updatedTrx.status || 'pendente').toLowerCase(),
                frequencia: updatedTrx.category
            }).eq('id', updatedTrx.id);
            if (error) console.error("Erro ao atualizar", error);
        }
    };

    // Computed Dashboard Metrics
    const metrics = useMemo(() => {
        // Finance
        const revenue = transactions.filter(t => t.type === 'in' && t.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0);
        const expenses = transactions.filter(t => t.type === 'out').reduce((acc, curr) => acc + curr.amount, 0);
        const balance = revenue - expenses;
        const mrr = transactions.filter(t => t.type === 'in' && t.category === 'recurring').reduce((acc, curr) => acc + curr.amount, 0);

        // Leads
        const totalLeads = boardData.cards.length;
        const newLeads = boardData.cards.filter(c => c.columnId === 'new').length;
        const closedDeals = boardData.cards.filter(c => c.columnId === 'closed').length;
        const conversionRate = totalLeads > 0 ? ((closedDeals / totalLeads) * 100).toFixed(1) : 0;

        return {
            revenue,
            expenses,
            balance,
            mrr,
            totalLeads,
            newLeads,
            closedDeals,
            conversionRate
        };
    }, [transactions, boardData]);

    return (
        <CrmContext.Provider value={{
            transactions, addTransaction, deleteTransaction, updateTransaction,
            boardData, updateBoardData, addLead, updateLead, deleteLead,
            activities, logActivity,
            metrics
        }}>
            {children}
        </CrmContext.Provider>
    );
};
