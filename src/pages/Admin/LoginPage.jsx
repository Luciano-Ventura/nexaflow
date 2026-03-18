import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Info } from 'lucide-react';
import Logo from '../../components/Logo';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'admin@nexaflow.com' && password === 'admin123') {
            navigate('/admin');
        } else {
            alert('Credenciais inválidas! Use admin@nexaflow.com e admin123');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem', borderTop: '4px solid var(--accent-secondary)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Logo size={80} className="mb-4" />
                <h2 className="text-2xl font-bold">Painel Administrativo</h2>
                <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Insira suas credenciais para acessar o CRM</p>
            </div>

            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
                <Info size={18} color="var(--accent-secondary)" />
                <div>
                    <strong>Acesso de Teste:</strong><br />
                    Usuário: <code>admin@nexaflow.com</code><br />
                    Senha: <code>admin123</code>
                </div>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Endereço de E-mail</label>
                    <input
                        type="email" required className="input-field"
                        placeholder="admin@nexaflow.com"
                        value={email} onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: '500' }}>Senha</label>
                        <a href="#" style={{ fontSize: '0.875rem', color: 'var(--accent-secondary)' }}>Esqueceu?</a>
                    </div>
                    <input
                        type="password" required className="input-field"
                        placeholder="••••••••"
                        value={password} onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-animated" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>
                    Entrar <ArrowRight size={18} />
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
