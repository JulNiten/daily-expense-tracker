
// Variables globales
let expenses = [];
let currentPage = 1;
const itemsPerPage = 5;
let filteredExpenses = [];
let currency = 'FCFA';
let darkMode = false;

// Charts
let categoryChart;
let timelineChart;
let monthlyChart;
let dailyAvgChart;

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseModal = document.getElementById('expense-modal');
const addExpenseBtn = document.getElementById('add-expense-btn');
const closeModal = document.getElementById('close-modal');
const expenseList = document.getElementById('expense-list');
const filterCategory = document.getElementById('filter-category');
const filterPeriod = document.getElementById('filter-period');
const filterDate = document.getElementById('filter-date');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const totalAmount = document.getElementById('total-amount');
const paginationInfo = document.getElementById('pagination-info');
const todayTotal = document.getElementById('today-total');
const weekTotal = document.getElementById('week-total');
const monthTotal = document.getElementById('month-total');
const menuButton = document.getElementById('menu-button');
const dropdownMenu = document.getElementById('dropdown-menu');
const resetData = document.getElementById('reset-data');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const themeToggle = document.getElementById('theme-toggle');
const currencySelect = document.getElementById('currency-select');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize Date Inputs
const today = new Date().toISOString().split('T')[0];
document.getElementById('expense-date').value = today;
document.getElementById('filter-date').value = today;

// Initialize Charts
function initCharts() {
    // Category Chart (Pie)
    const categoryCtx = document.getElementById('category-chart').getContext('2d');
    categoryChart = new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#3B82F6', // blue-500
                    '#10B981', // green-500
                    '#F59E0B', // amber-500
                    '#8B5CF6', // violet-500
                    '#EC4899', // pink-500
                    '#6366F1'  // indigo-500
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Timeline Chart (Line)
    const timelineCtx = document.getElementById('timeline-chart').getContext('2d');
    timelineChart = new Chart(timelineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Dépenses',
                data: [],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value + ' ' + currency;
                        }
                    }
                }
            }
        }
    });

    // Monthly Chart (Bar)
    const monthlyCtx = document.getElementById('monthly-chart').getContext('2d');
    monthlyChart = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Dépenses mensuelles',
                data: [],
                backgroundColor: 'rgba(99, 102, 241, 0.7)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value + ' ' + currency;
                        }
                    }
                }
            }
        }
    });

    // Daily Average Chart (Bar)
    const dailyAvgCtx = document.getElementById('daily-avg-chart').getContext('2d');
    dailyAvgChart = new Chart(dailyAvgCtx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{
                label: 'Moyenne quotidienne',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(16, 185, 129, 0.7)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value + ' ' + currency;
                        }
                    }
                }
            }
        }
    });
}

// Function to format date
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Function to format currency
function formatAmount(amount) {
    return `${parseFloat(amount).toFixed(2)} ${currency}`;
}

// Function to add expense
function addExpense(e) {
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('expense-date').value;

    if (!amount || !description || !date) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }

    const expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        description: description.trim(),
        category: category,
        date: date
    };

    expenses.push(expense);
    saveExpenses();
    expenseForm.reset();
    document.getElementById('expense-date').value = today;
    expenseModal.classList.add('hidden');

    filterExpenses();
    updateSummary();
    updateCharts();
    showNotification('Dépense ajoutée avec succès', 'success');
}

// Function to delete expense
function deleteExpense(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveExpenses();
        filterExpenses();
        updateSummary();
        updateCharts();
        showNotification('Dépense supprimée', 'success');
    }
}

// Function to edit expense
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
        document.getElementById('amount').value = expense.amount;
        document.getElementById('description').value = expense.description;
        document.getElementById('category').value = expense.category;
        document.getElementById('expense-date').value = expense.date;

        // Remove the old expense
        expenses = expenses.filter(exp => exp.id !== id);

        // Open the modal for editing
        expenseModal.classList.remove('hidden');
    }
}

// Function to filter expenses
function filterExpenses() {
    const category = filterCategory.value;
    const period = filterPeriod.value;
    const date = filterDate.value ? new Date(filterDate.value) : new Date();

    // Reset to first page when filter changes
    currentPage = 1;

    filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const categoryMatch = !category || expense.category === category;
        let dateMatch = true;

        if (date) {
            switch (period) {
                case 'day':
                    dateMatch = expenseDate.toDateString() === date.toDateString();
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    dateMatch = expenseDate >= weekStart && expenseDate <= weekEnd;
                    break;
                case 'month':
                    dateMatch = expenseDate.getMonth() === date.getMonth() &&
                        expenseDate.getFullYear() === date.getFullYear();
                    break;
                case 'year':
                    dateMatch = expenseDate.getFullYear() === date.getFullYear();
                    break;
            }
        }

        return categoryMatch && dateMatch;
    });

    updateExpenseList();
    updatePagination();
}

