// --- 1. SIMULATED DATABASE ---
const db = {
    users: [
        { id: 1, name: 'Amit Sharma', mobile: '9876543210', password: 'password123' },
        { id: 2, name: 'Priya Patel', mobile: '8765432109', password: 'password123' }
    ],
    trainDetails: [
        { pnr: '1234567890', passenger_id: 1, train: '12301 - Rajdhani Exp', date: '2026-03-01', from: 'Howrah (HWH)', to: 'New Delhi (NDLS)', coach: 'B4', seat: '42' },
        { pnr: '0987654321', passenger_id: 2, train: '12273 - Duronto Exp', date: '2026-03-05', from: 'Howrah (HWH)', to: 'New Delhi (NDLS)', coach: 'A2', seat: '14' }
    ],
    luggageSlots: [
        { slot_id: 'B4-L42', coach: 'B4', passenger_id: 1, location: 'Upper Rack 1', status: 'Free' },
        { slot_id: 'A2-L14', coach: 'A2', passenger_id: 2, location: 'Lower Rack 2', status: 'Occupied' }
    ],
    alerts: [
        { id: 101, type: 'Luggage Overflow', details: 'Coach B4 Rack 1 overloaded', time: new Date().toLocaleTimeString() }
    ]
};

// Global App State
let currentUser = null;
let currentLanguage = 'en';

// Translations Dictionary
const i18n = {
    en: { appTitle: "Smart Seat & Luggage" },
    hi: { appTitle: "स्मार्ट सीट और लगेज" }
};

// --- 2. DOM ELEMENTS ---
const sections = {
    login: document.getElementById('login-section'),
    register: document.getElementById('register-section'),
    dashboard: document.getElementById('dashboard-section'),
    admin: document.getElementById('admin-section')
};

// Modals & Triggers
const scannerModal = document.getElementById('scanner-modal');
const btnOpenScanner = document.getElementById('btn-open-scanner');
const btnCloseScanner = document.getElementById('btn-close-scanner');
const scannerLaser = document.getElementById('scanner-laser');
const scanResult = document.getElementById('scan-result');
const scanIcon = document.getElementById('scan-icon');
const scanTitle = document.getElementById('scan-title');
const scanDesc = document.getElementById('scan-desc');

// Header Buttons
const langToggle = document.getElementById('lang-toggle');
const themeToggle = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logout-btn');

// --- 3. NAVIGATION LOGIC ---
function showSection(sectionId) {
    Object.values(sections).forEach(s => s.classList.add('hidden'));
    sections[sectionId].classList.remove('hidden');
    sections[sectionId].classList.add('fade-in');

    if (sectionId === 'login' || sectionId === 'register') {
        logoutBtn.classList.add('hidden');
    } else {
        logoutBtn.classList.remove('hidden');
    }
}

document.getElementById('link-register').addEventListener('click', () => showSection('register'));
document.getElementById('link-login').addEventListener('click', () => showSection('login'));

// Logout
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    showSection('login');
    document.getElementById('ticket-container').classList.add('hidden');
    document.getElementById('login-mobile').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('qrcode').innerHTML = ''; // Clear QR
});

// --- 4. AUTHENTICATION LOGIC ---
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');

    const mobile = document.getElementById('login-mobile').value;
    const password = document.getElementById('login-password').value;

    // Admin login
    if (mobile === '0000000000' && password === 'admin') {
        currentUser = { role: 'admin', name: 'TTE Admin' };
        renderAdminDashboard();
        showSection('admin');
        return;
    }

    // Passenger login
    const user = db.users.find(u => u.mobile === mobile && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('user-greeting').innerText = `Welcome, ${user.name}`;
        showSection('dashboard');
    } else {
        loginError.classList.remove('hidden');
    }
});

const regForm = document.getElementById('register-form');
regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const mobile = document.getElementById('reg-mobile').value;
    const password = document.getElementById('reg-password').value;

    db.users.push({ id: db.users.length + 1, name, mobile, password });
    alert('Registered simulated! You can now login.');
    showSection('login');
});

// --- 5. DASHBOARD & PNR LOGIC ---
const pnrForm = document.getElementById('pnr-form');
const pnrInput = document.getElementById('pnr-input');
const pnrError = document.getElementById('pnr-error');
const ticketContainer = document.getElementById('ticket-container');
let qrCodeObj = null;

pnrForm.addEventListener('submit', (e) => {
    e.preventDefault();
    pnrError.classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');

    const pnr = pnrInput.value;
    const ticket = db.trainDetails.find(t => t.pnr === pnr && t.passenger_id === currentUser.id);

    if (ticket) {
        const luggage = db.luggageSlots.find(l => l.passenger_id === currentUser.id && l.coach === ticket.coach);

        document.getElementById('tick-train').innerText = ticket.train;
        document.getElementById('tick-date').innerText = ticket.date;
        document.getElementById('tick-from').innerText = ticket.from;
        document.getElementById('tick-to').innerText = ticket.to;
        document.getElementById('tick-seat').innerText = `${ticket.coach} - ${ticket.seat}`;
        document.getElementById('tick-luggage').innerText = luggage ? luggage.location : 'Pending';

        // Prepare data for QR
        const qrData = JSON.stringify({
            pnr: ticket.pnr,
            name: currentUser.name,
            seat: `${ticket.coach}-${ticket.seat}`
        });

        // Set up QR Code Generator
        document.getElementById('qrcode').innerHTML = ''; // Clear old
        qrCodeObj = new QRCode(document.getElementById('qrcode'), {
            text: qrData,
            width: 150,
            height: 150,
            colorDark: "#0033A0",
            colorLight: "#ffffff",
        });

        ticketContainer.classList.remove('hidden');
    } else {
        ticketContainer.classList.add('hidden');
        pnrError.classList.remove('hidden');
    }
});

