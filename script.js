const form = document.querySelector(".expense-form");
const descriptionInput = document.querySelector(".expense-input");
const amountInput = document.querySelector(".amount-input");
const typeInput = document.querySelector(".type-input");
const expenseList = document.querySelector(".expense-list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

let income = 0;
let expense = 0;
let balance = 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let lastResetDate = localStorage.getItem("lastResetDate") || getCurrentMonthKey();

// Check for monthly reset
function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function checkMonthlyReset() {
  const currentMonth = getCurrentMonthKey();
  
  if (lastResetDate !== currentMonth) {
    // New month detected - reset income but keep balance
    const carryOverBalance = balance;
    income = 0;
    expense = 0;
    balance = carryOverBalance;
    
    
    expenses = [];
    
    // Update storage
    lastResetDate = currentMonth;
    localStorage.setItem("lastResetDate", lastResetDate);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    
    // Update display
    expenseList.innerHTML = "";
    updateSummary();
    
    console.log(`Monthly reset! Balance carried over: \u20B1${balance.toFixed(2)}`);
  }
}
// Render saved data on load
expenses.forEach((entry, index) => {
  addToList(entry, index);
  if (entry.type === "income") {
    income += entry.amount;
  } else if (entry.type === "expense") {
    expense += entry.amount;
  }
});

balance = income - expense;
updateSummary();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const date = new Date().toISOString().split('T')[0];
  const type = typeInput.value;

  if (description && !isNaN(amount) && date && type) {
    const entry = { description, amount, date, type };
    expenses.push(entry);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    addToList(entry, expenses.length - 1);
    
    if (type === "income") {
      income += amount;
    } else if (type === "expense") {
      expense += amount;
    }
    if(income === 0){
      // If income is zero, we can reset the expenses
      expenses = [];
      localStorage.setItem("expenses", JSON.stringify(expenses));
      expenseList.innerHTML = "";
    }
    balance = income - expense;
    updateSummary();
    form.reset();
  }
});

function addToList(entry, index) {
  const listItem = document.createElement("li");
  listItem.className = `expense-item ${entry.type}`;
  
  // Create content div
  const contentDiv = document.createElement("div");
  contentDiv.className = "expense-content";
  contentDiv.textContent = `[${entry.date}] ${entry.description}: \u20B1${entry.amount.toFixed(2)}`;

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×";
  deleteBtn.className = "delete-btn";
  deleteBtn.title = "Delete entry";
  deleteBtn.addEventListener("click", () => deleteEntry(index));
  
  listItem.appendChild(contentDiv);
  listItem.appendChild(deleteBtn);
  expenseList.appendChild(listItem);
}

function updateSummary() {
  balanceEl.textContent = balance.toFixed(2);
  incomeEl.textContent = income.toFixed(2);
  expenseEl.textContent = expense.toFixed(2);
}

// Delete functionality
function deleteEntry(index) {
  if (confirm("Are you sure you want to delete this entry?")) {
    const entry = expenses[index];
    
    // Update totals
    if (entry.type === "income") {
      income -= entry.amount;
    } else if (entry.type === "expense") {
      expense -= entry.amount;
    }
    
    // Remove from array and save
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    
    // Refresh the list
    refreshList();
    
    balance = income - expense;
    updateSummary();
  }
}

// Refresh the entire list (needed after deletion due to index changes)
function refreshList() {
  expenseList.innerHTML = "";
  expenses.forEach((entry, index) => {
    addToList(entry, index);
  });
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker registered"));

}
