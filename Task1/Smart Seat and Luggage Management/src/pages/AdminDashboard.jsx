import React, { useState, useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { ShieldAlert, Users, Briefcase, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { trainDetails, luggageSlots, alerts, generateAlert } = useContext(DatabaseContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('conflicts');

    // Basic analytics
    const totalPassengers = trainDetails.length;
    const occupiedLuggage = luggageSlots.filter(l => l.occupancy_status === 'Occupied').length;

    return (
        <div style={{ paddingBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2>TTE Admin Panel</h2>
                <button className="btn-primary" onClick={() => navigate('/verify')} style={{ width: 'auto', padding: '8px 16px' }}>
                    <Camera size={20} /> Verify QR
                </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: '12px' }}>
                    <Users size={24} color="var(--ir-blue)" />
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalPassengers}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Passengers</div>
                </div>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: '12px' }}>
                    <Briefcase size={24} color="#E67E22" />
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{occupiedLuggage}/{luggageSlots.length}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Luggage Filled</div>
                </div>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: '12px' }}>
                    <ShieldAlert size={24} color="var(--ir-red)" />
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ir-red)' }}>{alerts.length}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Alerts</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <button
                    onClick={() => setActiveTab('conflicts')}
                    style={{ flex: 1, padding: '12px', borderBottom: activeTab === 'conflicts' ? '3px solid var(--ir-red)' : 'none', fontWeight: activeTab === 'conflicts' ? 'bold' : 'normal', color: activeTab === 'conflicts' ? 'var(--ir-red)' : 'var(--text-muted)' }}
                >
                    Active Conflicts
                </button>
                <button
                    onClick={() => setActiveTab('allocation')}
                    style={{ flex: 1, padding: '12px', borderBottom: activeTab === 'allocation' ? '3px solid var(--ir-blue)' : 'none', fontWeight: activeTab === 'allocation' ? 'bold' : 'normal', color: activeTab === 'allocation' ? 'var(--ir-blue)' : 'var(--text-muted)' }}
                >
                    Seat & Luggage
                </button>
            </div>

            {activeTab === 'conflicts' && (
                <div>
                    {alerts.length === 0 ? (
                        <div className="text-center" style={{ color: 'var(--text-muted)', marginTop: '40px' }}>
                            <ShieldAlert size={48} color="var(--ir-green)" opacity={0.5} />
                            <p>No active conflicts</p>
                        </div>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert.alert_id} className="card" style={{ borderLeft: '4px solid var(--ir-red)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <strong style={{ color: 'var(--ir-red)' }}>{alert.issue_type}</strong>
                                        <div style={{ fontSize: '14px', marginTop: '4px' }}>{alert.details}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                                            {new Date(alert.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <button className="btn-primary" style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }} onClick={() => alert("Marked resolved")}>
                                        Resolve
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'allocation' && (
                <div>
                    {trainDetails.map(t => {
                        const lug = luggageSlots.find(l => l.assigned_passenger === t.passenger_id);
                        return (
                            <div key={t.pnr} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <strong>Coach {t.coach_number} - Seat {t.seat_number}</strong>
                                    <span style={{ fontSize: '12px', background: 'var(--ir-blue)', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>PNR: {t.pnr}</span>
                                </div>
                                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                    Luggage: {lug ? lug.location : 'None'} ({lug ? lug.occupancy_status : 'N/A'})
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
