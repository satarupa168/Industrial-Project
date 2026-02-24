import React, { useState, useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { translations } from '../utils/i18n';
import { useNavigate, Link } from 'react-router-dom';
import { Train } from 'lucide-react';

const Login = () => {
    const { loginUser, language } = useContext(DatabaseContext);
    const t = translations[language];
    const navigate = useNavigate();

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Hardcoded logic for Admin
        if (mobile === '0000000000' && password === 'admin') {
            navigate('/admin');
            return;
        }

        const success = loginUser(mobile, password);
        if (success) {
            // simulate OTP
            alert('OTP 1234 sent (Simulated). Verified successfully!');
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="card" style={{ marginTop: '20px' }}>
            <div className="text-center mb-4">
                <Train size={48} color="var(--ir-blue)" />
                <h2 className="mt-4">{t.login}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Welcome to Smart Seat & Luggage</p>
            </div>

            {error && (
                <div style={{ backgroundColor: 'var(--ir-red)', color: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label">{t.mobileNumber}</label>
                    <input
                        type="text"
                        className="form-input"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="e.g. 9876543210 (or 0000000000 for Admin)"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">{t.password}</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
                    {t.login}
                </button>
            </form>

            <div className="text-center mt-4" style={{ fontSize: '14px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
                <Link to="/register" style={{ color: 'var(--ir-blue)', fontWeight: 'bold' }}>{t.register}</Link>
            </div>
        </div>
    );
};

export default Login;
