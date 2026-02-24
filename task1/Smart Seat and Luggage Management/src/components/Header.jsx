import React, { useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { translations } from '../utils/i18n';
import { Moon, Sun, Translate, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const { theme, setTheme, language, setLanguage, currentUser, logout } = useContext(DatabaseContext);
    const t = translations[language];
    const navigate = useNavigate();
    const location = useLocation();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const toggleLang = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Hide header on auth pages if preferred, but let's keep a simplified one
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: 'var(--ir-blue)',
            color: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Indian_Railways_Logo.svg" alt="IR Logo" style={{ width: 32, height: 32, filter: 'brightness(0) invert(1)' }} />
                <span style={{ flex: 1 }}>{t.appTitle}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button onClick={toggleLang} style={{ color: '#fff' }} title="Toggle Language">
                    <Translate size={20} />
                </button>
                <button onClick={toggleTheme} style={{ color: '#fff' }} title="Toggle Theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                {currentUser && !isAuthPage && (
                    <button onClick={handleLogout} style={{ color: '#fff' }} title="Logout">
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