// Function to update expense list
function updateExpenseList() {
    expenseList.innerHTML = '';

    // Calculate start and end index for pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, filteredExpenses.length);
    const pageExpenses = filteredExpenses.slice(start, end);

    if (pageExpenses.length === 0) {
        expenseList.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-12">
                        <i class="fas fa-receipt text-gray-300 text-5xl mb-4"></i>
                        <p class="text-gray-500">Aucune dépense trouvée</p>
                    </div>
                `;
        return;
    }

    // Create expense cards
    pageExpenses.forEach(expense => {
        const card = document.createElement('div');
        card.className = 'expense-card bg-white border border-gray-100 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow';

        // Set category color
        let categoryColor;
        switch (expense.category) {
            case 'Nourriture': categoryColor = 'blue'; break;
            case 'Transport': categoryColor = 'green'; break;
            case 'Crédit': categoryColor = 'yellow'; break;
            default: categoryColor = 'purple';
        }

        card.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center">
                                <span class="bg-${categoryColor}-100 text-${categoryColor}-800 text-xs px-2 py-1 rounded-full mr-2">${expense.category}</span>
                                <h3 class="font-medium">${expense.description}</h3>
                            </div>
                            <p class="text-sm text-gray-500 mt-1">${formatDate(expense.date)}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold">${formatAmount(expense.amount)}</p>
                            <div class="flex space-x-1 mt-1">
                                <button onclick="editExpense(${expense.id})" class="text-gray-500 hover:text-blue-500">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteExpense(${expense.id})" class="text-gray-500 hover:text-red-500">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;

        expenseList.appendChild(card);
    });

    // Update total
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = formatAmount(total);
}

// Function to update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage) || 1;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    prevPageBtn.classList.toggle('opacity-50', currentPage === 1);
    nextPageBtn.classList.toggle('opacity-50', currentPage === totalPages);

    paginationInfo.textContent = `Affichage de ${filteredExpenses.length} dépense${filteredExpenses.length !== 1 ? 's' : ''}`;
}

// Function to update summary cards
function updateSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Week start (Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    // Month start
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Calculate totals
    const todaySum = expenses
        .filter(expense => new Date(expense.date).toDateString() === today.toDateString())
        .reduce((sum, expense) => sum + expense.amount, 0);

    const weekSum = expenses
        .filter(expense => {
            const expDate = new Date(expense.date);
            return expDate >= weekStart && expDate <= today;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

    const monthSum = expenses
        .filter(expense => {
            const expDate = new Date(expense.date);
            return expDate >= monthStart && expDate <= today;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

    // Update the summary cards
    todayTotal.textContent = formatAmount(todaySum);
    weekTotal.textContent = formatAmount(weekSum);
    monthTotal.textContent = formatAmount(monthSum);
}

// Function to update all charts
function updateCharts() {
    // Category Chart
    const categoryData = {};
    filteredExpenses.forEach(expense => {
        categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
    });

    categoryChart.data.labels = Object.keys(categoryData);
    categoryChart.data.datasets[0].data = Object.values(categoryData);
    categoryChart.update();

    // Timeline Chart
    const timelineData = {};
    const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedExpenses.forEach(expense => {
        const date = expense.date;
        timelineData[date] = (timelineData[date] || 0) + expense.amount;
    });

    const dates = Object.keys(timelineData);
    const formattedDates = dates.map(date => formatDate(date));

    timelineChart.data.labels = formattedDates;
    timelineChart.data.datasets[0].data = Object.values(timelineData);
    timelineChart.update();

    // Monthly Chart
    const monthlyData = {};
    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthYear = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + expense.amount;
    });

    monthlyChart.data.labels = Object.keys(monthlyData);
    monthlyChart.data.datasets[0].data = Object.values(monthlyData);
    monthlyChart.update();

    // Daily Average Chart
    const dailyData = [0, 0, 0, 0, 0, 0, 0]; // [Lun, Mar, Mer, Jeu, Ven, Sam, Dim]
    const dayCount = [0, 0, 0, 0, 0, 0, 0];

    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const dayOfWeek = date.getDay(); // 0 = Dim, 1 = Lun, ..., 6 = Sam
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Lun, ..., 6 = Dim

        dailyData[adjustedDay] += expense.amount;
        dayCount[adjustedDay]++;
    });

    // Calculate averages
    const dailyAvg = dailyData.map((total, index) =>
        dayCount[index] ? total / dayCount[index] : 0
    );

    dailyAvgChart.data.datasets[0].data = dailyAvg;
    dailyAvgChart.update();
}

// Function to show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-md z-50 transition-opacity duration-300 ${type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`;

    notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-${type === 'success' ? 'check-circle' :
            type === 'error' ? 'exclamation-circle' : 'info-circle'
        } mr-2"></i>
                    <span>${message}</span>
                </div>
            `;

    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    // Fade out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Function to save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to load expenses from localStorage
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenses');
    expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
    filteredExpenses = [...expenses];
}

// Function to reset data
function resetAllData() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
        expenses = [];
        saveExpenses();
        filterExpenses();
        updateSummary();
        updateCharts();
        showNotification('Toutes les données ont été réinitialisées', 'success');
    }
}

// Function to export data to CSV
function exportToCsv() {
    if (expenses.length === 0) {
        showNotification('Aucune donnée à exporter', 'error');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Date,Description,Montant,Catégorie\n";

    expenses.forEach(expense => {
        csvContent += `${expense.date},${expense.description},${expense.amount},${expense.category}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Données exportées avec succès', 'success');
}

// Function to toggle tabs
function toggleTab(tabId) {
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    tabButtons.forEach(button => {
        button.classList.remove('border-blue-500', 'text-blue-600');
        button.classList.add('border-transparent', 'text-gray-500');
    });

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('border-blue-500', 'text-blue-600');
    document.querySelector(`[data-tab="${tabId}"]`).classList.remove('border-transparent', 'text-gray-500');
}

// Function to toggle dark mode
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
    document.body.classList.toggle('bg-gray-900', darkMode);
    document.body.classList.toggle('text-white', darkMode);

    document.querySelectorAll('.bg-white').forEach(el => {
        el.classList.toggle('bg-gray-800', darkMode);
        el.classList.toggle('text-white', darkMode);
        el.classList.toggle('bg-white', !darkMode);
    });

    localStorage.setItem('darkMode', darkMode);
    themeToggle.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    initCharts();
    filterExpenses();
    updateSummary();
    updateCharts();

    // Set initial date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
    document.getElementById('filter-date').value = today;

    // Check saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
        darkModeToggle.checked = true;
    }

    // Check saved currency
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
        currency = savedCurrency;
        currencySelect.value = savedCurrency;
    }
});

