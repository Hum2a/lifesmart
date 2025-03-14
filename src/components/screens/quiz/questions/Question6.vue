<template>
    <div class="question-container">
      <!-- Header and Progress Bar -->
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressBarWidth + '%' }"></div>
        </div>
        <div class="timer">{{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}</div>
      </div>
  
  <!-- Glossary Sidebar -->
  <div v-if="showGlossary" class="glossary-sidebar">
      <div class="glossary-header">
        <h2>📖 Glossary</h2>
        <button class="close-button" @click="showGlossary = false">X</button>
      </div>
      <div class="glossary-content">
        <h3>Assets</h3>
        <p>Things you own that are worth money. For example, if you have a bicycle, some books, or a little money in a piggy bank, those are all your assets.</p>
        <h3>Liabilities</h3>
        <p>Money you owe to someone else. If you borrowed money from your friend to buy a new game and you have to give it back, that money is a liability.</p>
        <h3>Income Tax</h3>
        <p>A portion of the money that people earn from their jobs or other places, which they need to give to the government. This money helps pay for things like schools, roads, and hospitals.</p>
        <h3>Tax Rates</h3>
        <p>This tells you how much income tax you need to pay. It’s like a rule that says how much money you give to the government based on how much money you make.</p>
        <h3>Mortgage</h3>
        <p>A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.</p>
        <h3>Cryptocurrency</h3>
        <p>A type of money you can use on a computer but can't touch like coins or bills. It’s made using special computer codes and you can use it to buy things online.</p>
        <h3>Stocks Fund Portfolio</h3>
        <p>A basket of different companies that are all put together. When you buy a part of the basket, you own a small piece of all the companies in it. This helps spread the risk because if one company doesn't do well, others in the basket might still grow!</p>
        <h3>S&P 500</h3>
        <p>A list of the 500 biggest and most important companies in America. If you invest in the S&P 500, you’re buying a little piece of each of those 500 companies. </p>
        <h3>Interest</h3>
        <p>If you save your money in a bank, the bank pays you extra money for letting them keep it there. This extra money is called interest.</p>
        <h3>Compound Interest</h3>
        <p>This is when you get interest on both the money you saved and the extra money (interest) you earned before. It's like your money making more money because the interest starts earning interest too!</p>
        <h3>Annual Return</h3>
        <p>This is how much money you make or lose from an investment in a year. It tells you how good or bad the investment did.</p>
        <h3>Credit Rating</h3>
        <p>A score that everyone has, that tells banks how good you are at paying back money. If you have a high score, banks think you’re good at paying back and are more likely to lend you money.</p>
      </div>
    </div>

    <!-- Hint Modal -->
    <div v-if="showHintModal" class="hint-modal-overlay">
      <div class="hint-modal">
        <h3>Hint</h3>
        <p>Net worth = Total Assets – Total Liabilities</p>
        <button @click="showHintModal = false" class="close-modal-button">Close</button>
      </div>
    </div>
  
      <!-- Task Description -->
      <div class="task-header">
        <div class="header-content">
          <h3>Challenge 6</h3>
          <div class="button-container">
            <button class="glossary-button" @click="showGlossary = true">📖 Glossary</button>
            <!-- <button class="hint-button" @click="showHintModal = true">💡 Hint</button> -->
          </div>
        </div>
        <p>
          So now for the final round and the investment challenge to decide the ultimate winner. Ben has £100,000 in savings and wants to build a diversified portfolio of different asset classes. 
        </p>
        <p>Each team will get a bonus £200 for each point they scored in the previous rounds.</p>
      </div>
  
      <!-- Image -->
      <!-- <img src="../../../../assets/q6image.png" alt="Investment Allocation Image" class="allocation-image" /> -->
  
      <!-- Asset Allocation Section -->
      <div class="allocation-header">
        <p>Decide how to allocate the money between these 5 asset classes.</p>
        <!-- <div class="amount-container">
          <span class="amount">⚡ £200</span>
        </div> -->
      </div>
  
      <!-- Asset Classes -->
      <div class="asset-classes-container">
        <div class="asset-class" v-for="(asset, index) in assets" :key="asset.name">
          <button class="asset-button" @click="toggleAsset(index)">
            <img :src="require(`../../../../assets/${asset.image}.png`)" :alt="asset.name" class="asset-icon" />
            <span>{{ asset.name }}</span>
          </button>
          <div v-if="expandedAssets[index]" class="asset-definition">
            <p>{{ asset.definition }}</p>
          </div>
        </div>
      </div>
  
      <!-- Asset Classes Breakdown Graph -->
      <img src="../../../../assets/graphimage.png" alt="Asset Allocation Graph" class="allocation-graph" />
  
      <!-- Next Button -->
      <button class="submit-button" @click="nextQuestion">Next</button>
    </div>
  </template>
  
  <script>
  export default {
  name: "QuestionNo6",
  props: {
    teams: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      timer: 600, // 10-minute timer
      intervalId: null,
      showGlossary: false,
      showHintModal: false,
      expandedAssets: Array(5).fill(false), // Array to track expanded state of assets
      assets: [
        {
          name: "Equities",
          icon: "📈",
          image: "equities",
          definition: "Equities are shares of ownership in a company. Investing in equities can offer high returns but comes with higher risk.",
        },
        {
          name: "Bonds",
          icon: "💵",
          image: "bonds",
          definition: "Bonds are loans to a company or government. They provide lower returns compared to stocks but are considered safer.",
        },
        {
          name: "Real Estate",
          icon: "🏠",
          image: "real_estate",
          definition: "Real estate involves investing in property. It can provide steady income through rent and long-term appreciation.",
        },
        {
          name: "Commodities",
          icon: "⛏️",
          image: "commodities",
          definition: "Commodities include raw materials like gold, oil, and agricultural products. These are often used as a hedge against inflation.",
        },
        {
          name: "Alternative Investments",
          icon: "📊",
          image: "other",
          definition: "Alternative investments include assets like hedge funds, private equity, and cryptocurrencies. They are less traditional but can offer diversification.",
        },
      ],
    };
  },
  computed: {
    minutes() {
      return Math.floor(this.timer / 60);
    },
    seconds() {
      return this.timer % 60;
    },
    progressBarWidth() {
      return (this.timer / 600) * 100;
    },
  },
  methods: {
    startTimer() {
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.intervalId); // Stop the timer when time runs out
        }
      }, 1000);
    },
    toggleAsset(index) {
      this.expandedAssets = this.expandedAssets.map((expanded, i) => i === index ? !expanded : false);
    },
    nextQuestion() {
      this.$emit("next-question");
    },
  },
  mounted() {
    this.startTimer(); // Start the timer when the component is mounted
  },
  beforeUnmount() {
    clearInterval(this.intervalId); // Clear the timer when the component is destroyed
  },
};
  </script>
  
  <style scoped>
  /* General styles */
  .question-container {
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #fff;
    border-radius: 10px;
    max-width: 1000px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .progress-bar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .progress-bar {
    width: 80%;
    height: 5px;
    background-color: #e0e0e0;
    border-radius: 5px;
  }
  
  .progress {
    height: 100%;
    background-color: #3b82f6;
    border-radius: 5px;
  }
  
  .timer {
    font-size: 1.2rem;
    font-weight: bold;
    color: black;
  }
  
  .task-header {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
  }
  
  .task-header h3 {
    font-size: 2rem;
    color: #000;
  }
  
  .task-header p {
    color: #555;
    font-size: 1.5rem;
    margin-top: 5px;
  }
  
  .button-container {
    display: flex;
    gap: 10px;
  }
  
  .glossary-button, .hint-button {
    background-color: #f0f4ff;
    border: 1px solid #e0e0e0;
    color: #003f91;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
  }
  
  .glossary-button:hover, .hint-button:hover {
    background-color: #dbe9ff;
  }
  
  .allocation-image {
    width: 100%;
    max-width: 400px;
    margin: 20px auto;
  }
  
  .allocation-header {
    color: #000;
    margin-top: 20px;
    font-size: 1.4rem;
  }
  
  .asset-classes-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
  }
  
  .asset-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #e6f0ff;
    color: #000;
    padding: 30px 10px;
    font-size: 1.2rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.7s ease;
    width: 100%;
  }
  
  .asset-button:focus,
  .asset-button:hover {
    background-color: #dbe9ff;
  }

  .asset-definition {
    background-color: #f0f4ff;
    color: #000;
    border: 1px solid #dbe9ff;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    transition: max-height 0.7s ease;
  }
    
  .asset-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
  }
  
/* Submit and Next Button */
.submit-button,
.next-button {
  width: 20%;
  background-color: #003F91;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
}

.submit-button:hover,
.next-button:hover {
  background-color: #2563eb;
}
  
  .glossary-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 350px;
    height: 100%;
    background-color: white;
    padding: 20px;
    overflow-y: auto;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
  
  .glossary-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
  }
  
  .glossary-header h2 {
    font-size: 1.5rem;
    color: #003f91;
  }
  
  .glossary-content h3 {
    font-size: 1.2rem;
    margin-top: 20px;
    color: #2563eb;
  }
  
  .glossary-content p {
    font-size: 1rem;
    color: #555;
    margin-top: 5px;
    line-height: 1.5;
  }
  
  .hint-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .hint-modal {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    text-align: center;
  }
  
  .hint-modal h3 {
    font-size: 1.5rem;
    color: #003f91;
  }
  
  .hint-modal p {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: #000;
  }
  
  .close-modal-button {
    background-color: #003f91;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  