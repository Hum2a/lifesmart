<template>
  <div class="question-container">
       <!-- Header and Progress Bar -->
       <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressBarWidth + '%' }"></div>
      </div>

      <!-- Timer or Start Button -->
      <div class="timer-container">
        <button v-if="!timerStarted" @click="startTimer" class="start-timer-button">
          ⏳ {{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }} Start Timer
        </button>
        <div v-else class="timer">
          ⏳ {{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}
        </div>
      </div>
    </div>

    <!-- Task Description -->
    <div class="task-header">
      <div class="header-content">
        <h3>Task 2</h3>
        <div class="button-container">
          <button class="glossary-button" @click="showGlossary = true">Glossary</button>
          <button class="hint-button" @click="showHintModal = true">Hint?</button>
        </div>
      </div>
      <p>Ben earns £60,000 a year. Income Tax automatically comes out of his paycheck before he gets the money.</p>
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
        <p>The first £10,000 Ben earns doesn't get taxed at all. The next money he makes from £10,000 - £40,000 (which is £30,000) gets taxed at 20%. The remaining money he makes after $40,000 gets taxed at 40%.</p>
        <p>Calculate the total tax he pays and subtract it from his earnings.</p>
        <button @click="showHintModal = false" class="close-modal-button">Close</button>
      </div>
    </div>

    <!-- Tax Information Table -->
    <div class="tax-info-table">
      <table>
        <thead>
          <tr>
            <th>Income</th>
            <th>Tax rate</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>£0 - £10,000</td>
            <td><span class="tax-rate tax-0">0%</span></td>
            <td>The first 10k is tax-free</td>
          </tr>
          <tr>
            <td>£10,000 - £40,000</td>
            <td><span class="tax-rate tax-20">20%</span></td>
            <td>You pay 20% tax on the money IN THIS BRACKET only</td>
          </tr>
          <tr>
            <td>£40,000 - £100,000</td>
            <td><span class="tax-rate tax-40">40%</span></td>
            <td>You pay 40% tax on the money IN THIS BRACKET only</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Conditionally display answer options or result section -->
    <div v-if="!showResults">
      <!-- Question and Points Section -->
      <div class="question-section">
        <p>How much money does he get in his account after tax?</p>
        <div class="points-section">
          <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt">
          <p class="points">3 points</p>
        </div>
      </div>

      <!-- Multiple Choice Options -->
      <div class="choices-container">
        <button class="choice-button">A. £38,000</button>
        <button class="choice-button">B. £42,000</button>
        <button class="choice-button">C. £46,000</button>
        <button class="choice-button">D. £48,000</button>
        <button class="choice-button">E. £50,000</button>
      </div>

      <!-- Team Answer Section -->
      <div class="team-answer-section">
        <h4>Your answers</h4>
        <div class="team-answer-container">
          <div v-for="(team, index) in teams" :key="team.name" class="team-answer-box">
            <p>{{ team.name }}</p>
            <select v-model="teamAnswers[index]" class="answer-select">
              <option value="" disabled>Select answer</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button class="submit-button" @click="submitAnswers">Submit</button>
    </div>

    <!-- Correct Answer and Results Section -->
    <div v-else class="result-section">
      <h4>Correct Answer:</h4>
      <p class="correct-answer">£46,000</p>
      <p @click="toggleExpandedAnswer" class="detailed-answer-toggle">
        Click to see detailed answer
        <span v-if="!showExpandedAnswer">⬇️</span>
        <span v-else>⬆️</span>
      </p>

      <!-- Expanded Answer (Detailed Explanation) -->
      <div v-if="showExpandedAnswer" class="expanded-answer">
        <table>
          <thead>
            <tr>
              <th>Income</th>
              <th>Tax rate</th>
              <th>Calculations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>£0 - £10,000</td>
              <td><span class="tax-rate tax-0">0%</span></td>
              <td>£0</td>
            </tr>
            <tr>
              <td>£10,000 - £40,000</td>
              <td><span class="tax-rate tax-20">20%</span></td>
              <td>£30,000 <span style="color: blue;">X</span> 20% = £6,000</td>
            </tr>
            <tr>
              <td>£40,000 - <span class="income-text">£60,000</span></td>
              <td><span class="tax-rate tax-40">40%</span></td>
              <td>£20,000 <span style="color: blue;">X</span> 40% = £8,000</td>
            </tr>
            <tr>
              <td colspan="3" class="end-text">
                <p><strong>Total tax paid:</strong> £6,000 + £8,000 = <span class="tax-paid-text">£14,000</span></p>
              </td>
            </tr>
            <tr>
              <td colspan="3" class="centered-text">
                <p><strong>Total income left to take home</strong></p>
                <p><span class="income-text">£60,000</span> - <span class="tax-paid-text">£14,000</span> = <span class="correct-answer">£46,000</span></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Display each team's answer with comparison -->
      <div class="team-answer-comparison">
        <div v-for="(team, index) in teams" :key="team.name" class="team-answer-box">
          <p>{{ team.name }}</p>
          <div :class="{'correct': teamAnswers[index] === correctAnswer, 'incorrect': teamAnswers[index] !== correctAnswer}">
            {{ teamAnswers[index] || '-' }}
          </div>
        </div>
      </div>

      <button class="next-button" @click="nextQuestion">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionNo2',
  props: {
    teams: {
      type: Array,
      required: true // The teams will be passed from FinancialQuiz.vue
    }
  },
  data() {
    return {
      correctAnswer: 'C',
      teamAnswers: Array(this.teams.length).fill(''), // Initialize with empty answers for each team
      showResults: false,
      showExpandedAnswer: false, // State to show/hide expanded answer
      showGlossary: false, // Show/hide glossary
      showHintModal: false, // Show/hide hint modal
      timer: 240, // Timer starts at 4 minutes
      intervalId: null,
      timerStarted: false // Timer is initially not started
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
      return (this.timer / 240) * 100; // Calculate progress bar width based on time remaining
    }
  },
  methods: {
    submitAnswers() {
      this.showResults = true; // Set the showResults flag to true to reveal the correct answer and the comparison of each team's answer
      clearInterval(this.intervalId); // Clear the timer after submission
    },
    nextQuestion() {
      const pointsArray = this.teamAnswers.map(answer => (answer === this.correctAnswer ? 3 : 0));
      this.$emit('award-points', pointsArray); // Emit points to parent
      this.$emit('next-question'); // Emit event to parent to move to the next question
    },
    toggleExpandedAnswer() {
      this.showExpandedAnswer = !this.showExpandedAnswer;
    },
    startTimer() {
      if (!this.timerStarted) {
        this.timerStarted = true;
        this.intervalId = setInterval(() => {
          if (this.timer > 0) {
            this.timer--;
          } else {
            clearInterval(this.intervalId); // Stop the timer when time runs out
          }
        }, 1000);
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalId); // Clear the timer when the component is destroyed
  }
};
</script>

<style scoped>
/* Main Container Styling */
.question-container {
  padding: 20px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: #ffffff; /* White background */
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Progress Bar Styling */
.progress-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.progress-bar {
  width: 80%;
  height: 5px;
  background-color: #e0e0e0;
  border-radius: 5px;
  position: relative;
}

.progress {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 5px;
}

/* Timer Styling */
.timer-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer {
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
}

.start-timer-button {
  font-size: 1rem;
  padding: 1px;
  background-color: transparent;
  color: black;
  border: none;
  border-radius: 10px;
  border-color: green;
  border-width: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-timer-button:hover {
  background-color: #45a04933;
}

/* Task Header */
.task-header {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
}

.task-header h3 {
  font-size: 1.5rem;
  color: #000;
  flex-grow: 1;
  text-align: start;
}

.task-header p {
  color: #555;
  font-size: 1rem;
  margin-top: 5px;
}

.button-container {
  display: flex;
  gap: 10px;
}

/* Glossary and Hint Buttons */
.glossary-button, .hint-button {
  background-color: #f0f4ff;
  border: 1px solid #e0e0e0;
  color: #003F91;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
  z-index: 1000;
}

.hint-modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 500px;
  text-align: center;
}

.hint-modal h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: black;
}

.hint-modal p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #333;
}

