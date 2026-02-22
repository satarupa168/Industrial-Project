import React, { useState, useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { ScanFace, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyQR = () => {
    const { trainDetails, generateAlert } = useContext(DatabaseContext);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null); // { status: 'success' | 'error', message: string, details: string }

    // Simulate scanning a Valid QR
    const simulateValidScan = () => {
        setScanning(true);
        setResult(null);
        setTimeout(() => {
            setScanning(false);
            setResult({
                status: 'success',
                message: 'Match Validated',
                details: 'Passenger is in correct coach (B4) and correct seat (42).'
            });
        }, 1500);
    };

    // Simulate scanning an Invalid QR (Conflict)
    const simulateConflictScan = () => {
        setScanning(true);
        setResult(null);
        setTimeout(() => {
            setScanning(false);
            setResult({
                status: 'error',
                message: 'Conflict Detected',
                details: 'Passenger assigned to A2, found in B4. Alert sent to TTE.'
            });
            // Automatically generate alert for TTE
            generateAlert('Wrong Coach/Seat', 'Passenger assigned to A2 but scanned in B4.');
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>AI Verification Scanner</h2>

            {/* Scanner Viewport Simulation */}
            <div style={{
                width: '100%',
                maxWidth: '300px',
                height: '300px',
                backgroundColor: '#000',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                marginBottom: '24px'
            }}>
                {/* Scanning Animation */}
                {scanning && (
                    <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '4px',
                            backgroundColor: 'var(--ir-green)',
                            boxShadow: '0 0 15px 5px rgba(56, 142, 60, 0.5)',
                            zIndex: 10
                        }}
                    />
                )}

                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,255,255,0.3)' }}>
                    <ScanFace size={64} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <button className="btn-success" style={{ flex: 1, padding: '12px', borderRadius: '8px', color: '#fff', border: 'none', fontWeight: 'bold' }} onClick={simulateValidScan} disabled={scanning}>
                    Simulate Valid QR
                </button>
                <button className="btn-danger" style={{ flex: 1, padding: '12px', borderRadius: '8px', color: '#fff', border: 'none', fontWeight: 'bold' }} onClick={simulateConflictScan} disabled={scanning}>
                    Simulate Conflict QR
                </button>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                        style={{
                            width: '100%',
                            marginTop: '24px',
                            border: `2px solid ${result.status === 'success' ? 'var(--ir-green)' : 'var(--ir-red)'}`,
                            backgroundColor: result.status === 'success' ? 'rgba(56, 142, 60, 0.1)' : 'rgba(211, 47, 47, 0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {result.status === 'success' ? (
                                <CheckCircle size={32} color="var(--ir-green)" />
                            ) : (
                                <XCircle size={32} color="var(--ir-red)" />
                            )}
                            <div>
                                <h3 style={{ color: result.status === 'success' ? 'var(--ir-green)' : 'var(--ir-red)', margin: 0 }}>
                                    {result.message}
                                </h3>
                                <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-main)' }}>
                                    {result.details}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default VerifyQR;