document.getElementById('btn-show-qr').addEventListener('click', () => {
    const qrContainer = document.getElementById('qr-container');
    qrContainer.classList.toggle('hidden');
});

// --- 6. ADMIN & TTE PANEL LOGIC ---

function renderAdminDashboard() {
    // Update Stats
    document.getElementById('stat-passengers').innerText = db.trainDetails.length;
    document.getElementById('stat-luggage').innerText = `${db.luggageSlots.filter(l => l.status === 'Occupied').length}/${db.luggageSlots.length}`;
    document.getElementById('stat-alerts').innerText = db.alerts.length;

    renderConflicts();
    renderAllocations();
}

function renderConflicts() {
    const container = document.getElementById('admin-conflicts-view');
    container.innerHTML = '';

    if (db.alerts.length === 0) {
        container.innerHTML = '<div class="text-center text-muted mt-3"><p>No active conflicts</p></div>';
        return;
    }

    db.alerts.forEach(alert => {
        const div = document.createElement('div');
        div.className = 'card border-left-blue mt-2';
        div.style.borderLeftColor = 'var(--ir-red)';
        div.innerHTML = `
            <div class="flex-row justify-between">
                <div>
                    <strong class="text-danger">${alert.type}</strong>
                    <div class="text-sm mt-1">${alert.details}</div>
                    <div class="text-sm text-muted mt-1">${alert.time}</div>
                </div>
                <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:12px;">Resolve</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderAllocations() {
    const container = document.getElementById('admin-allocation-view');
    container.innerHTML = '';

    db.trainDetails.forEach(t => {
        const lug = db.luggageSlots.find(l => l.passenger_id === t.passenger_id);
        const div = document.createElement('div');
        div.className = 'card mt-2';
        div.innerHTML = `
            <div class="flex-row justify-between mb-1">
                <strong>Coach ${t.coach} - Seat ${t.seat}</strong>
                <span style="font-size:12px; background:var(--ir-blue); color:#fff; padding:2px 8px; border-radius:12px;">PNR: ${t.pnr}</span>
            </div>
            <div class="text-sm text-muted">Luggage: ${lug ? lug.location : 'None'} (${lug ? lug.status : 'N/A'})</div>
        `;
        container.appendChild(div);
    });
}

// Admin Tabs
document.getElementById('tab-conflicts').addEventListener('click', (e) => {
    e.target.classList.add('fw-bold');
    document.getElementById('tab-allocation').classList.remove('fw-bold');
    document.getElementById('admin-conflicts-view').classList.remove('hidden');
    document.getElementById('admin-allocation-view').classList.add('hidden');
});

document.getElementById('tab-allocation').addEventListener('click', (e) => {
    e.target.classList.add('fw-bold');
    document.getElementById('tab-conflicts').classList.remove('fw-bold');
    document.getElementById('admin-allocation-view').classList.remove('hidden');
    document.getElementById('admin-conflicts-view').classList.add('hidden');
});

// --- 7. AI VERIFICATION SCANNER LOGIC ---

btnOpenScanner.addEventListener('click', () => {
    scannerModal.classList.remove('hidden');
    scanResult.classList.add('hidden'); // reset old
});
btnCloseScanner.addEventListener('click', () => scannerModal.classList.add('hidden'));

document.getElementById('btn-sim-valid').addEventListener('click', () => simulateScan('valid'));
document.getElementById('btn-sim-invalid').addEventListener('click', () => simulateScan('error'));

function simulateScan(type) {
    // Disable buttons
    document.getElementById('btn-sim-valid').disabled = true;
    document.getElementById('btn-sim-invalid').disabled = true;

    scannerLaser.classList.remove('hidden');
    scanResult.classList.add('hidden');

    setTimeout(() => {
        scannerLaser.classList.add('hidden');
        scanResult.classList.remove('hidden');

        document.getElementById('btn-sim-valid').disabled = false;
        document.getElementById('btn-sim-invalid').disabled = false;

        if (type === 'valid') {
            scanResult.style.backgroundColor = 'rgba(56, 142, 60, 0.1)';
            scanResult.style.borderColor = 'var(--ir-green)';
            scanIcon.className = 'fa-solid fa-circle-check fa-2x text-green';
            scanTitle.className = 'm-0 text-green';
            scanTitle.innerText = "Match Validated";
            scanDesc.innerText = "Passenger is in correct coach (B4) and correct seat (42).";
        } else {
            scanResult.style.backgroundColor = 'rgba(211, 47, 47, 0.1)';
            scanResult.style.borderColor = 'var(--ir-red)';
            scanIcon.className = 'fa-solid fa-circle-xmark fa-2x text-danger';
            scanTitle.className = 'm-0 text-danger';
            scanTitle.innerText = "Conflict Detected";
            scanDesc.innerText = "Passenger assigned to A2, found in B4. Alert sent to TTE.";

            // Push alert dynamically
            db.alerts.unshift({ id: Date.now(), type: 'Wrong Coach', details: 'Passenger A2 seen in B4', time: new Date().toLocaleTimeString() });
            renderAdminDashboard(); // Refresh background UI
        }
    }, 1500);
}

// --- 8. THEME & HEADER CONTROLS ---

themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
});

langToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    const appTitleEl = document.getElementById('app-title');
    appTitleEl.innerText = i18n[currentLanguage].appTitle;

    // More translations could be wired here if fully expanding the dictionary
});