.close-modal-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.close-modal-button:hover {
  background-color: #2563eb;
}

/* Glossary Sidebar */
.glossary-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.glossary-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.glossary-header h2 {
  font-size: 1.5rem;
  color: #003F91;
}

.glossary-header .close-button {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #003F91;
}

.glossary-content h3 {
  font-size: 1.2rem;
  color: #333;
  margin-top: 20px;
}

.glossary-content p {
  font-size: 1rem;
  color: #555;
  margin-top: 5px;
  line-height: 1.5;
}


/* Tax Information Section */
.tax-info-table, .expanded-answer {
  margin-top: 20px;
  border: 1px solid #B3E3D3;
  border-radius: 10px;
  overflow: hidden;
  color: black;
}

.tax-info-table table, .expanded-answer table {
  width: 100%;
  border-collapse: collapse;
}

.tax-info-table th, .tax-info-table td, .expanded-answer th, .expanded-answer td {
  padding: 10px;
  text-align: left;
}

.tax-info-table th, .expanded-answer th {
  background-color: #EFEFEF;
  color: black;
}

.tax-info-table td, .expanded-answer td {
  background-color: #FFFFFF;
  color: black;
}

.tax-info-table tr, .expanded-answer tr {
  background-color: white;
  color: black;
}

.tax-rate {
  background-color: #f3ba2f;
  padding: 5px 10px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
}

