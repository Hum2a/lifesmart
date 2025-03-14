<template>
  <div class="investment-calculator">
    <div class="calculator-content">
      <div class="calculator-inputs">
        <div class="input-group">
          <label for="initialInvestment">Initial Investment (£):</label>
          <input type="number" placeholder="0" id="initialInvestment" v-model="initialInvestment" class="calculator-input">
        </div>
        <div class="input-group">
          <label for="monthlyContribution">Monthly Contribution (£):</label>
          <input type="number" placeholder="500" id="monthlyContribution" v-model="monthlyContribution" class="calculator-input">
        </div>
        <div class="input-group">
          <label for="investmentPeriod">Investment Period (Years):</label>
          <input type="number" placeholder="10" id="investmentPeriod" v-model="investmentPeriod" class="calculator-input">
        </div>
        <!-- Single Interest Rate Input -->
        <div class="input-group">
          <label for="rate">Interest Rate (%):</label>
          <input type="number" v-model="rate" placeholder="8" class="calculator-input">
        </div>
        <button @click="calculate" class="calculate-button">Calculate</button>
      </div>

      <!-- Chart Section -->
      <div class="calculator-chart">
        <canvas id="investmentChart" width="400" height="200"></canvas>
      </div>
    </div>

    <!-- Results -->
    <div class="result" v-if="futureValue">
      <h4>Future Value:</h4>
      <div class="result-box">
        <p>At <strong>{{ rate }}%</strong> return rate:</p>
        <span class="future-value">£{{ formatNumber(futureValue) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
  name: 'InvestmentCalculator',
  data() {
    return {
      initialInvestment: 0,
      monthlyContribution: 500,
      investmentPeriod: 10,
      rate: 8, // Default return rate in percentage
      futureValue: null,
      chart: null,
    };
  },
  mounted() {
    this.calculate(); // Automatically calculate on load
  },
  methods: {
    formatNumber(value) {
      // Converts the value to a string with commas as thousand separators
      return parseFloat(value).toLocaleString('en-GB'); // 'en-GB' for UK style commas
    },
    renderChart(data = []) {
      const ctx = document.getElementById('investmentChart').getContext('2d');
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: this.investmentPeriod + 1 }, (_, i) => (i === 0 ? 'Start' : `Year ${i}`)),
          datasets: [{
            label: `Growth at ${this.rate}%`,
            data: data,
            borderColor: '#4CAF50',
            fill: false,
            tension: 0.4,
            borderWidth: 2
          }]
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': £';
                  }
                  label += context.parsed.y.toFixed(2);
                  return label;
                }
              }
            },
            legend: {
              display: true,
              labels: {
                color: '#4CAF50',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Years',
                color: '#333',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Value (£)',
                color: '#333',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              }
            }
          }
        }
      });
    },
    calculate() {
      const principal = parseFloat(this.initialInvestment);
      const monthlyContribution = parseFloat(this.monthlyContribution);
      const years = parseInt(this.investmentPeriod);
      const monthlyRate = this.rate / 100 / 12;
      let currentValue = principal;
      const data = [currentValue];

      for (let i = 1; i <= years * 12; i++) {
        currentValue = currentValue * (1 + monthlyRate) + monthlyContribution;
        if (i % 12 === 0) data.push(currentValue);
      }

      this.futureValue = currentValue.toFixed(2);
      this.renderChart(data);
    }
  }
};
</script>

<style scoped>
/* Overall Container */
.investment-calculator {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Input Fields and Labels */
.calculator-inputs {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.input-group {
  flex: 1 1 30%;
  color: black;
}

.calculator-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.calculator-input:focus {
  border-color: #4caf50;
}

/* Calculate Button */
.calculate-button {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.calculate-button:hover {
  background-color: #45a049;
}

/* Chart Container */
.calculator-chart {
  width: 100%;
  height: 300px;
  margin-top: 30px;
}

/* Result Display */
.result {
  margin-top: 30px;
  width: 100%;
  text-align: center;
}

.result-box {
  background-color: #f1f8e9;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: bold;
}

.result-box p {
  color: black;
}

.future-value {
  font-size: 1.6rem;
  color: #4caf50;
}
</style>
