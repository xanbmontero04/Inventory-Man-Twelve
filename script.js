/* ========= AUTH GUARD ========= */
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "login.html";
}


/* ========= INVENTORY DATA =========
   Units: g (grams), ml (milliliters), shot (espresso shot), scoop (ice cream)
   You can tweak starting stock for demo or testing.
*/
const state = {
  ingredients: [
    {name:"Espresso Beans", unit:"g", stock:1000},
    {name:"Milk", unit:"ml", stock:5000},
    {name:"Oat Milk", unit:"ml", stock:2000},
    {name:"Sugar", unit:"g", stock:1500},
    {name:"Chocolate Syrup", unit:"ml", stock:1500},
    {name:"White Chocolate Syrup", unit:"ml", stock:800},
    {name:"Caramel Syrup", unit:"ml", stock:900},
    {name:"Matcha Powder", unit:"g", stock:500},
    {name:"Milo Powder", unit:"g", stock:600},
    {name:"Muscovado Syrup", unit:"ml", stock:700},
    {name:"Cold Brew Base", unit:"ml", stock:5000},
    {name:"Sweet Cream Foam", unit:"ml", stock:1000},
    {name:"Tea Base", unit:"ml", stock:2500},
    {name:"Mango Syrup/Purée", unit:"ml", stock:600},
    {name:"Mixed Berries Purée", unit:"ml", stock:600},
    {name:"Raspberry-Pomegranate Syrup", unit:"ml", stock:600},
    {name:"Strawberry Syrup", unit:"ml", stock:700},
    {name:"Ube Syrup", unit:"ml", stock:600},
    {name:"Condensed Milk", unit:"ml", stock:700},
    {name:"Tiramisu Syrup", unit:"ml", stock:500},
    {name:"Vanilla Syrup", unit:"ml", stock:700},
    {name:"Water", unit:"ml", stock:5000},
    {name:"Ice", unit:"g", stock:6000},
    {name:"Whipped Cream", unit:"g", stock:800},
    {name:"Ice Cream", unit:"scoop", stock:40}
  ],
  sizeFactor: { "12": 1, "16": 1.25 },
  orders: JSON.parse(localStorage.getItem("orders") || "[]"),
  finance: JSON.parse(localStorage.getItem("finance") || "[]")
};

