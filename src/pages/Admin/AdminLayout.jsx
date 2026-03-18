import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, SquareKanban, DollarSign, BarChart2, Users, Settings, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '../../components/Logo';

const AdminLayout = ({ isDarkMode, toggleTheme }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(true);
            else setIsSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        navigate('/admin/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-primary)' }}>
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? '260px' : (isMobile ? '0px' : '80px'),
                backgroundColor: 'var(--bg-card)',
                borderRight: '1px solid var(--border-color)',
                transition: 'transform var(--transition-normal), width var(--transition-normal)',
                display: 'flex',
                flexDirection: 'column',
                position: isMobile ? 'fixed' : 'sticky',
                top: 0,
                left: 0,
                height: '100vh',
                overflow: 'hidden',
                zIndex: 50,
                transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)'
            }}>
                <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    borderBottom: '1px solid var(--border-color)',
                    justifyContent: isSidebarOpen ? 'space-between' : 'center'
                }}>
                    {isSidebarOpen && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Logo size={36} />
                            <span className="font-bold text-lg">NexaCRM</span>
                        </div>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: '0.25rem', color: 'var(--text-secondary)' }}>
                        <Menu size={20} />
                    </button>
                </div>

                <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
                    <SidebarLink icon={<LayoutDashboard size={20} />} label="Visão Geral" to="/admin" isOpen={isSidebarOpen} onClick={() => isMobile && setIsSidebarOpen(false)} end />
                    <SidebarLink icon={<SquareKanban size={20} />} label="Kanban de Vendas" to="/admin/kanban" isOpen={isSidebarOpen} onClick={() => isMobile && setIsSidebarOpen(false)} />
                    <SidebarLink icon={<DollarSign size={20} />} label="Financeiro" to="/admin/finance" isOpen={isSidebarOpen} onClick={() => isMobile && setIsSidebarOpen(false)} />
                    <SidebarLink icon={<BarChart2 size={20} />} label="Relatórios" to="/admin/reports" isOpen={isSidebarOpen} onClick={() => isMobile && setIsSidebarOpen(false)} />

                    <div style={{ margin: '1rem 0', padding: '0 1rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                        {isSidebarOpen ? 'Gerenciamento' : '---'}
                    </div>

                    <SidebarLink icon={<Users size={20} />} label="Clientes" to="/admin/clients" isOpen={isSidebarOpen} onClick={() => isMobile && setIsSidebarOpen(false)} />
                    <SidebarLink icon={<Settings size={20} />} label="Configurações" to="/admin/settings" isOpen={isSidebarOpen} onClick={() => isMobile && setIsSidebarOpen(false)} />
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button onClick={handleLogout} className="btn" style={{
                        width: '100%',
                        justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                        color: 'var(--error)',
                        padding: '0.75rem',
                        gap: '0.75rem'
                    }}>
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header style={{
                    height: '64px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        {isMobile && (
                            <button onClick={() => setIsSidebarOpen(true)} style={{ padding: '0.5rem', color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                <Menu size={24} />
                            </button>
                        )}
                        {/* Pesquisa Global Mock */}
                        <input type="text" placeholder="Pesquisar..." style={{
                            padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', width: '100%', maxWidth: '400px',
                            outline: 'none', fontSize: '0.875rem'
                        }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={toggleTheme} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ textAlign: 'right', display: 'none' }} className="sm-block">
                                <p style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>Administrador</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>admin@nexaflow.com</p>
                            </div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                AD
                            </div>
                        </div>
                    </div>
                </header>
                <main style={{ padding: '2rem', flex: 1, overflowX: 'auto', backgroundColor: 'var(--bg-primary)' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const SidebarLink = ({ icon, label, to, isOpen, onClick, end }) => {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                gap: '0.75rem',
                justifyContent: isOpen ? 'flex-start' : 'center',
                whiteSpace: 'nowrap'
            })}
        >
            {icon}
            {isOpen && <span style={{ fontWeight: '500' }}>{label}</span>}
        </NavLink>
    );
};

export default AdminLayout;
