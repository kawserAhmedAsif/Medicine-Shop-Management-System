document.addEventListener('DOMContentLoaded', () => {
    function getInitials(fullName) {
        const parts = (fullName || 'Kawser Ahmed Asif').trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'KA';
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    let activeUser = { name: 'Kawser Ahmed Asif', role: 'Administrator' };
    try {
        const rawSession = sessionStorage.getItem('medishop_session') || localStorage.getItem('medishop_last_session');
        if (rawSession) {
            const parsed = JSON.parse(rawSession);
            if (parsed && parsed.name) {
                activeUser = {
                    name: String(parsed.name).trim(),
                    role: String(parsed.role || 'Administrator').trim()
                };
            }
        }
    } catch (_) {
        // Ignore storage restrictions
    }

    const profileNameEl = document.getElementById('profileName');
    const profileRoleEl = document.getElementById('profileRole');
    const userInitialsEl = document.getElementById('userInitials');
    const profileChipEl = document.getElementById('profileChip');

    if (profileNameEl) profileNameEl.textContent = activeUser.name;
    if (profileRoleEl) profileRoleEl.textContent = activeUser.role;
    if (userInitialsEl) userInitialsEl.textContent = getInitials(activeUser.name);
    if (profileChipEl) {
        profileChipEl.addEventListener('click', () => {
            showToast(`Signed in as ${activeUser.name} (${activeUser.role})`);
        });
    }

    const initialProducts = [
        { id: '#001', name: 'Paracetamol', strength: '500mg', category: 'Pain Relievers', qty: 120, price: 5.00, expiry: '15-03-2027', status: 'In stock', batch: 'B-101' },
        { id: '#002', name: 'Amoxicillin', strength: '250mg', category: 'Antibiotics', qty: 45, price: 7.50, expiry: '01-12-2026', status: 'Low stock', batch: 'B-204' },
        { id: '#003', name: 'Ibuprofen', strength: '200mg', category: 'Pain Relievers', qty: 0, price: 6.00, expiry: '15-11-2025', status: 'Out of stock', batch: 'B-112' },
        { id: '#004', name: 'Cetirizine', strength: '10mg', category: 'Allergy Medication', qty: 150, price: 3.50, expiry: '30-08-2027', status: 'In stock', batch: 'B-409' },
        { id: '#005', name: 'Azithromycin', strength: '500mg', category: 'Antibiotics', qty: 88, price: 11.20, expiry: '20-05-2027', status: 'In stock', batch: 'B-219' },
        { id: '#006', name: 'Metformin XR', strength: '500mg', category: 'Diabetes Care', qty: 24, price: 6.80, expiry: '10-02-2027', status: 'Low stock', batch: 'B-502' },
        { id: '#007', name: 'Atorvastatin', strength: '20mg', category: 'Cardiovascular', qty: 132, price: 9.40, expiry: '18-09-2027', status: 'In stock', batch: 'B-611' },
        { id: '#008', name: 'Salbutamol Inhaler', strength: '100mcg', category: 'Respiratory Medicines', qty: 64, price: 8.75, expiry: '12-07-2027', status: 'In stock', batch: 'B-803' },
        { id: '#009', name: 'Oseltamivir', strength: '75mg', category: 'Antiviral Drugs', qty: 0, price: 14.00, expiry: '05-01-2026', status: 'Out of stock', batch: 'B-315' },
        { id: '#010', name: 'Vitamin D3 + K2', strength: '1000IU', category: 'Vitamins & Supplements', qty: 190, price: 7.25, expiry: '28-10-2027', status: 'In stock', batch: 'B-710' }
    ];

    const initialOrders = [
        { id: '#ORD001', customer: 'John Smith', date: '25-11-2026', items: ['Paracetamol (2)', 'Ibuprofen (1)'], total: 25.50, payment: 'Paid', status: 'Completed' },
        { id: '#ORD002', customer: 'Emily Davis', date: '24-11-2026', items: ['Amoxicillin (3)', 'Cetirizine (2)'], total: 42.00, payment: 'Pending', status: 'In progress' },
        { id: '#ORD003', customer: 'Michael Johnson', date: '23-11-2026', items: ['Loratadine (1)', 'Omeprazole (1)'], total: 15.00, payment: 'Paid', status: 'Pending' },
        { id: '#ORD004', customer: 'Sarah Lee', date: '22-11-2026', items: ['Aspirin (4)', 'Hydrocodone (1)'], total: 48.00, payment: 'Paid', status: 'Completed' },
        { id: '#ORD005', customer: 'David Brown', date: '22-11-2026', items: ['Albuterol Inhaler (1)', 'Warfarin (2)'], total: 55.00, payment: 'Failed', status: 'Cancelled' },
        { id: '#ORD006', customer: 'Lisa Williams', date: '21-11-2026', items: ['Simvastatin (3)', 'Levothyroxine (2)'], total: 22.50, payment: 'Paid', status: 'Completed' },
        { id: '#ORD007', customer: 'Paul Martinez', date: '20-11-2026', items: ['Doxycycline (5)', 'Omeprazole (3)'], total: 45.00, payment: 'Paid', status: 'Completed' },
        { id: '#ORD008', customer: 'Anna Taylor', date: '19-11-2026', items: ['Cetirizine (2)', 'Albuterol Inhaler (1)'], total: 30.00, payment: 'Pending', status: 'In progress' },
        { id: '#ORD009', customer: 'Chris Moore', date: '18-11-2026', items: ['Paracetamol (3)', 'Ibuprofen (4)'], total: 35.00, payment: 'Paid', status: 'Completed' },
        { id: '#ORD010', customer: 'Karen Wilson', date: '17-11-2026', items: ['Azithromycin (2)', 'Vitamin D3 + K2 (1)'], total: 29.70, payment: 'Paid', status: 'Completed' }
    ];

    let products = [...initialProducts];
    let orders = [...initialOrders];
    let cart = [];

    let productState = { search: '', category: 'all', status: 'all', page: 1, pageSize: 4 };
    let orderState = { search: '', payment: 'all', status: 'all', page: 1, pageSize: 9 };

    const viewMeta = {
        'view-inventory': { title: 'Product List', subtitle: "Let's check your pharmacy today" },
        'view-orders': { title: 'Order List', subtitle: "Let's check your pharmacy today" },
        'view-dashboard': { title: 'Dashboard Overview', subtitle: 'Daily dispensary sales and expiry health' },
        'view-sales': { title: 'Point of Sale (FEFO)', subtitle: 'Allocate earliest-expiry valid batches first' },
        'view-purchases': { title: 'Supplier Purchases', subtitle: 'Record incoming medicine deliveries and batch stock' },
        'view-customers': { title: 'Customer Directory', subtitle: 'Patient purchase history and contact records' },
        'view-reports': { title: 'Reports & Exports', subtitle: 'Download inventory and order summaries' },
        'view-help': { title: 'Help & Support', subtitle: 'Standard pharmacy batch and role guidelines' },
        'view-settings': { title: 'Settings', subtitle: 'Configure alert thresholds and shop profile' }
    };

    function showToast(msg) {
        const toast = document.getElementById('toastBanner');
        if (!toast) return;
        toast.textContent = msg;
        toast.hidden = false;
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
            toast.hidden = true;
        }, 2800);
    }

    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const collapseSidebar = document.getElementById('collapseSidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('show');
        });
    }
    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', () => sidebar.classList.remove('show'));
    }
    if (collapseSidebar && sidebar) {
        collapseSidebar.addEventListener('click', () => sidebar.classList.toggle('compact'));
    }
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('show')) {
            if (!sidebar.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
                sidebar.classList.remove('show');
            }
        }
    });

    const allNavLinks = document.querySelectorAll('.sidebar-menu a, .sidebar-secondary a, .brand-logo[data-target]');
    const contentViews = document.querySelectorAll('.content-view');
    const topbarPageTitle = document.getElementById('topbarPageTitle');
    const topbarSubtitle = document.getElementById('topbarSubtitle');

    function activateView(targetId) {
        document.querySelectorAll('.sidebar-menu li, .sidebar-secondary li').forEach(item => item.classList.remove('active'));
        const matchingLink = document.querySelector(`.sidebar-menu a[data-target="${targetId}"], .sidebar-secondary a[data-target="${targetId}"]`);
        if (matchingLink && matchingLink.parentElement) {
            matchingLink.parentElement.classList.add('active');
        }

        contentViews.forEach(view => view.classList.remove('active'));
        const targetView = document.getElementById(targetId);
        if (targetView) targetView.classList.add('active');

        if (viewMeta[targetId]) {
            if (topbarPageTitle) topbarPageTitle.textContent = viewMeta[targetId].title;
            if (topbarSubtitle) topbarSubtitle.textContent = viewMeta[targetId].subtitle;
        }

        if (targetId === 'view-sales') renderPosGrid();
        if (window.innerWidth <= 768 && sidebar) sidebar.classList.remove('show');
    }

    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if (target) activateView(target);
        });
    });

    const promoRuleBtn = document.getElementById('promoRuleBtn');
    if (promoRuleBtn) {
        promoRuleBtn.addEventListener('click', () => {
            activateView('view-sales');
            showToast('FEFO active: expired stock is blocked automatically.');
        });
    }

    const jumpToOrdersBtn = document.getElementById('jumpToOrdersBtn');
    if (jumpToOrdersBtn) {
        jumpToOrdersBtn.addEventListener('click', () => activateView('view-orders'));
    }

    const alertBellBtn = document.getElementById('alertBellBtn');
    const alertPopover = document.getElementById('alertPopover');
    const closeAlertsBtn = document.getElementById('closeAlertsBtn');
    if (alertBellBtn && alertPopover) {
        alertBellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            alertPopover.hidden = !alertPopover.hidden;
        });
    }
    if (closeAlertsBtn && alertPopover) {
        closeAlertsBtn.addEventListener('click', () => {
            alertPopover.hidden = true;
        });
    }
    document.addEventListener('click', (e) => {
        if (alertPopover && !alertPopover.hidden && !alertPopover.contains(e.target) && e.target !== alertBellBtn) {
            alertPopover.hidden = true;
        }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            try {
                sessionStorage.removeItem('medishop_session');
                localStorage.removeItem('medishop_last_session');
            } catch (_) {
                // Ignore storage restrictions
            }
            window.location.href = 'index.html';
        });
    }

    const catCards = document.querySelectorAll('.cat-card[data-category]');
    const filterCategorySelect = document.getElementById('filterCategorySelect');
    catCards.forEach(card => {
        card.addEventListener('click', () => {
            catCards.forEach(c => c.classList.remove('featured'));
            card.classList.add('featured');
            const selectedCat = card.getAttribute('data-category');
            productState.category = productState.category === selectedCat ? 'all' : selectedCat;
            if (filterCategorySelect) filterCategorySelect.value = productState.category;
            productState.page = 1;
            renderProductsTable();
            showToast(productState.category === 'all' ? 'Showing all medicine categories' : `Filtered by ${productState.category}`);
        });
    });

    document.querySelectorAll('.summary-card .card-more[data-filter-status]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const st = btn.getAttribute('data-filter-status');
            productState.status = st === 'all' ? 'all' : st;
            const filterStockSelect = document.getElementById('filterStockSelect');
            if (filterStockSelect) filterStockSelect.value = productState.status;
            productState.page = 1;
            renderProductsTable();
        });
    });

    function getStatusBadgeClass(status) {
        const key = status.toLowerCase().replace(/\s+/g, '-');
        if (key === 'in-stock') return 'in-stock';
        if (key === 'low-stock') return 'low-stock';
        return 'out-of-stock';
    }

    function renderProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        const pagination = document.getElementById('productPagination');
        const countLabel = document.getElementById('productTotalCountLabel');
        if (!tbody) return;

        const filtered = products.filter(item => {
            const q = productState.search.toLowerCase();
            const matchesSearch = !q ||
                item.id.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q) ||
                item.strength.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q);
            const matchesCat = productState.category === 'all' || item.category === productState.category;
            const matchesStatus = productState.status === 'all' || item.status === productState.status;
            return matchesSearch && matchesCat && matchesStatus;
        });

        const totalPages = Math.max(1, Math.ceil(filtered.length / productState.pageSize));
        if (productState.page > totalPages) productState.page = totalPages;

        const start = (productState.page - 1) * productState.pageSize;
        const pageItems = filtered.slice(start, start + productState.pageSize);

        tbody.innerHTML = pageItems.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><span class="prod-main">${p.name}</span> <span class="prod-sub">${p.strength}</span></td>
                <td>${p.qty} Units</td>
                <td>$${Number(p.price).toFixed(2)}</td>
                <td>${p.expiry}</td>
                <td><span class="pill-status ${getStatusBadgeClass(p.status)}">${p.status.toLowerCase()}</span></td>
                <td>
                    <div class="row-actions">
                        <button type="button" class="act-btn view-batch" data-id="${p.id}" title="Batch info"><i class="far fa-eye"></i></button>
                        <button type="button" class="act-btn restock-btn" data-id="${p.id}" title="Add +10 stock"><i class="far fa-edit"></i></button>
                        <button type="button" class="act-btn delete" data-id="${p.id}" title="Remove product"><i class="far fa-trash-alt"></i></button>
                    </div>
                </td>
            </tr>
        `).join('') || `<tr><td colspan="7" style="text-align:center;color:#64748b;padding:20px;">No matching medicines found.</td></tr>`;

        if (countLabel) {
            countLabel.textContent = `out of ${Math.max(100, products.length * 10)}`;
        }

        if (pagination) {
            let html = `<button type="button" class="page-btn" ${productState.page === 1 ? 'disabled' : ''} data-p-page="${productState.page - 1}">&lsaquo;</button>`;
            for (let i = 1; i <= totalPages; i++) {
                html += `<button type="button" class="page-btn ${i === productState.page ? 'active' : ''}" data-p-page="${i}">${i}</button>`;
            }
            html += `<button type="button" class="page-btn" ${productState.page === totalPages ? 'disabled' : ''} data-p-page="${productState.page + 1}">&rsaquo;</button>`;
            pagination.innerHTML = html;

            pagination.querySelectorAll('[data-p-page]').forEach(btn => {
                btn.addEventListener('click', () => {
                    productState.page = Number(btn.getAttribute('data-p-page'));
                    renderProductsTable();
                });
            });
        }

        tbody.querySelectorAll('.view-batch').forEach(btn => {
            btn.addEventListener('click', () => {
                const prod = products.find(x => x.id === btn.getAttribute('data-id'));
                if (prod) showToast(`${prod.name} (${prod.strength}) — Batch ${prod.batch}, Exp: ${prod.expiry}`);
            });
        });

        tbody.querySelectorAll('.restock-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prod = products.find(x => x.id === btn.getAttribute('data-id'));
                if (prod) {
                    prod.qty += 10;
                    prod.status = prod.qty === 0 ? 'Out of stock' : (prod.qty < 50 ? 'Low stock' : 'In stock');
                    renderProductsTable();
                    populatePurchaseSelect();
                    showToast(`Restocked +10 units for ${prod.name}`);
                }
            });
        });

        tbody.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                products = products.filter(x => x.id !== id);
                renderProductsTable();
                populatePurchaseSelect();
                showToast(`Removed product ${id}`);
            });
        });
    }

    const productSearchInput = document.getElementById('productSearchInput');
    const globalSearchInput = document.getElementById('globalSearchInput');
    if (productSearchInput) {
        productSearchInput.addEventListener('input', (e) => {
            productState.search = e.target.value;
            productState.page = 1;
            renderProductsTable();
        });
    }
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            const val = e.target.value;
            productState.search = val;
            orderState.search = val;
            renderProductsTable();
            renderOrdersTable();
        });
    }

    const productFilterBtn = document.getElementById('productFilterBtn');
    const productFilterDrawer = document.getElementById('productFilterDrawer');
    if (productFilterBtn && productFilterDrawer) {
        productFilterBtn.addEventListener('click', () => {
            productFilterDrawer.hidden = !productFilterDrawer.hidden;
        });
    }

    const filterStockSelect = document.getElementById('filterStockSelect');
    const resetProductFilters = document.getElementById('resetProductFilters');
    if (filterCategorySelect) {
        filterCategorySelect.addEventListener('change', (e) => {
            productState.category = e.target.value;
            productState.page = 1;
            renderProductsTable();
        });
    }
    if (filterStockSelect) {
        filterStockSelect.addEventListener('change', (e) => {
            productState.status = e.target.value;
            productState.page = 1;
            renderProductsTable();
        });
    }
    if (resetProductFilters) {
        resetProductFilters.addEventListener('click', () => {
            productState.category = 'all';
            productState.status = 'all';
            productState.search = '';
            if (filterCategorySelect) filterCategorySelect.value = 'all';
            if (filterStockSelect) filterStockSelect.value = 'all';
            if (productSearchInput) productSearchInput.value = '';
            productState.page = 1;
            renderProductsTable();
        });
    }

    const productPageSize = document.getElementById('productPageSize');
    if (productPageSize) {
        productPageSize.addEventListener('change', (e) => {
            productState.pageSize = Number(e.target.value);
            productState.page = 1;
            renderProductsTable();
        });
    }

    const addProductModal = document.getElementById('addProductModal');
    const openAddProductModal = document.getElementById('openAddProductModal');
    const closeProductModal = document.getElementById('closeProductModal');
    const cancelProductModal = document.getElementById('cancelProductModal');
    const addProductForm = document.getElementById('addProductForm');

    if (openAddProductModal && addProductModal) {
        openAddProductModal.addEventListener('click', () => {
            addProductModal.hidden = false;
        });
    }
    if (closeProductModal && addProductModal) {
        closeProductModal.addEventListener('click', () => {
            addProductModal.hidden = true;
        });
    }
    if (cancelProductModal && addProductModal) {
        cancelProductModal.addEventListener('click', () => {
            addProductModal.hidden = true;
        });
    }
    if (addProductForm && addProductModal) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawName = document.getElementById('newProdName').value.trim();
            const parts = rawName.split(' ');
            const strength = parts.length > 1 && /\d/.test(parts[parts.length - 1]) ? parts.pop() : '500mg';
            const name = parts.join(' ') || 'Medicine Item';
            const category = document.getElementById('newProdCategory').value;
            const qty = Number(document.getElementById('newProdQty').value) || 0;
            const price = Number(document.getElementById('newProdPrice').value) || 1.00;
            const expiry = document.getElementById('newProdExpiry').value.trim() || '30-12-2027';
            const nextNum = String(products.length + 1).padStart(3, '0');
            const status = qty === 0 ? 'Out of stock' : (qty < 50 ? 'Low stock' : 'In stock');

            products.unshift({
                id: `#${nextNum}`,
                name,
                strength,
                category,
                qty,
                price,
                expiry,
                status,
                batch: `B-${Math.floor(100 + Math.random() * 899)}`
            });

            addProductModal.hidden = true;
            addProductForm.reset();
            renderProductsTable();
            populatePurchaseSelect();
            showToast(`Added ${name} (${strength}) to inventory`);
        });
    }

    function getPaymentBadgeClass(payment) {
        const p = payment.toLowerCase();
        if (p === 'paid') return 'paid';
        if (p === 'pending') return 'pending';
        return 'failed';
    }

    function getOrderStatusBadgeClass(status) {
        const s = status.toLowerCase();
        if (s === 'completed') return 'completed';
        if (s === 'in progress') return 'progress';
        if (s === 'pending') return 'pending';
        return 'cancelled';
    }

    function renderOrdersTable() {
        const tbody = document.getElementById('ordersTableBody');
        const pagination = document.getElementById('orderPagination');
        const countLabel = document.getElementById('orderTotalCountLabel');
        if (!tbody) return;

        const filtered = orders.filter(ord => {
            const q = orderState.search.toLowerCase();
            const itemsStr = ord.items.join(', ').toLowerCase();
            const matchesSearch = !q ||
                ord.id.toLowerCase().includes(q) ||
                ord.customer.toLowerCase().includes(q) ||
                itemsStr.includes(q) ||
                ord.date.toLowerCase().includes(q);
            const matchesPay = orderState.payment === 'all' || ord.payment === orderState.payment;
            const matchesStatus = orderState.status === 'all' || ord.status === orderState.status;
            return matchesSearch && matchesPay && matchesStatus;
        });

        const totalPages = Math.max(1, Math.ceil(filtered.length / orderState.pageSize));
        if (orderState.page > totalPages) orderState.page = totalPages;

        const start = (orderState.page - 1) * orderState.pageSize;
        const pageItems = filtered.slice(start, start + orderState.pageSize);

        tbody.innerHTML = pageItems.map(ord => `
            <tr>
                <td>${ord.id}</td>
                <td>${ord.customer}</td>
                <td>${ord.date}</td>
                <td class="order-items-cell">${ord.items.join('<br>')}</td>
                <td>$${Number(ord.total).toFixed(2)}</td>
                <td><span class="pill-status ${getPaymentBadgeClass(ord.payment)}">${ord.payment}</span></td>
                <td><span class="pill-status ${getOrderStatusBadgeClass(ord.status)}">${ord.status}</span></td>
                <td>
                    <div class="row-actions">
                        <button type="button" class="act-btn view-ord" data-id="${ord.id}" title="View invoice"><i class="far fa-eye"></i></button>
                        <button type="button" class="act-btn mark-done" data-id="${ord.id}" title="Mark completed"><i class="far fa-edit"></i></button>
                        <button type="button" class="act-btn delete del-ord" data-id="${ord.id}" title="Delete order"><i class="far fa-trash-alt"></i></button>
                    </div>
                </td>
            </tr>
        `).join('') || `<tr><td colspan="8" style="text-align:center;color:#64748b;padding:20px;">No matching orders found.</td></tr>`;

        if (countLabel) {
            countLabel.textContent = `out of ${Math.max(100, orders.length * 10)}`;
        }

        if (pagination) {
            let html = `<button type="button" class="page-btn" ${orderState.page === 1 ? 'disabled' : ''} data-o-page="${orderState.page - 1}">&lsaquo;</button>`;
            for (let i = 1; i <= totalPages; i++) {
                html += `<button type="button" class="page-btn ${i === orderState.page ? 'active' : ''}" data-o-page="${i}">${i}</button>`;
            }
            html += `<button type="button" class="page-btn" ${orderState.page === totalPages ? 'disabled' : ''} data-o-page="${orderState.page + 1}">&rsaquo;</button>`;
            pagination.innerHTML = html;

            pagination.querySelectorAll('[data-o-page]').forEach(btn => {
                btn.addEventListener('click', () => {
                    orderState.page = Number(btn.getAttribute('data-o-page'));
                    renderOrdersTable();
                });
            });
        }

        tbody.querySelectorAll('.view-ord').forEach(btn => {
            btn.addEventListener('click', () => {
                const ord = orders.find(x => x.id === btn.getAttribute('data-id'));
                if (ord) showToast(`Order ${ord.id} — ${ord.customer}: $${ord.total.toFixed(2)} (${ord.status})`);
            });
        });

        tbody.querySelectorAll('.mark-done').forEach(btn => {
            btn.addEventListener('click', () => {
                const ord = orders.find(x => x.id === btn.getAttribute('data-id'));
                if (ord) {
                    ord.status = 'Completed';
                    ord.payment = 'Paid';
                    renderOrdersTable();
                    showToast(`Order ${ord.id} marked as Completed & Paid`);
                }
            });
        });

        tbody.querySelectorAll('.del-ord').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                orders = orders.filter(x => x.id !== id);
                renderOrdersTable();
                showToast(`Deleted order ${id}`);
            });
        });
    }

    const orderSearchInput = document.getElementById('orderSearchInput');
    if (orderSearchInput) {
        orderSearchInput.addEventListener('input', (e) => {
            orderState.search = e.target.value;
            orderState.page = 1;
            renderOrdersTable();
        });
    }

    const orderFilterBtn = document.getElementById('orderFilterBtn');
    const orderFilterDrawer = document.getElementById('orderFilterDrawer');
    if (orderFilterBtn && orderFilterDrawer) {
        orderFilterBtn.addEventListener('click', () => {
            orderFilterDrawer.hidden = !orderFilterDrawer.hidden;
        });
    }

    const filterPaymentSelect = document.getElementById('filterPaymentSelect');
    const filterOrderStatusSelect = document.getElementById('filterOrderStatusSelect');
    const resetOrderFilters = document.getElementById('resetOrderFilters');
    if (filterPaymentSelect) {
        filterPaymentSelect.addEventListener('change', (e) => {
            orderState.payment = e.target.value;
            orderState.page = 1;
            renderOrdersTable();
        });
    }
    if (filterOrderStatusSelect) {
        filterOrderStatusSelect.addEventListener('change', (e) => {
            orderState.status = e.target.value;
            orderState.page = 1;
            renderOrdersTable();
        });
    }
    if (resetOrderFilters) {
        resetOrderFilters.addEventListener('click', () => {
            orderState.payment = 'all';
            orderState.status = 'all';
            orderState.search = '';
            if (filterPaymentSelect) filterPaymentSelect.value = 'all';
            if (filterOrderStatusSelect) filterOrderStatusSelect.value = 'all';
            if (orderSearchInput) orderSearchInput.value = '';
            orderState.page = 1;
            renderOrdersTable();
        });
    }

    const orderPageSize = document.getElementById('orderPageSize');
    if (orderPageSize) {
        orderPageSize.addEventListener('change', (e) => {
            orderState.pageSize = Number(e.target.value);
            orderState.page = 1;
            renderOrdersTable();
        });
    }

    const openNewOrderBtn = document.getElementById('openNewOrderBtn');
    if (openNewOrderBtn) {
        openNewOrderBtn.addEventListener('click', () => {
            activateView('view-sales');
            showToast('Select medicines to create a new FEFO order');
        });
    }

    function downloadCsv(filename, rows) {
        const csvContent = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const exportProductsBtn = document.getElementById('exportProductsBtn');
    const reportInventoryCsvBtn = document.getElementById('reportInventoryCsvBtn');
    function handleInventoryExport() {
        const rows = [['Product ID', 'Name', 'Strength', 'Category', 'Quantity', 'Price', 'Expiry', 'Status']];
        products.forEach(p => rows.push([p.id, p.name, p.strength, p.category, p.qty, p.price.toFixed(2), p.expiry, p.status]));
        downloadCsv('medishop-products.csv', rows);
        showToast('Exported product inventory CSV');
    }
    if (exportProductsBtn) exportProductsBtn.addEventListener('click', handleInventoryExport);
    if (reportInventoryCsvBtn) reportInventoryCsvBtn.addEventListener('click', handleInventoryExport);

    const exportOrdersBtn = document.getElementById('exportOrdersBtn');
    const reportSalesCsvBtn = document.getElementById('reportSalesCsvBtn');
    function handleOrdersExport() {
        const rows = [['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status']];
        orders.forEach(o => rows.push([o.id, o.customer, o.date, o.items.join('; '), o.total.toFixed(2), o.payment, o.status]));
        downloadCsv('medishop-orders.csv', rows);
        showToast('Exported orders CSV');
    }
    if (exportOrdersBtn) exportOrdersBtn.addEventListener('click', handleOrdersExport);
    if (reportSalesCsvBtn) reportSalesCsvBtn.addEventListener('click', handleOrdersExport);

    function renderPosGrid() {
        const grid = document.getElementById('posProductGrid');
        const q = ((document.getElementById('posSearchInput') || {}).value || '').toLowerCase();
        if (!grid) return;

        const available = products.filter(p =>
            p.qty > 0 &&
            p.status !== 'Out of stock' &&
            (!q || p.name.toLowerCase().includes(q) || p.strength.toLowerCase().includes(q))
        );

        grid.innerHTML = available.map(p => `
            <div class="pos-item-card">
                <div>
                    <h4>${p.name}</h4>
                    <small>${p.strength} &bull; Batch ${p.batch}</small><br>
                    <small>Exp: ${p.expiry} &bull; ${p.qty} left</small>
                </div>
                <div class="pos-item-foot">
                    <strong>$${p.price.toFixed(2)}</strong>
                    <button type="button" class="pos-add-btn" data-pos-id="${p.id}">+ Add</button>
                </div>
            </div>
        `).join('') || `<p class="empty-cart-msg">No valid non-expired stock matches your search.</p>`;

        grid.querySelectorAll('[data-pos-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const prod = products.find(x => x.id === btn.getAttribute('data-pos-id'));
                if (!prod || prod.qty <= 0) {
                    showToast('Cannot sell: no valid batch stock available.');
                    return;
                }
                const existing = cart.find(c => c.id === prod.id);
                if (existing) {
                    if (existing.qty + 1 > prod.qty) {
                        showToast(`Only ${prod.qty} valid units available for ${prod.name}`);
                        return;
                    }
                    existing.qty += 1;
                } else {
                    cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
                }
                renderCart();
            });
        });
    }

    const posSearchInput = document.getElementById('posSearchInput');
    if (posSearchInput) posSearchInput.addEventListener('input', renderPosGrid);

    const posDiscountInput = document.getElementById('posDiscountInput');
    if (posDiscountInput) posDiscountInput.addEventListener('input', renderCart);

    function renderCart() {
        const listEl = document.getElementById('posCartItems');
        const subEl = document.getElementById('posSubtotal');
        const totEl = document.getElementById('posTotal');
        if (!listEl) return;

        if (cart.length === 0) {
            listEl.innerHTML = '<p class="empty-cart-msg">Select a medicine on the left to build an order.</p>';
            if (subEl) subEl.textContent = '$0.00';
            if (totEl) totEl.textContent = '$0.00';
            return;
        }

        let subtotal = 0;
        listEl.innerHTML = cart.map(item => {
            const lineTotal = item.price * item.qty;
            subtotal += lineTotal;
            return `
                <div class="cart-row">
                    <span><strong>${item.name}</strong> (${item.qty})</span>
                    <span>$${lineTotal.toFixed(2)}</span>
                </div>
            `;
        }).join('');

        const discPct = Math.min(50, Math.max(0, Number((posDiscountInput && posDiscountInput.value) || 0)));
        const netTotal = subtotal * (1 - discPct / 100);

        if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totEl) totEl.textContent = `$${netTotal.toFixed(2)}`;
    }

    const completeSaleBtn = document.getElementById('completeSaleBtn');
    if (completeSaleBtn) {
        completeSaleBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Add at least one medicine before completing an order.');
                return;
            }
            const customerName = ((document.getElementById('posCustomerInput') || {}).value || 'Walk-in Customer').trim() || 'Walk-in Customer';
            const discPct = Math.min(50, Math.max(0, Number((posDiscountInput && posDiscountInput.value) || 0)));
            let subtotal = 0;
            const summaryItems = [];

            cart.forEach(item => {
                const prod = products.find(p => p.id === item.id);
                if (prod) {
                    prod.qty = Math.max(0, prod.qty - item.qty);
                    prod.status = prod.qty === 0 ? 'Out of stock' : (prod.qty < 50 ? 'Low stock' : 'In stock');
                }
                subtotal += item.price * item.qty;
                summaryItems.push(`${item.name} (${item.qty})`);
            });

            const netTotal = subtotal * (1 - discPct / 100);
            const nextOrdNum = String(orders.length + 1).padStart(3, '0');
            orders.unshift({
                id: `#ORD${nextOrdNum}`,
                customer: customerName,
                date: '25-11-2026',
                items: summaryItems,
                total: netTotal,
                payment: 'Paid',
                status: 'Completed'
            });

            cart = [];
            renderCart();
            renderProductsTable();
            renderOrdersTable();
            renderPosGrid();
            populatePurchaseSelect();
            showToast(`Order #ORD${nextOrdNum} completed and batch stock updated.`);
        });
    }

    function populatePurchaseSelect() {
        const sel = document.getElementById('purMedicineSelect');
        if (!sel) return;
        sel.innerHTML = products.map(p => `<option value="${p.id}">${p.name} ${p.strength} (Current: ${p.qty} units)</option>`).join('');
    }

    const purchaseEntryForm = document.getElementById('purchaseEntryForm');
    if (purchaseEntryForm) {
        purchaseEntryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sel = document.getElementById('purMedicineSelect');
            const batchVal = (document.getElementById('purBatchNo').value || 'B-999').trim();
            const addQty = Number(document.getElementById('purQuantity').value) || 0;
            const supplier = document.getElementById('purSupplier').value;
            const prod = products.find(p => p.id === (sel && sel.value));
            if (prod && addQty > 0) {
                prod.qty += addQty;
                prod.batch = batchVal;
                prod.status = prod.qty === 0 ? 'Out of stock' : (prod.qty < 50 ? 'Low stock' : 'In stock');
                renderProductsTable();
                populatePurchaseSelect();
                showToast(`Purchase recorded from ${supplier}: +${addQty} units (${batchVal})`);
            }
        });
    }

    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = document.getElementById('settingsSavedMsg');
            if (msg) {
                msg.hidden = false;
                setTimeout(() => { msg.hidden = true; }, 2500);
            }
            showToast('Pharmacy preferences saved.');
        });
    }

    const ctx = document.getElementById('revenueChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Dispensary Revenue ($)',
                    data: [1420, 1890, 1640, 2310, 2050, 2780, 2460],
                    borderColor: '#0d3b36',
                    backgroundColor: 'rgba(184, 241, 74, 0.25)',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#0f6e64',
                    fill: true,
                    tension: 0.35
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#475569' } }
                },
                scales: {
                    x: {
                        grid: { color: '#eef2f1' },
                        ticks: { color: '#64748b' }
                    },
                    y: {
                        grid: { color: '#eef2f1' },
                        ticks: {
                            color: '#64748b',
                            callback: (val) => '$' + val
                        }
                    }
                }
            }
        });
    }

    populatePurchaseSelect();
    renderProductsTable();
    renderOrdersTable();
    renderCart();
});
