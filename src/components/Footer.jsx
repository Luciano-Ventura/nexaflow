import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            padding: '4rem 0 2rem 0',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div className="grid" style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: 'var(--grad-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 'bold'
                            }}>N</div>
                            <span className="text-xl" style={{ fontWeight: '800' }}>NexaFlow</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Construímos sistemas de crescimento para empresas usando IA, automação e tráfego pago.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Empresa</h4>
                        <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                            <a href="#services" style={{ color: 'var(--text-secondary)' }}>Serviços</a>
                            <a href="#process" style={{ color: 'var(--text-secondary)' }}>Processo</a>
                            <a href="#contact" style={{ color: 'var(--text-secondary)' }}>Contato</a>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Legal</h4>
                        <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                            <a href="#" style={{ color: 'var(--text-secondary)' }}>Política de Privacidade</a>
                            <a href="#" style={{ color: 'var(--text-secondary)' }}>Termos de Serviço</a>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Restrito</h4>
                        <div className="flex flex-col" style={{ gap: '0.75rem' }}>
                            <Link to="/admin/login" className="btn btn-secondary btn-animated" style={{ width: 'fit-content' }}>
                                Painel Admin
                            </Link>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                }}>
                    <p>&copy; {new Date().getFullYear()} NexaFlow Agency. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