// Form submission
expenseForm.addEventListener('submit', addExpense);

// Modal controls
addExpenseBtn.addEventListener('click', () => {
    expenseModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    expenseModal.classList.add('hidden');
});

// Clicking outside the modal closes it
expenseModal.addEventListener('click', (e) => {
    if (e.target === expenseModal) {
        expenseModal.classList.add('hidden');
    }
});

// Filter change handlers
filterCategory.addEventListener('change', filterExpenses);
filterPeriod.addEventListener('change', filterExpenses);
filterDate.addEventListener('change', filterExpenses);

// Pagination handlers
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateExpenseList();
        updatePagination();
    }
});

nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateExpenseList();
        updatePagination();
    }
});

// Menu button and dropdown
menuButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('hidden');
});

// Click outside to close dropdown
document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
    }
});

// Reset data
resetData.addEventListener('click', resetAllData);

// Export data
document.getElementById('export-data').addEventListener('click', exportToCsv);

// Tab navigation
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        toggleTab(tabId);
    });
});

// Dark mode toggle
darkModeToggle.addEventListener('change', toggleDarkMode);
themeToggle.addEventListener('click', () => {
    darkModeToggle.checked = !darkModeToggle.checked;
    toggleDarkMode();
});

// Currency change
currencySelect.addEventListener('change', () => {
    currency = currencySelect.value;
    localStorage.setItem('currency', currency);
    updateExpenseList();
    updateSummary();
    updateCharts();
});

// Window resize handler for charts
window.addEventListener('resize', () => {
    if (categoryChart && timelineChart && monthlyChart && dailyAvgChart) {
        categoryChart.resize();
        timelineChart.resize();
        monthlyChart.resize();
        dailyAvgChart.resize();
    }
});