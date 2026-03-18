import { FileText, Download, BarChart2, TrendingUp, PieChart, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const ReportsPage = () => {
    const [downloading, setDownloading] = useState(null);

    const handleDownload = (type) => {
        setDownloading(type);

        // Simulate network delay for realism
        setTimeout(() => {
            let filename, content, mime;

            if (type === 'dre') {
                filename = 'NexaFlow_Relatorio_DRE.txt';
                content = '--- DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO ---\n\nCompetência: Março 2026\n\nReceita Bruta: R$ 48.500,00\nDeduções (Impostos/Taxas): R$ 2.300,00\nReceita Líquida: R$ 46.200,00\nCustos Operacionais: R$ 5.630,00\n\nLucro Bruto: R$ 40.570,00\nMargem: 83.6%';
                mime = 'text/plain;charset=utf-8;';
            } else if (type === 'campaigns') {
                filename = 'NexaFlow_Performance_Campanhas.csv';
                content = 'Canal,Investimento,Cliques,Leads,CPA,CAC,ROAS\nMeta Ads,R$1500,3400,120,R$12.50,R$150,4.5x\nGoogle Ads,R$2000,1800,85,R$23.50,R$180,3.2x\nOrganico SEO,R$500,5600,210,R$2.38,R$45,18.0x';
                mime = 'text/csv;charset=utf-8;';
            } else if (type === 'funnel') {
                filename = 'NexaFlow_Eficiencia_Funil.csv';
                content = 'Etapa,Volume,Conversao_Para_Proxima\nNovos Leads,450,45%\nContatados,202,30%\nEm Negociacao,60,40%\nFechados,24,-';
                mime = 'text/csv;charset=utf-8;';
            } else if (type === 'extract') {
                filename = 'NexaFlow_Extrato_Auditoria.csv';
                content = 'ID,Data,Acao,Usuario,IP\nLOG-001,2026-03-18 10:00,Login,admin@nexaflow.com,192.168.1.1\nLOG-002,2026-03-18 10:15,Novo Lead Criado,admin@nexaflow.com,192.168.1.1\nLOG-003,2026-03-18 10:45,Exportacao Financeiro,admin@nexaflow.com,192.168.1.1';
                mime = 'text/csv;charset=utf-8;';
            }

            const blob = new Blob([content], { type: mime });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => setDownloading(null), 1500); // clear success state
        }, 800);
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="text-3xl font-bold">Relatórios Avançados</h1>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', width: 'fit-content', borderRadius: 'var(--radius-md)', color: 'var(--accent-secondary)' }}>
                        <BarChart2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Relatório de Vendas (DRE)</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Balanço detalhado de receita recorrente e novos MRR previstos por mês.</p>
                    <button onClick={() => handleDownload('dre')} className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', backgroundColor: downloading === 'dre' ? 'rgba(16, 185, 129, 0.1)' : '', color: downloading === 'dre' ? 'var(--success)' : '' }}>
                        {downloading === 'dre' ? <><CheckCircle2 size={18} /> Baixado</> : <><Download size={18} /> Gerar Relatório</>}
                    </button>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', width: 'fit-content', borderRadius: 'var(--radius-md)', color: '#8b5cf6' }}>
                        <TrendingUp size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Performance de Campanhas</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Métricas de CAC, LTV e ROI dividido por canais (Meta, Google, Orgânico).</p>
                    <button onClick={() => handleDownload('campaigns')} className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', backgroundColor: downloading === 'campaigns' ? 'rgba(16, 185, 129, 0.1)' : '', color: downloading === 'campaigns' ? 'var(--success)' : '' }}>
                        {downloading === 'campaigns' ? <><CheckCircle2 size={18} /> Baixado</> : <><Download size={18} /> Gerar Relatório</>}
                    </button>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', width: 'fit-content', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
                        <PieChart size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Eficiência do Funil</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Taxas de conversão exatas entre cada etapa do CRM (Nove Leads até Fechamento).</p>
                    <button onClick={() => handleDownload('funnel')} className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', backgroundColor: downloading === 'funnel' ? 'rgba(16, 185, 129, 0.1)' : '', color: downloading === 'funnel' ? 'var(--success)' : '' }}>
                        {downloading === 'funnel' ? <><CheckCircle2 size={18} /> Baixado</> : <><Download size={18} /> Gerar Relatório</>}
                    </button>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', width: 'fit-content', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
                        <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Extrato Completo (CSV)</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Exportação bruta de todos os dados do CRM e logs de auditoria do sistema.</p>
                    <button onClick={() => handleDownload('extract')} className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', backgroundColor: downloading === 'extract' ? 'rgba(16, 185, 129, 0.1)' : '', color: downloading === 'extract' ? 'var(--success)' : '' }}>
                        {downloading === 'extract' ? <><CheckCircle2 size={18} /> Concluído</> : <><Download size={18} /> Baixar .CSV</>}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ReportsPage;