/* ========= MENU (Class → Varieties → recipe) ========= */
const MENU = {
  "TWELVE CLASSICS": [
    {variety:"Black Hole (Americano)", recipe:{"Espresso Beans":25,"Water":220}},
    {variety:"White Noise (Caffè Latte)", recipe:{"Espresso Beans":20,"Milk":200}},
    {variety:"Love & Thunder (White Chocolate Strawberry)", recipe:{"Espresso Beans":20,"Milk":180,"White Chocolate Syrup":30,"Strawberry Syrup":20}},
    {variety:"KLM (Milo Espresso Affogato)", recipe:{"Espresso Beans":20,"Milk":150,"Milo Powder":30,"Ice Cream":1}},
    {variety:"Barcelona (Muscovado Oatmilk Espresso)", recipe:{"Espresso Beans":25,"Oat Milk":200,"Muscovado Syrup":20}}
  ],
  "TWELVE SIGNATURE": [
    {variety:"Dulce de Leche (Caramel Macchiato)", recipe:{"Espresso Beans":20,"Milk":180,"Caramel Syrup":25}},
    {variety:"Shibuya Crossing (Matcha Macchiato)", recipe:{"Matcha Powder":8,"Milk":200,"Espresso Beans":10}},
    {variety:"December Affair (Mocha ala Mode)", recipe:{"Espresso Beans":20,"Milk":180,"Chocolate Syrup":30,"Ice Cream":1}},
    {variety:"Madrid (Spanish Latte)", recipe:{"Espresso Beans":20,"Milk":180,"Condensed Milk":30}},
    {variety:"Pick me up! (Tiramisu Latte)", recipe:{"Espresso Beans":20,"Milk":180,"Tiramisu Syrup":25}},
    {variety:"Milkyway (White Mocha)", recipe:{"Espresso Beans":20,"Milk":180,"White Chocolate Syrup":30}}
  ],
  "COLD BREW": [
    {variety:"Afterdark (Brown Sugar Shaken)", recipe:{"Cold Brew Base":250,"Muscovado Syrup":20}},
    {variety:"First Dose (Classic)", recipe:{"Cold Brew Base":250}},
    {variety:"Siargao (Peaches & Berries Infused)", recipe:{"Cold Brew Base":220,"Mixed Berries Purée":20,"Mango Syrup/Purée":10}},
    {variety:"Godfather (Vanilla Sweet Cream Foam)", recipe:{"Cold Brew Base":220,"Vanilla Syrup":15,"Sweet Cream Foam":40}}
  ],
  "FRAPPE": [
    {variety:"Mixed Berries Frappe", recipe:{"Ice":200,"Milk":150,"Mixed Berries Purée":40,"Whipped Cream":20}},
    {variety:"Tres Leches Frappe", recipe:{"Ice":200,"Milk":150,"Condensed Milk":30,"Vanilla Syrup":15,"Whipped Cream":20}},
    {variety:"Matcha Cream Frappe", recipe:{"Ice":200,"Milk":150,"Matcha Powder":10,"Sweet Cream Foam":30}}
  ],
  "NON-COFFEE": [
    {variety:"Malagos Sikwate (Hot/Iced Chocolate)", recipe:{"Milk":200,"Chocolate Syrup":40}},
    {variety:"Signature Matcha Latte", recipe:{"Milk":200,"Matcha Powder":12}},
    {variety:"Ube Pastillas Latte", recipe:{"Milk":200,"Ube Syrup":30,"Condensed Milk":20}},
    {variety:"Strawberry Matcha Latte", recipe:{"Milk":200,"Matcha Powder":8,"Strawberry Syrup":25}},
    {variety:"Strawberry Milk", recipe:{"Milk":220,"Strawberry Syrup":30}}
  ],
  "FRUIT TEA FRESHERS": [
    {variety:"Mango Passion", recipe:{"Tea Base":200,"Mango Syrup/Purée":30}},
    {variety:"Acai Mixed Berries", recipe:{"Tea Base":200,"Mixed Berries Purée":30}},
    {variety:"Raspberry Pomegranate", recipe:{"Tea Base":200,"Raspberry-Pomegranate Syrup":30}}
  ],
  "ADD-ON'S": [
    {variety:"Sub-oat milk", recipe:{"Oat Milk":50}},
    {variety:"Whipped Cream", recipe:{"Whipped Cream":15}},
    {variety:"Espresso Shot", recipe:{"Espresso Beans":10}},
    {variety:"Sauces/Syrups (vanilla sample)", recipe:{"Vanilla Syrup":10}},
    {variety:"Vanilla Sweet Cream Foam", recipe:{"Sweet Cream Foam":20}},
    {variety:"Ice Cream", recipe:{"Ice Cream":1}}
  ]
};

/* ========= DOM HOOKS ========= */
const classSelect = document.getElementById("classSelect");
const varietySelect = document.getElementById("varietySelect");
const sizeSelect = document.getElementById("sizeSelect");
const qtyInput = document.getElementById("qtyInput");
const recipePreview = document.getElementById("recipePreview");
const invTable = document.getElementById("inventoryTable");
const invSearch = document.getElementById("invSearch");
const restockSelect = document.getElementById("restockSelect");
const restockQty = document.getElementById("restockQty");
const restockForm = document.getElementById("restockForm");
const restockMsg = document.getElementById("restockMsg");
const orderForm = document.getElementById("orderForm");
const orderMsg = document.getElementById("orderMessage");
const orderLog = document.getElementById("orderLog");
const todayCount = document.getElementById("todayCount");
const lowCount = document.getElementById("lowCount");
const lackCount = document.getElementById("lackCount");

// FINANCE DOM (make sure your HTML has these IDs)
const financeTable = document.getElementById("financeTable");
const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const netProfit = document.getElementById("netProfit");
const generateReport = document.getElementById("generateReport");

/* ========= HELPERS ========= */
const fmt = (n) => (typeof n === "number" ? (Number.isInteger(n) ? n : n.toFixed(0)) : n);
const nowStr = () => new Date().toLocaleString();
const getIng = (name) => state.ingredients.find(i => i.name === name);
const saveOrders = () => localStorage.setItem("orders", JSON.stringify(state.orders));
const saveFinance = () => localStorage.setItem("finance", JSON.stringify(state.finance));

/* ========= FINANCE FUNCTIONS ========= */
function recordIncome(amount, description) {
  state.finance.push({ type: "Income", description, amount, date: new Date().toISOString() });
  saveFinance();
  renderFinance();
}

function recordExpense(amount, description) {
  state.finance.push({ type: "Expense", description, amount, date: new Date().toISOString() });
  saveFinance();
  renderFinance();
}

