import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const Navbar = ({ isDarkMode, toggleTheme }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0'
        }}>
            <div className="container flex justify-between items-center">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Logo size={40} />
                    <span className="text-xl" style={{ fontWeight: '800' }}>NexaFlow</span>
                </div>

                {/* Desktop Menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
                    <a href="#services" style={{ fontWeight: '500' }}>Serviços</a>
                    <a href="#process" style={{ fontWeight: '500' }}>Processo</a>
                    <a href="#contact" style={{ fontWeight: '500' }}>Contato</a>
                    <button onClick={toggleTheme} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <a href="#contact" className="btn btn-primary btn-animated" style={{ padding: '0.5rem 1rem' }}>Começar Agora</a>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-nav-toggle" style={{ display: 'none' }}>
                    <button onClick={toggleMenu} style={{ padding: '0.5rem', color: 'var(--text-primary)' }}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>

            {isOpen && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: 'var(--bg-primary)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '1rem',
                    display: 'flex', flexDirection: 'column', gap: '1rem'
                }}>
                    <a href="#services" onClick={toggleMenu}>Serviços</a>
                    <a href="#process" onClick={toggleMenu}>Processo</a>
                    <a href="#contact" onClick={toggleMenu}>Contato</a>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Tema</span>
                        <button onClick={toggleTheme} style={{ padding: '0.5rem' }}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                    <a href="#contact" className="btn btn-primary btn-animated" style={{ justifyContent: 'center' }} onClick={toggleMenu}>Começar Agora</a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
