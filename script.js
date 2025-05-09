// Variables globales
let expenses = [];
let currentPage = 1;
const itemsPerPage = 10;
let filteredExpenses = [];

// Sélection des éléments de l'interface
const expenseForm = document.getElementById("expense-form");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");
const expenseChartElement = document.getElementById("expense-chart");
const tableBody = document.getElementById("expense-table-body");
const filterCategory = document.getElementById("filter-category");
const filterPeriod = document.getElementById("filter-period");
const filterDate = document.getElementById("filter-date");
const pageInfo = document.getElementById("page-info");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");

// Initialisation des graphiques
let expenseChart;
let timelineChart;

function initCharts() {
    // Graphique en camembert pour les catégories
    const pieCtx = document.getElementById('expense-chart').getContext('2d');
    expenseChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true
        }
    });

    // Graphique linéaire pour l'évolution dans le temps
    const timelineCtx = document.getElementById('timeline-chart').getContext('2d');
    timelineChart = new Chart(timelineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Dépenses totales',
                data: [],
                borderColor: '#36A2EB',
                tension: 0.1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Montant (FCFA)'
                    }
                }
            }
        }
    });
}

// Fonction pour ajouter une dépense
function addExpense(e) {
    e.preventDefault();
    const expense = {
        id: Date.now(),
        amount: parseFloat(amountInput.value),
        description: descriptionInput.value.trim(),
        category: categoryInput.value,
        date: document.getElementById('expense-date').value || new Date().toISOString().split('T')[0]
    };

    if (!expense.amount || !expense.description) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    expenses.push(expense);
    saveExpenses();
    updateDisplay();
    e.target.reset();
}

// Fonction pour filtrer les dépenses
function filterExpenses() {
    const category = filterCategory.value;
    const period = filterPeriod.value;
    const date = filterDate.value;

    filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const filterDate = new Date(date);

        const categoryMatch = !category || expense.category === category;
        let dateMatch = true;

        if (date) {
            switch (period) {
                case "day":
                    dateMatch = expenseDate.toDateString() === filterDate.toDateString();
                    break;
                case "month":
                    dateMatch = expenseDate.getMonth() === filterDate.getMonth() &&
                        expenseDate.getFullYear() === filterDate.getFullYear();
                    break;
                case "year":
                    dateMatch = expenseDate.getFullYear() === filterDate.getFullYear();
                    break;
            }
        }

        return categoryMatch && dateMatch;
    });

    currentPage = 1;
    updateDisplay();
}

// Fonction pour mettre à jour l'affichage
function updateDisplay() {
    updateTable();
    updateCharts();
    updatePagination();
}

// Fonction pour mettre à jour le tableau
function updateTable() {
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageExpenses = filteredExpenses.slice(start, end);

    pageExpenses.forEach(expense => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="p-2">${new Date(expense.date).toLocaleDateString()}</td>
            <td class="p-2">${expense.description}</td>
            <td class="p-2">${expense.category}</td>
            <td class="p-2 text-right">${expense.amount} FCFA</td>
            <td class="p-2 text-center">
                <button onclick="deleteExpense(${expense.id})" class="text-red-600">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateTotal();
}

// Fonction pour mettre à jour les graphiques
function updateCharts() {
    // Mise à jour du graphique en camembert
    const categoryTotals = {};
    filteredExpenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    expenseChart.data.labels = Object.keys(categoryTotals);
    expenseChart.data.datasets[0].data = Object.values(categoryTotals);
    expenseChart.update();

    // Mise à jour du graphique d'évolution
    const timelineData = {};
    filteredExpenses
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(expense => {
            const date = expense.date;
            timelineData[date] = (timelineData[date] || 0) + expense.amount;
        });

    timelineChart.data.labels = Object.keys(timelineData);
    timelineChart.data.datasets[0].data = Object.values(timelineData);
    timelineChart.update();
}

// Fonction pour mettre à jour le total
function updateTotal() {
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = total.toFixed(2);
}

// Fonctions de pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} sur ${totalPages}`;

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

function nextPage() {
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateDisplay();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateDisplay();
    }
}

// Fonction pour supprimer une dépense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    updateDisplay();
}

// Event Listeners
expenseForm.addEventListener("submit", addExpense);
filterCategory.addEventListener("change", filterExpenses);
filterPeriod.addEventListener("change", filterExpenses);
filterDate.addEventListener("change", filterExpenses);
nextPageButton.addEventListener("click", nextPage);
prevPageButton.addEventListener("click", prevPage);

// Initialisation
function init() {
    expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    filteredExpenses = [...expenses];
    initCharts();
    updateDisplay();
}

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Démarrage de l'application
init();