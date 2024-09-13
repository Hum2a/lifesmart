<template>
  <div class="investment-calculator">
    <div class="calculator-content">
      <div class="calculator-inputs">
        <div class="input-group">
          <label for="initialInvestment">Initial Investment:</label>
          <input type="number" placeholder="£" id="initialInvestment" v-model="initialInvestment" class="calculator-input">
        </div>
        <div class="input-group">
          <label for="monthlyContribution">Monthly Contribution:</label>
          <input type="number" placeholder="£" id="monthlyContribution" v-model="monthlyContribution" class="calculator-input">
        </div>
        <div class="input-group">
          <label for="investmentPeriod">Investment Period (years):</label>
          <input type="number" placeholder="£" id="investmentPeriod" v-model="investmentPeriod" class="calculator-input">
        </div>
        <button @click="calculate" class="calculate-button">Calculate</button>
      </div>
      <div class="calculator-chart">
        <canvas id="investmentChart" width="400" height="200"></canvas>
      </div>
    </div>
    <div class="result" v-if="futureValues.length > 0">
      <div v-for="(value, index) in futureValues" :key="'futureValue' + index">
        <p class="future-value-display">Future Value (Rate {{ rates[index] }}%): <span class="future-value">£{{ value }}</span></p>
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
      rates: [3, 8, 12], // Default return rates in percentages
      futureValues: [],
      chart: null,
    };
  },
  mounted() {
    // Automatically calculate and show the graph when the component mounts
    this.calculate();
  },
  methods: {
    renderChart(datasets = []) {
      const ctx = document.getElementById('investmentChart').getContext('2d');
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 11 }, (_, i) => (i === 0 ? 'Start' : `${i}`)),
          datasets: datasets
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
              display: true
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Years'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Value (£)'
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

      const datasets = [];
      this.futureValues = [];

      // Calculate for each rate in the rates array
      this.rates.forEach((rate) => {
        const monthlyRate = rate / 100 / 12;
        let currentValue = principal;
        const data = [currentValue];

        for (let i = 1; i <= years * 12; i++) {
          currentValue = currentValue * (1 + monthlyRate) + monthlyContribution;
          if (i % 12 === 0) data.push(currentValue);
        }

        datasets.push({
          label: `Investment Growth at ${rate}%`,
          data: data,
          borderColor: this.getRandomColor(),
          fill: false
        });

        this.futureValues.push(currentValue.toFixed(2)); // Store future value for this rate
      });

      this.renderChart(datasets); // Render the graph with all datasets
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  }
};
</script>

<style scoped>
.investment-calculator {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calculator-inputs {
  width: 50%;
}

.input-group {
  margin-bottom: 15px;
}

.calculator-input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
}

.calculate-button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.calculator-chart {
  width: 100%;
  height: 300px;
  margin-top: 20px;
}

.result {
  margin-top: 20px;
}

.future-value-display {
  font-size: 1.2rem;
  font-weight: bold;
}

.future-value {
  color: #4caf50;
  font-size: 1.5rem;
}
</style>