.tax-0 {
  background-color: #f3ba2f;
}

.tax-20 {
  background-color: #ffa500;
}

.tax-40 {
  background-color: #ff4500;
}

.income-text {
  color: #8a2be2; /* Purple color for income text */
  font-weight: bold;
}

.tax-paid-text {
  color: #F28C28;
  font-weight: bold;
}

/* Question Section */
.question-section {
  text-align: center;
  margin-top: 20px;
}

.question-section p {
  font-size: 1.2rem;
  font-weight: bold;
}

.points-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.points {
  font-size: 1rem;
  color: #3b82f6;
  font-size: 1.2rem;
  font-weight: bold;
}

.lightning-bolt {
  width: 20px;
}

/* Multiple Choice Section */
.choices-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.choice-button {
  background-color: #B8CEF0;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  color: black;
  font-weight: bold;
  font-size: 1rem;
}

.choice-button:hover {
  background-color: #bae6fd;
}

/* Team Answer Section */
.team-answer-section {
  margin-top: 30px;
}

.team-answer-section h4 {
  text-align: center;
}

.team-answer-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.team-answer-container p {
  color: black;
}

.team-answer-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-answer-box p {
  margin-bottom: 5px;
  font-weight: bold;
  color: black;
}

.answer-select {
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #e0f2ff;
  font-size: 1.1rem;
  text-align: center;
}

/* Result Section */
.result-section {
  text-align: center;
  margin-top: 20px;
}

.correct-answer {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000; /* Green color for correct answer */
  margin: 20px;
  background-color: #B3E3D3;
  border-radius: 50px;
  width: 25%;
  padding: 15px;
  text-align: center;
}

/* Detailed Answer Section */
.detailed-answer-toggle {
  cursor: pointer;
  color: #3b82f6;
  font-size: 1.1rem;
}

.expanded-answer {
  margin-top: 15px;
}

.expanded-answer table {
  margin-top: 15px;
  border-collapse: collapse;
}

.expanded-answer th, .expanded-answer td {
  padding: 10px;
}

.expanded-answer th {
  background-color: #EFEFEF;
}

.expanded-answer td {
  background-color: #FFFFFF;
  border-bottom: 1px solid #ddd;
}

.end-text {
  align-items: end;
  text-align: end;
}

.end-text strong {
  text-align: end;
  margin: 0;
}

.end-text p {
  text-align: end;
  margin: 0; /* Remove margin from the paragraph */
}

/* Centering the text in the td element */
.centered-text {
  align-items: center;
  text-align: center; /* Center the text horizontally */
}

.centered-text strong {
  text-align: center;
  margin: 0;
}

.centered-text p {
  text-align: center;
  margin: 0; /* Remove margin from the paragraph */
}

/* Team Answer Comparison */
.team-answer-comparison {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.team-answer-box div {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
}

.correct {
  background-color: #B3E3D3;
  border-color: #003F9180; /* Green for correct answers */
  color: white;
}

.incorrect {
  background-color: #FF6B6B99; /* Red for incorrect answers */
  border-color: #003F9180;
  color: white;
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
</style>
