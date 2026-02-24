import React, { useState, useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { translations } from '../utils/i18n';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const { registerUser, language } = useContext(DatabaseContext);
    const t = translations[language];
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        registerUser(formData);
        alert('OTP 1234 sent (Simulated). Registered successfully!');
        navigate('/login');
    };

    return (
        <div className="card" style={{ marginTop: '20px' }}>
            <div className="text-center mb-4">
                <UserPlus size={48} color="var(--ir-blue)" />
                <h2 className="mt-4">{t.register}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Create an account to manage your trips</p>
            </div>

            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label className="form-label">{t.name}</label>
                    <input type="text" name="name" className="form-input" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">{t.mobileNumber}</label>
                    <input type="tel" name="mobile" className="form-input" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">{t.email}</label>
                    <input type="email" name="email" className="form-input" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">{t.password}</label>
                    <input type="password" name="password" className="form-input" onChange={handleChange} required />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
                    {t.register}
                </button>
            </form>

            <div className="text-center mt-4" style={{ fontSize: '14px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
                <Link to="/login" style={{ color: 'var(--ir-blue)', fontWeight: 'bold' }}>{t.login}</Link>
            </div>
        </div>
    );
};

export default Register;
