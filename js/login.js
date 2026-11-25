document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('roleSelect');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const forgotLink = document.getElementById('forgotLink');
    const infoBanner = document.getElementById('infoBanner');
    const mobileNavBtn = document.getElementById('mobileNavBtn');
    const navLinksContainer = document.querySelector('.nav-links');

    const knownAccounts = {
        admin: { name: 'Kawser Ahmed Asif', role: 'Administrator' },
        administrator: { name: 'Kawser Ahmed Asif', role: 'Administrator' },
        asif: { name: 'Kawser Ahmed Asif', role: 'Administrator' },
        manager: { name: 'Fahim Isteak', role: 'Manager' },
        fahim: { name: 'Fahim Isteak', role: 'Manager' },
        badhon: { name: 'Joachim Badhon Boiragee', role: 'Manager' },
        staff: { name: 'Esha Khan', role: 'Sales Staff' },
        esha: { name: 'Esha Khan', role: 'Sales Staff' },
        sales: { name: 'Esha Khan', role: 'Sales Staff' }
    };

    const roleDefaultNames = {
        Administrator: 'Kawser Ahmed Asif',
        Manager: 'Fahim Isteak',
        'Sales Staff': 'Esha Khan'
    };

    function resolveUserSession(rawInput, selectedRole) {
        const cleaned = (rawInput || '').trim().replace(/\s+/g, ' ');
        const lower = cleaned.toLowerCase();

        if (!cleaned) {
            return {
                name: roleDefaultNames[selectedRole] || 'Kawser Ahmed Asif',
                role: selectedRole || 'Administrator'
            };
        }

        if (knownAccounts[lower]) {
            return {
                name: knownAccounts[lower].name,
                role: selectedRole || knownAccounts[lower].role
            };
        }

        const formattedName = cleaned
            .replace(/[._-]+/g, ' ')
            .split(' ')
            .filter(Boolean)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');

        return {
            name: formattedName,
            role: selectedRole || 'Administrator'
        };
    }

    function showBanner(message) {
        if (!infoBanner) return;
        infoBanner.textContent = message;
        infoBanner.hidden = false;
    }

    if (usernameInput && roleSelect) {
        usernameInput.addEventListener('input', () => {
            const lower = usernameInput.value.trim().toLowerCase();
            if (lower === 'manager' || lower === 'fahim' || lower === 'badhon') {
                roleSelect.value = 'Manager';
            } else if (lower === 'staff' || lower === 'esha' || lower === 'sales') {
                roleSelect.value = 'Sales Staff';
            } else if (lower === 'admin' || lower === 'asif') {
                roleSelect.value = 'Administrator';
            }
        });
    }

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            const icon = togglePasswordBtn.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
            }
        });
    }

    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showBanner('Contact the shop Administrator to reset a local staff account password.');
        });
    }

    document.querySelectorAll('.nav-links a[data-info]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active', 'nav-pill'));
            link.classList.add('active', 'nav-pill');
            const mode = link.getAttribute('data-info');
            if (mode === 'fefo') {
                showBanner('FEFO Rule: Valid non-expired batches with the earliest expiry date are sold first; expired batches are rejected.');
            } else if (mode === 'roles') {
                showBanner('Roles: Administrator (accounts & reports), Manager (medicines, batches, purchases), Sales Staff (search & POS billing).');
            } else if (mode === 'about') {
                showBanner('Software Engineering Lab Project — Medicine Shop Management System (MSMS).');
            } else if (infoBanner) {
                infoBanner.hidden = true;
            }
            if (navLinksContainer) navLinksContainer.classList.remove('open');
        });
    });

    if (mobileNavBtn && navLinksContainer) {
        mobileNavBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawUser = usernameInput ? usernameInput.value : '';
            const chosenRole = roleSelect ? roleSelect.value : 'Administrator';
            const sessionUser = resolveUserSession(rawUser, chosenRole);
            const btn = loginForm.querySelector('.btn-signin');

            const payload = JSON.stringify(sessionUser);
            try {
                sessionStorage.setItem('medishop_session', payload);
                localStorage.setItem('medishop_last_session', payload);
            } catch (_) {
                // Ignore storage errors
            }

            if (btn) {
                btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Logging in...';
                btn.disabled = true;
            }

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 350);
        });
    }
});