function renderFinance() {
  if (!financeTable) return;
  financeTable.innerHTML = "";
  let income = 0, expense = 0;
  state.finance.forEach(f => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.type}</td>
      <td>${f.description}</td>
      <td>${f.amount.toFixed(2)}</td>
      <td>${new Date(f.date).toLocaleString()}</td>`;
    financeTable.appendChild(tr);

    if (f.type === "Income") income += f.amount;
    else expense += f.amount;
  });

  totalIncome.textContent = income.toFixed(2);
  totalExpenses.textContent = expense.toFixed(2);
  const profit = income - expense;
  netProfit.textContent = profit.toFixed(2);
  netProfit.style.color = profit >= 0 ? "#2e7d32" : "#c62828";
}

/* ========= REFRESH TOTALS ========= */
function refreshTotals() {
  const today = new Date().toDateString();
  const todays = state.orders.filter(o => new Date(o.date).toDateString() === today);
  todayCount.textContent = `Today’s orders: ${todays.length}`;

  let low = 0, lack = 0;
  state.ingredients.forEach(i => {
    if (i.stock <= 0) lack++;
    else if (i.stock <= (i.unit === "scoop" ? 5 : 200)) low++;
  });
  lowCount.textContent = `Low ingredients: ${low}`;
  lackCount.textContent = `Lacking ingredients: ${lack}`;
}

/* ========= BUILD SELECTS ========= */
function buildClassSelect() {
  classSelect.innerHTML = `<option value="">Select Class</option>`;
  Object.keys(MENU).forEach(cls => {
    const opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls;
    classSelect.appendChild(opt);
  });
}

function buildVarietySelect() {
  varietySelect.innerHTML = `<option value="">Select Variety</option>`;
  varietySelect.disabled = !classSelect.value;
  if (!classSelect.value) return;

  MENU[classSelect.value].forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.variety;
    opt.textContent = v.variety;
    varietySelect.appendChild(opt);
  });
}

function showRecipePreview() {
  recipePreview.innerHTML = "";
  const cls = classSelect.value, varName = varietySelect.value;
  if (!cls || !varName) return;
  const base = MENU[cls].find(v => v.variety === varName).recipe;
  const factor = state.sizeFactor[sizeSelect.value] * Number(qtyInput.value || 1);
  Object.entries(base).forEach(([ing, amt]) => {
    const adj = (ing === "Ice Cream" || ing === "Whipped Cream") ? amt * factor : Math.round(amt * factor);
    const li = document.createElement("li");
    const unit = getIng(ing)?.unit ?? "";
    li.textContent = `${ing}: ${fmt(adj)} ${unit}`;
    recipePreview.appendChild(li);
  });
}

/* ========= INVENTORY UI ========= */
function renderInventory(filter="") {
  invTable.innerHTML = "";
  state.ingredients
    .filter(i => i.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(i => {
      let cls = "";
      let status = "OK";
      const thresh = (i.unit === "scoop" ? 5 : 200);
      if (i.stock <= 0) { cls = "lack"; status = "LACKING"; }
      else if (i.stock <= thresh) { cls = "low"; status = "LOW"; }
      const tr = document.createElement("tr");
      tr.className = cls;
      tr.innerHTML = `
        <td>${i.name}</td>
        <td>${fmt(i.stock)}</td>
        <td>${i.unit}</td>
        <td>${status}</td>`;
      invTable.appendChild(tr);
    });
}
invSearch.addEventListener("input", e => renderInventory(e.target.value));

function buildRestockSelect() {
  restockSelect.innerHTML = "";
  state.ingredients.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i.name; opt.textContent = i.name;
    restockSelect.appendChild(opt);
  });
}

/* ========= ORDER LOG ========= */
function renderOrders() {
  orderLog.innerHTML = "";
  state.orders.forEach((o, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${idx + 1}</td>
    <td contenteditable="false" class="editable">${o.employee}</td>
    <td contenteditable="false" class="editable">${o.className}</td>
    <td contenteditable="false" class="editable">${o.variety}</td>
    <td contenteditable="false" class="editable">${o.size}</td>
    <td contenteditable="false" class="editable">${o.qty}</td>
    <td>${new Date(o.date).toLocaleString()}</td>
    <td>
        <button class="editBtn" data-idx="${idx}">✏️ Edit</button>
        <button class="deleteBtn" data-idx="${idx}">🗑️ Delete</button>
    </td>`;
    orderLog.appendChild(tr);
  });
  refreshTotals();

  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const cells = row.querySelectorAll(".editable");
      const idx = e.target.dataset.idx;
      const editing = row.classList.toggle("editing");

      if (editing) {
        cells.forEach(td => td.contentEditable = true);
        e.target.textContent = "💾 Save";
      } else {
        const updated = {
          employee: cells[0].textContent.trim(),
          className: cells[1].textContent.trim(),
          variety: cells[2].textContent.trim(),
          size: cells[3].textContent.trim(),
          qty: parseInt(cells[4].textContent.trim()) || 1,
          date: state.orders[idx].date
        };
        state.orders[idx] = updated;
        saveOrders();
        cells.forEach(td => td.contentEditable = false);
        e.target.textContent = "✏️ Edit";
        renderOrders();
        renderInventory(invSearch.value);
        refreshTotals();
        orderMsg.textContent = `✅ Order #${parseInt(idx) + 1} updated successfully.`;
        orderMsg.className = "msg ok";
      }
    });
  });

  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.idx;
      if (!confirm(`❗ Delete order #${parseInt(idx) + 1}?`)) return;
      state.orders.splice(idx, 1);
      saveOrders();
      renderOrders();
      refreshTotals();
      orderMsg.textContent = `🗑️ Order #${parseInt(idx) + 1} deleted.`;
      orderMsg.className = "msg err";
    });
  });
}

