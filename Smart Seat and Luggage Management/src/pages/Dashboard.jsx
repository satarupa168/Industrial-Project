import React, { useState, useContext, useEffect } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { translations } from '../utils/i18n';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Search, Train, Armchair, Briefcase, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { currentUser, trainDetails, luggageSlots, language } = useContext(DatabaseContext);
    const t = translations[language];
    const navigate = useNavigate();

    const [pnr, setPnr] = useState('');
    const [ticket, setTicket] = useState(null);
    const [luggage, setLuggage] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [error, setError] = useState('');

    // Redirect to login if unauth
    useEffect(() => {
        if (!currentUser) navigate('/login');
    }, [currentUser, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!currentUser) return;

        setError('');
        setShowQR(false);

        // Look up PNR linking to this current user
        const foundTicket = trainDetails.find(
            t => t.pnr === pnr && t.passenger_id === currentUser.id
        );

        if (foundTicket) {
            setTicket(foundTicket);
            // Find associated luggage slot
            const foundLuggage = luggageSlots.find(
                l => l.assigned_passenger === currentUser.id && l.coach_number === foundTicket.coach_number
            );
            setLuggage(foundLuggage);
        } else {
            setTicket(null);
            setLuggage(null);
            setError(t.noTicketFound);
        }
    };

    const getQRCodeData = () => {
        if (!ticket) return '';
        const data = {
            pnr: ticket.pnr,
            passenger_id: ticket.passenger_id,
            train: ticket.train_id,
            coach: ticket.coach_number,
            seat: ticket.seat_number,
            luggage_slot: luggage ? luggage.slot_id : null,
            timestamp: Date.now()
        };
        return JSON.stringify(data);
    };

    if (!currentUser) return null;

    return (
        <div style={{ paddingBottom: '30px' }}>
            <h2 style={{ marginBottom: '16px' }}>{t.dashboard}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Welcome, {currentUser.name}</p>

            {/* PNR Search Card */}
            <div className="card">
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={t.pnrEntry}
                        value={pnr}
                        onChange={(e) => setPnr(e.target.value)}
                        style={{ flex: 1 }}
                        required
                        maxLength={10}
                    />
                    <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px' }} title={t.findTicket}>
                        <Search size={20} />
                    </button>
                </form>
                {error && <p style={{ color: 'var(--ir-red)', marginTop: '8px', fontSize: '14px' }}>{error}</p>}
            </div>

            <AnimatePresence>
                {ticket && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Ticket Details */}
                        <div className="card" style={{ borderLeft: '4px solid var(--ir-blue)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Train size={24} color="var(--ir-blue)" />
                                <h3 style={{ margin: 0 }}>{t.trainDetails}</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                                <div>
                                    <div style={{ color: 'var(--text-muted)' }}>Train</div>
                                    <div style={{ fontWeight: 'bold' }}>{ticket.train_id} - {ticket.train_name}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)' }}>Date</div>
                                    <div style={{ fontWeight: 'bold' }}>{ticket.journey_date}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)' }}>From</div>
                                    <div style={{ fontWeight: 'bold' }}>{ticket.boarding}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)' }}>To</div>
                                    <div style={{ fontWeight: 'bold' }}>{ticket.destination}</div>
                                </div>
                            </div>
                        </div>

                        {/* Smart Seat & Luggage Details */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                            <div className="card" style={{ flex: 1, borderTop: '4px solid var(--ir-green)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <Armchair size={32} color="var(--ir-green)" />
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.seatAlloc}</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ir-green)' }}>
                                        {ticket.coach_number} - {ticket.seat_number}
                                    </div>
                                </div>
                            </div>

                            <div className="card" style={{ flex: 1, borderTop: '4px solid #E67E22' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <Briefcase size={32} color="#E67E22" />
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.luggageAlloc}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#E67E22', textAlign: 'center' }}>
                                        {luggage ? luggage.location : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Action */}
                        <button className="btn-primary" onClick={() => setShowQR(!showQR)} style={{ backgroundColor: 'var(--ir-blue-dark)' }}>
                            <QrCode size={20} />
                            {showQR ? 'Hide QR Code' : t.generateQR}
                        </button>

                        {/* QR Modal / View */}
                        <AnimatePresence>
                            {showQR && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className="card text-center mt-4">
                                        <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                            Show this QR to the TTE or Scanner at the coach entrance.
                                        </p>
                                        <div style={{ display: 'inline-block', padding: '16px', background: '#fff', borderRadius: '8px', border: '5px solid var(--ir-blue)' }}>
                                            <QRCodeSVG value={getQRCodeData()} size={200} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
