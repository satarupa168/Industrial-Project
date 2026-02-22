import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';

// Pages - Placeholders
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VerifyQR from './pages/VerifyQR';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';

function AppContent() {
    return (
        <div className="app-container">
            <Header />
            <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/verify" element={<VerifyQR />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <DatabaseProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </DatabaseProvider>
    );
}

export default App;
