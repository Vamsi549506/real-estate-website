// ===== 1. Data: Tampa-St. Petersburg-Clearwater metro, July of each year =====
// Source: Realtor.com housing inventory data, published by FRED (St. Louis Fed)
const years = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const medianListingPrice = [269900, 276545, 285000, 299178, 350000, 444900, 449000, 420500, 415000, 397450];
const activeListings = [13536, 13653, 13853, 8773, 4662, 8639, 8341, 16256, 19862, 18292];
const daysOnMarket = [56, 54, 57, 55, 32, 29, 46, 61, 73, 72];

// ===== 2. Shared chart settings =====
const NAVY = "#0b2545";
const GRID = "#e9ecef";

Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
Chart.defaults.color = "#495057";
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.display = false;

// ===== 3. Chart 1: Median listing price (line chart) =====
new Chart(document.getElementById("priceChart"), {
  type: "line",
  data: {
    labels: years,
    datasets: [{
      label: "Median listing price",
      data: medianListingPrice,
      borderColor: NAVY,
      backgroundColor: NAVY,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 7,
      tension: 0
    }]
  },
  options: {
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return " $" + context.parsed.y.toLocaleString("en-US");
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return "$" + value / 1000 + "K";
          }
        },
        grid: { color: GRID }
      },
      x: { grid: { display: false } }
    }
  }
});

// ===== 4. Chart 2: Active listings (bar chart) =====
new Chart(document.getElementById("inventoryChart"), {
  type: "bar",
  data: {
    labels: years,
    datasets: [{
      label: "Active listings",
      data: activeListings,
      backgroundColor: NAVY,
      borderRadius: 4,
      maxBarThickness: 36
    }]
  },
  options: {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return " " + context.parsed.y.toLocaleString("en-US") + " homes for sale";
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: GRID } },
      x: { grid: { display: false } }
    }
  }
});

// ===== 5. Chart 3: Median days on market (line chart) =====
new Chart(document.getElementById("daysChart"), {
  type: "line",
  data: {
    labels: years,
    datasets: [{
      label: "Median days on market",
      data: daysOnMarket,
      borderColor: NAVY,
      backgroundColor: NAVY,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 7,
      tension: 0
    }]
  },
  options: {
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return " " + context.parsed.y + " days";
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: GRID } },
      x: { grid: { display: false } }
    }
  }
});