/* ========= PLACE ORDER ========= */
orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  orderMsg.textContent = ""; orderMsg.className = "msg";

  const employee = document.getElementById("employeeName").value.trim();
  const className = classSelect.value;
  const variety = varietySelect.value;
  const size = sizeSelect.value;
  const qty = Math.max(1, parseInt(qtyInput.value || "1", 10));

  if (!employee || !className || !variety) return;

  const recipeBase = MENU[className].find(v => v.variety === variety).recipe;
  const factor = state.sizeFactor[size] * qty;

  const missing = [];
  for (const [ing, amount] of Object.entries(recipeBase)) {
    const have = getIng(ing);
    if (!have) { missing.push(`${ing} (not defined)`); continue; }
    const need = (have.unit === "scoop") ? amount * factor : Math.round(amount * factor);
    if (have.stock < need) missing.push(`${ing} (need ${need} ${have.unit}, have ${fmt(have.stock)})`);
  }
  if (missing.length) {
    orderMsg.textContent = `⚠️ Insufficient stock: ${missing.join("; ")}`;
    orderMsg.className = "msg err";
    return;
  }

  for (const [ing, amount] of Object.entries(recipeBase)) {
    const have = getIng(ing);
    const need = (have.unit === "scoop") ? amount * factor : Math.round(amount * factor);
    have.stock -= need;
  }

  state.orders.push({
    employee, className, variety, size, qty, date: new Date().toISOString()
  });
  saveOrders();

  // record finance income
  const income = qty * 150;
  recordIncome(income, `Order: ${qty}x ${variety}`);

  renderInventory(invSearch.value);
  renderOrders();
  showRecipePreview();

  orderForm.reset();
  varietySelect.disabled = true;
  orderMsg.textContent = `✅ Order recorded for ${employee}: ${qty} × ${variety} (${size}oz)`;
  orderMsg.className = "msg ok";
});

/* ========= RESTOCK ========= */
restockForm.addEventListener("submit", (e) => {
  e.preventDefault();
  restockMsg.textContent = ""; restockMsg.className = "msg";
  const name = restockSelect.value;
  const qty = parseFloat(restockQty.value);
  const ing = getIng(name);
  if (!ing || !(qty > 0)) return;

  ing.stock += (ing.unit === "scoop") ? Math.round(qty) : qty;
  renderInventory(invSearch.value);
  refreshTotals();

  restockForm.reset();
  restockMsg.textContent = `✅ Restocked ${name}`;
  restockMsg.className = "msg ok";

  const restockCost = qty * 30;
  recordExpense(restockCost, `Restocked ${qty} units of ${name}`);
});

/* ========= WIRE UP ========= */
classSelect.addEventListener("change", () => { buildVarietySelect(); showRecipePreview(); });
varietySelect.addEventListener("change", showRecipePreview);
sizeSelect.addEventListener("change", showRecipePreview);
qtyInput.addEventListener("input", showRecipePreview);

generateReport?.addEventListener("click", () => {
  alert("📊 Financial report refreshed!");
  renderFinance();
});

/* ========= INIT ========= */
(function init(){
  buildClassSelect();
  buildVarietySelect();
  buildRestockSelect();
  renderInventory();
  renderOrders();
  renderFinance();
})();
