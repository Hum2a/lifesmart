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
      <h3>Task 1</h3>
      <p>Ben is a 30 year old engineer. He has the following assets and liabilities:</p>
    </div>

    <img src="../../../../assets/task1.png" alt="Task 1 Image" class="task-image">

    <!-- Assets and Liabilities Section -->
    <div class="assets-liabilities-wrapper">
      <div class="assets-liabilities">
        <div class="card">
          <h4>Assets</h4>
          <ul>
            <li>🏠 House £200,000</li>
            <li>🚗 Car £50,000</li>
            <li>💵 Cash £20,000</li>
          </ul>
        </div>
        <div class="card">
          <h4>Liabilities</h4>
          <ul>
            <li>🏠 Mortgage £150,000</li>
            <li>🚗 Car Loan £20,000</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Show Correct Answer After Submission -->
    <div v-if="showResults" class="result-section">
      <h4>Correct Answer:</h4>
      <p class="correct-answer">£100,000</p>
      <p>Net worth is assets – liabilities</p>

      <!-- Display each team's answer with comparison -->
      <div class="team-answer-comparison">
        <div v-for="(team, index) in teams" :key="team.name" class="team-answer-box">
          <p>{{ team.name }}</p>
          <div :class="{'correct': teamAnswers[index] === correctAnswer, 'incorrect': teamAnswers[index] !== correctAnswer}">
            {{ teamAnswers[index] || '-' }}
          </div>
        </div>
      </div>

      <!-- Next Button to proceed to the next question -->
      <button class="next-button" @click="nextQuestion">Next</button>
    </div>

    <!-- Multiple Choice and Team Answer Section -->
    <div v-else>
      <!-- Question and Points Section -->
      <div class="question-section">
        <p>What is his net worth?</p>
        <p class="points">⚡ 3 points</p>
      </div>

      <!-- Multiple Choice Options -->
      <div class="choices-container">
        <button class="choice-button">A. £20,000</button>
        <button class="choice-button">B. £50,000</button>
        <button class="choice-button">C. £100,000</button>
        <button class="choice-button">D. £270,000</button>
        <button class="choice-button">E. £440,000</button>
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
  </div>
</template>

<script>
export default {
  name: 'QuestionNo1',
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
      timer: 180, // Timer starts at 180 seconds
      intervalId: null
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
      return (this.timer / 180) * 100; // Calculate progress bar width based on time remaining
    }
  },
  methods: {
    submitAnswers() {
      // Set the showResults flag to true to reveal the correct answer and the comparison of each team's answer
      this.showResults = true;
      clearInterval(this.intervalId); // Clear the timer after submission

      // Emit the award points based on the correct/incorrect answers
      const pointsArray = this.teamAnswers.map(answer => (answer === this.correctAnswer ? 3 : 0));
      this.$emit('award-points', pointsArray);
    },
    nextQuestion() {
      // Emit the next-question event to FinancialQuiz.vue to proceed to the next question
      this.$emit('next-question');
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

.timer {
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
}

/* Task Header */
.task-header {
  text-align: left;
  margin-top: 20px;
}

.task-header h3 {
  font-size: 1.5rem;
}

.task-header p {
  color: #555;
  font-size: 1rem;
  margin-top: 5px;
}

/* Assets and Liabilities Section */
.assets-liabilities-wrapper {
  margin-top: 20px;
  display: flex;
  align-items: center;
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
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 180px;
}

.card h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.card ul {
  list-style: none;
  padding: 0;
}

.card li {
  margin-bottom: 8px;
  font-size: 1rem;
  color: #333;
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

.points {
  font-size: 1rem;
  color: #3b82f6;
}

/* Multiple Choice Section */
.choices-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.choice-button {
  background-color: #e0f2ff;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  color: #1e3a8a;
  cursor: pointer;
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
  font-size: 1.5rem;
  font-weight: bold;
  color: #10b981; /* Green color for correct answer */
  margin-bottom: 5px;
}

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
  background-color: #10b981; /* Green for correct answers */
  color: white;
}

.incorrect {
  background-color: #ef4444; /* Red for incorrect answers */
  color: white;
}

/* Submit and Next Button */
.submit-button,
.next-button {
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

.submit-button:hover,
.next-button:hover {
  background-color: #2563eb;
}
</style>
