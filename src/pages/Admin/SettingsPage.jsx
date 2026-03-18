import { Settings } from 'lucide-react';

const SettingsPage = () => {
    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 className="text-2xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Settings color="var(--accent-secondary)" /> Configurações
            </h1>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                <div>
                    <h3 className="text-xl" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Perfil da Agência</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome da Agência</label>
                            <input type="text" className="input-field" defaultValue="NexaFlow Agency" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>E-mail de Contato Principal</label>
                            <input type="email" className="input-field" defaultValue="admin@nexaflow.com" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Preferências do CRM</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                            Notificar novos leads por e-mail
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                            Auto-atribuir novos leads à equipe de vendas
                        </label>
                    </div>
                </div>

                <button className="btn btn-primary" style={{ width: 'fit-content' }}>Salvar Alterações</button>

            </div>
        </div>
    );
};

export default SettingsPage;
