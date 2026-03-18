import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, SquareKanban, DollarSign, BarChart2, Users, Settings, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useState } from 'react';
import Logo from '../../components/Logo';

const AdminLayout = ({ isDarkMode, toggleTheme }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/admin/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-primary)' }}>
            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? '260px' : '80px',
                backgroundColor: 'var(--bg-card)',
                borderRight: '1px solid var(--border-color)',
                transition: 'width var(--transition-normal)',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflow: 'hidden'
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
                    <SidebarLink icon={<LayoutDashboard size={20} />} label="Visão Geral" to="/admin" isOpen={isSidebarOpen} end />
                    <SidebarLink icon={<SquareKanban size={20} />} label="Kanban de Vendas" to="/admin/kanban" isOpen={isSidebarOpen} />
                    <SidebarLink icon={<DollarSign size={20} />} label="Financeiro" to="/admin/finance" isOpen={isSidebarOpen} />
                    <SidebarLink icon={<BarChart2 size={20} />} label="Relatórios" to="/admin/reports" isOpen={isSidebarOpen} />

                    <div style={{ margin: '1rem 0', padding: '0 1rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                        {isSidebarOpen ? 'Gerenciamento' : '---'}
                    </div>

                    <SidebarLink icon={<Users size={20} />} label="Clientes" to="/admin/clients" isOpen={isSidebarOpen} />
                    <SidebarLink icon={<Settings size={20} />} label="Configurações" to="/admin/settings" isOpen={isSidebarOpen} />
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
                    padding: '0 2rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        {/* Pesquisa Global Mock */}
                        <input type="text" placeholder="Pesquisar em todo o CRM (Ctrl+K)..." style={{
                            padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', width: '100%', maxWidth: '400px',
                            outline: 'none', fontSize: '0.875rem'
                        }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

const SidebarLink = ({ icon, label, to, isOpen, end }) => {
    return (
        <NavLink
            to={to}
            end={end}
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
