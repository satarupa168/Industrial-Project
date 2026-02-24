import React, { createContext, useState, useEffect } from 'react';

export const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
    // --- Simulated Database Tables --- //

    // Users Table
    const [users, setUsers] = useState([
        { id: 1, name: 'Amit Sharma', mobile: '9876543210', email: 'amit@example.com', password: 'password123' },
        { id: 2, name: 'Priya Patel', mobile: '8765432109', email: 'priya@example.com', password: 'password123' },
    ]);

    // TrainDetails Table
    // Includes PNR details to fetch passenger info
    const [trainDetails, setTrainDetails] = useState([
        { pnr: '1234567890', passenger_id: 1, train_id: '12301', train_name: 'HWH NDLS Rajdhani Exp', coach_number: 'B4', seat_number: '42', boarding: 'Howrah (HWH)', destination: 'New Delhi (NDLS)', journey_date: '2026-03-01' },
        { pnr: '0987654321', passenger_id: 2, train_id: '12273', train_name: 'HWH NDLS Duronto Exp', coach_number: 'A2', seat_number: '14', boarding: 'Howrah (HWH)', destination: 'New Delhi (NDLS)', journey_date: '2026-03-05' },
    ]);

    // LuggageSlots Table
    const [luggageSlots, setLuggageSlots] = useState([
        { slot_id: 'B4-L42', coach_number: 'B4', assigned_passenger: 1, location: 'Upper Rack 1', occupancy_status: 'Free' },
        { slot_id: 'A2-L14', coach_number: 'A2', assigned_passenger: 2, location: 'Lower Rack 2', occupancy_status: 'Occupied' },
    ]);

    // Alerts Table for TTE Dashboard
    const [alerts, setAlerts] = useState([
        { alert_id: 101, passenger_id: null, issue_type: 'Luggage Overflow', timestamp: new Date().toISOString(), status: 'Unresolved', details: 'Coach B4 Rack 1 is overloaded' },
    ]);

    // Active Session State
    const [currentUser, setCurrentUser] = useState(null);

    // Theme and Localization State
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en'); // 'en' or 'hi'

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Database actions
    const registerUser = (user) => {
        const newUser = { ...user, id: users.length + 1 };
        setUsers([...users, newUser]);
        return newUser;
    };

    const loginUser = (mobile, password) => {
        const user = users.find(u => u.mobile === mobile && u.password === password);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const generateAlert = (issue_type, details, passenger_id = null) => {
        const newAlert = {
            alert_id: Date.now(),
            passenger_id,
            issue_type,
            timestamp: new Date().toISOString(),
            status: 'Unresolved',
            details
        };
        setAlerts([newAlert, ...alerts]);
    };

    return (
        <DatabaseContext.Provider value={{
            users,
            trainDetails,
            luggageSlots,
            alerts,
            currentUser,
            registerUser,
            loginUser,
            logout,
            generateAlert,
            theme,
            setTheme,
            language,
            setLanguage
        }}>
            {children}
        </DatabaseContext.Provider>
    );
};
