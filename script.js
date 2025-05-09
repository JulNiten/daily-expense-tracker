const expenseForm = document.getElementById("expense-form");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");

// Fonction pour afficher les dépenses
function renderExpenses() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenseList.innerHTML = "";

    let total = 0;

    expenses.forEach(expense => {
        const li = document.createElement("li");
        li.innerHTML = expense.amount FCFA - { expense.description }(${ expense.category });
        expenseList.appendChild(li);
        total += parseFloat(expense.amount);
    });

    totalAmount.textContent = total.toFixed(2);
}

// Fonction pour ajouter une dépense
expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const expense = {
        amount: amountInput.value,
        description: descriptionInput.value,
        category: categoryInput.value,
    };

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    amountInput.value = "";
    descriptionInput.value = "";
    categoryInput.value = "Nourriture";

    renderExpenses();
});
renderExpenses();
// Fonction pour supprimer une dépense
expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const index = Array.from(expenseList.children).indexOf(e.target);
        expenses.splice(index, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderExpenses();
    }
});

// Fonction pour filtrer les dépenses par catégorie
const filterSelect = document.getElementById("filter-category");
filterSelect.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    expenseList.innerHTML = "";

    let total = 0;

    expenses.forEach(expense => {
        if (selectedCategory === "all" || expense.category === selectedCategory) {
            const li = document.createElement("li");
            li.innerHTML = `${expense.amount} FCFA - ${expense.description} (${expense.category})`;
            expenseList.appendChild(li);
            total += parseFloat(expense.amount);
        }
    });

    totalAmount.textContent = total.toFixed(2);
});
// Fonction pour trier les dépenses par montant
const sortSelect = document.getElementById("sort-amount");
sortSelect.addEventListener("change", (e) => {
    const sortOrder = e.target.value;
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (sortOrder === "asc") {
        expenses.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    } else if (sortOrder === "desc") {
        expenses.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
});
// Fonction pour afficher des graphiques et statistiques
const chartButton = document.getElementById("chart-button");
chartButton.addEventListener("click", () => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const categories = [...new Set(expenses.map(expense => expense.category))];
    const data = categories.map(category => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((total, expense) => total + parseFloat(expense.amount), 0);
    });

    const ctx = document.getElementById("expense-chart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                label: "Dépenses par catégorie",
                data: data,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            }],
        },
    });
});
// Fonction pour exporter les dépenses au format CSV
const exportButton = document.getElementById("export-button");
exportButton.addEventListener("click", () => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Montant,Description,Catégorie\n";

    expenses.forEach(expense => {
        csvContent += `${expense.amount},${expense.description},${expense.category}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
});
// Fonction pour importer des dépenses à partir d'un fichier CSV
const importButton = document.getElementById("import-button");
importButton.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const csvData = event.target.result.split("\n").slice(1);
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

        csvData.forEach(row => {
            const [amount, description, category] = row.split(",");
            if (amount && description && category) {
                expenses.push({ amount, description, category });
            }
        });

        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderExpenses();
    };

    reader.readAsText(file);
});
// Fonction pour supprimer toutes les dépenses
const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", () => {
    localStorage.removeItem("expenses");
    renderExpenses();
});
// Fonction pour afficher les dépenses par mois
const monthButton = document.getElementById("month-button");
monthButton.addEventListener("click", () => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const monthlyExpenses = expenses.reduce((acc, expense) => {
        const month = new Date().getMonth() + 1; // Mois actuel
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month] += parseFloat(expense.amount);
        return acc;
    }, {});

    const ctx = document.getElementById("monthly-expenses-chart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(monthlyExpenses),
            datasets: [{
                label: "Dépenses mensuelles",
                data: Object.values(monthlyExpenses),
                backgroundColor: "#36A2EB",
            }],
        },
    });
});