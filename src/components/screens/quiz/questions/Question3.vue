<template>
  <div class="question-container">
    <!-- Header and Progress Bar -->
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressBarWidth + '%' }"></div>
      </div>
      <div class="timer">{{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}</div>
    </div>

    <!-- Task Description -->
    <div class="task-header">
      <h3>Task 3</h3>
      <div class="task-header-question">
        <p>Ben inherits a £20,000 gift from an old uncle. He has several options on what to do with the money.</p>
        <img src="../../../../assets/bluecash.png" alt="Task 3 Image" class="task-image">
      </div>
    </div>

    <!-- Assets and Liabilities Section -->
    <div class="assets-liabilities-wrapper">
      <div class="assets-liabilities">
        <div class="card">
          <h4>Assets</h4>
          <ul>
            <li>
              <span class="asset-icon">🏠 House</span>
              <span class="asset-value">£200,000</span>
            </li>
            <li>
              <span class="asset-icon">🚗 Car</span>
              <span class="asset-value">£50,000</span>
            </li>
            <li>
              <span class="asset-icon">💵 Cash</span>
              <span class="asset-value">£20,000</span>
            </li>
          </ul>
        </div>
        <div class="card">
          <h4>Liabilities</h4>
          <ul>
            <li>
              <span class="asset-icon">🏠 Mortgage (6%)</span>
              <span class="asset-value">£150,000</span>
            </li>
            <li>
              <span class="asset-icon">🚗 Car Loan (10%)</span>
              <span class="asset-value">£20,000</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Conditionally display answer options or result section -->
    <div v-if="!showResults">
      <!-- Question and Points Section -->
      <div class="question-section">
        <p>What should he do with the money?</p>
        <div class="points-section">
          <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt">
          <p class="points">10 points</p>
        </div>
      </div>

      <!-- Options List Before Submission -->
      <div class="options-list-before">
        <ol>
          <li>A. Pay off some of his mortgage (house loan)</li>
          <li>B. Pay off his car loan</li>
          <li>C. Spend the money on a training and self-development course</li>
          <li>D. Invest in a new cryptocurrency coin his friend has just bought (Skibidicoin)</li>
          <li>E. Put the money in a savings account (paying 3% interest)</li>
        </ol>
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

    <!-- Results Section -->
    <div v-else class="result-section">
      <h4>Points Breakdown:</h4>
      <p class="points-breakdown">Here’s how many points each option scores:</p>

      <!-- Options List After Submission -->
      <div class="options-list-after">
        <ol>
          <li>
            <span class="option-text">A. Pay off some of his mortgage (house loan)</span>
            <span class="points-display">
              <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 7 points
            </span>
          </li>
          <li>
            <span class="option-text">B. Pay off his car loan</span>
            <span class="points-display">
              <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 10 points
            </span>
          </li>
          <li>
            <span class="option-text">C. Spend the money on a training and self-development course</span>
            <span class="points-display">
              <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 8 points
            </span>
          </li>
          <li>
            <span class="option-text">D. Invest in a new cryptocurrency coin his friend has just bought (Skibidicoin)</span>
            <span class="points-display">
              <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 6 points
            </span>
          </li>
          <li>
            <span class="option-text">E. Put the money in a savings account (paying 3% interest)</span>
            <span class="points-display">
              <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 4 points
            </span>
          </li>
        </ol>
      </div>

      <!-- Team Answers with Points -->
      <div class="team-answer-comparison">
        <div v-for="(team, index) in teams" :key="team.name" class="team-answer-box">
          <p>{{ team.name }}</p>
          <div class="points-earned">
            {{ getPoints(teamAnswers[index]) }} points
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <button class="next-question-button" @click="nextQuestion">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionNo3',
  props: {
    teams: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      teamAnswers: Array(this.teams.length).fill(''), // Initialize with empty answers for each team
      showResults: false,
      timer: 480, // Timer starts at 8 minutes
      intervalId: null,
      pointsMapping: {
        A: 7,
        B: 10,
        C: 8,
        D: 6,
        E: 4
      }
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
      return (this.timer / 480) * 100; // Calculate progress bar width based on time remaining
    }
  },
  methods: {
    submitAnswers() {
      this.showResults = true;
      clearInterval(this.intervalId); // Clear the timer after submission
    },
    getPoints(answer) {
      return this.pointsMapping[answer] || 0;
    },
    nextQuestion() {
      const pointsArray = this.teamAnswers.map(answer => this.getPoints(answer));
      this.$emit('award-points', pointsArray); // Emit points to parent
      this.$emit('next-question'); // Emit event to parent to move to the next question
    },
    startTimer() {
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.intervalId); // Stop the timer when time runs out
        }
      }, 1000);
    }
  },
  mounted() {
    this.startTimer(); // Start the timer when the component is mounted
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
  max-width: 700px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
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

.timer {
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
}

/* Task Header */
.task-header {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 20px;
  color: black;
}

.task-header h3 {
  font-size: 1.5rem;
}

.task-header p {
  color: #555;
  font-size: 1rem;
  margin-top: 5px;
  font-weight: bold;
}

.task-header-question {
  display: flex;
  flex-direction: row;
  align-items: center
}

/* Assets and Liabilities Section */
.assets-liabilities-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.task-image {
  width: 200px;
  margin-right: 20px;
}

.assets-liabilities {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.card {
  background-color:#ECECEC;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.card h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #000000B2;
}

.card ul {
  list-style: none;
  padding: 0;
}

.card li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 1rem;
  color: #000000;
}

/* .card li span {
  flex-grow: 1;
} */

.asset-icon {
  margin-right: 10px;
}

.asset-name {
  flex-grow: 1; /* Ensures the name takes up the remaining space */
}

.asset-value {
  margin-left: 20px;
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

/* Before Submission: Options List */
.options-list-before {
  margin-top: 20px;
  padding: 0;
}

.options-list-before ol {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.options-list-before li {
  background-color: #B8CEF0;
  padding: 15px;
  border-radius: 15px;
  font-size: 1.1rem;
  color: black;
  font-weight: bold;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
}

.options-list-before li:hover {
  background-color: #9bb6d9;
}

/* After Submission: Options List with Points */
.options-list-after {
  margin-top: 20px;
  padding: 0;
}

.options-list-after ol {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.options-list-after li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
/* 
.options-list-after li:hover {
  background-color: #9bb6d9;
} */

.option-text {
  flex: 1;
  margin-right: 20px; /* Creates space between the text and the points */
  background-color: #B8CEF0;
  padding: 15px;
  border-radius: 15px;
  font-size: 1.1rem;
  color: black;
  font-weight: bold;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.options-text:hover {
  background-color: #9bb6d9;
}

.points-display {
  display: flex;
  align-items: center;
  background-color: white;
  color: #003F91;
  padding: 5px 10px;
  border-radius: 15px;
}

.points-display .lightning-bolt {
  width: 20px;
  margin-right: 5px;
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

.team-answer-box p {
  color: black;
  margin-bottom: 5px;
  font-weight: bold;
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

.points-breakdown {
  font-size: 1rem;
  margin-bottom: 15px;
}

.points-table table {
  width: 100%;
  border-collapse: collapse;
}

.points-table th, .points-table td {
  padding: 10px;
  text-align: left;
}

.points-table th {
  background-color: #f4f4f4;
}

.points-table td {
  border-bottom: 1px solid #ddd;
}

/* Team Answer Comparison */
.team-answer-comparison {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.team-answer-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.points-earned {
  width: 80px;
  height: 50px;
  border-radius: 10px;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
}

/* Submit Button */
.submit-button {
  display: block;
  width: 100%;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: #2563eb;
}

/* Next Button */
.next-question-button {
  background-color: #1abc9c;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  color: #fff;
  cursor: pointer;
  margin-top: 20px;
}

.next-question-button:hover {
  background-color: #16a085;
  transform: scale(1.1);
}
</style>
