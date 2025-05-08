let pieChart; // Chart instance
let customCategories = []; // Store custom expense input IDs

function addCustomExpense() {
  const container = document.getElementById('custom-expenses');
  const id = `custom-${customCategories.length}`;
  customCategories.push(id);

  const div = document.createElement('div');
  div.innerHTML = `
    <label>
      <input type="text" placeholder="Name" id="${id}-name" />
      $<input type="number" id="${id}-amount" />
    </label>
  `;
  container.appendChild(div);
}

function calculateBudget() {
  const income = parseFloat(document.getElementById("income").value) || 0;
  const rent = parseFloat(document.getElementById("rent").value) || 0;
  const groceries = parseFloat(document.getElementById("food").value) || 0;
  const utilities = parseFloat(document.getElementById("utilities").value) || 0;
  const other = parseFloat(document.getElementById("other").value) || 0;

  const chartType = document.getElementById("chartType").value;

  let customLabels = [];
  let customValues = [];

  for (let i = 0; i < customCategories.length; i++) {
    const nameInput = document.getElementById(`${customCategories[i]}-name`);
    const amountInput = document.getElementById(`${customCategories[i]}-amount`);

    const name = nameInput?.value.trim() || `Custom ${i + 1}`;
    const amount = parseFloat(amountInput?.value) || 0;

    customLabels.push(name);
    customValues.push(amount);
  }

  const allLabels = ['Rent', 'Food', 'Utilities', 'Other', ...customLabels];
  const allData = [rent, groceries, utilities, other, ...customValues];
  const totalExpenses = allData.reduce((sum, val) => sum + val, 0);
  const balance = income - totalExpenses;

  // Destroy previous chart if it exists
  if (pieChart) {
    pieChart.destroy();
  }

  const ctx = document.getElementById('myPieChart').getContext('2d');
  pieChart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: allLabels,
      datasets: [{
        label: 'Expenses',
        data: allData,
        backgroundColor: generateColors(allLabels.length),
        borderColor: '#444',
        borderWidth: 1,
        fill: chartType === 'line' ? false : true
      }]
    },
    options: {
      responsive: true,
      scales: chartType !== 'pie' ? {
        y: {
          beginAtZero: true
        }
      } : {}
    }
  });

  let resultText = `Total Expenses: $${totalExpenses.toFixed(2)}<br>`;
  resultText += balance >= 0
    ? `You are saving $${balance.toFixed(2)} this month. ✅`
    : `You are overspending by $${Math.abs(balance).toFixed(2)}. ⚠️`;

  document.getElementById("results").innerHTML = resultText;
}

function generateColors(n) {
  const baseColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#66BB6A',
    '#BA68C8', '#FFA726', '#8D6E63', '#26A69A',
    '#EF5350', '#29B6F6', '#AB47BC', '#FF7043'
  ];
  const colors = [];

  for (let i = 0; i < n; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }

  return colors;
}
