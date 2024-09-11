<template>
  <div class="question-container">
    <div class="question-header">
      <h2 class="animated-header">Ben's Financial Overview</h2>
    </div>

    <div class="question-content">
      <div class="animated-section">
        <div class="info-box">
          <p class="info-text">Ben is a 30 year old engineer with the following assets and liabilities:</p>
        </div>
        
        <div class="assets-liabilities">
          <div class="card assets-card">
            <h3 class="card-title">Assets</h3>
            <ul class="asset-list">
              <li>🏠 House - £200,000</li>
              <li>🚗 Car - £50,000</li>
              <li>💵 Cash - £20,000</li>
            </ul>
          </div>
          <div class="card liabilities-card">
            <h3 class="card-title">Liabilities</h3>
            <ul class="liability-list">
              <li>🏠 Mortgage (6%) - £150,000</li>
              <li>🚗 Car Loan (10%) - £20,000</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="question animated-question">
        <p>WHAT IS HIS NET WORTH?</p>
        <span class="points">3 Points</span>
      </div>

      <!-- Display the timer -->
      <div class="timer">
        Time Remaining: {{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}
      </div>

      <!-- Multiple choice answers section -->
      <div class="multiple-choice-container">
        <p class="multiple-choice">
          A - £20,000&nbsp;&nbsp;&nbsp;&nbsp;
          B - £50,000&nbsp;&nbsp;&nbsp;&nbsp;
          C - £100,000&nbsp;&nbsp;&nbsp;&nbsp;
          D - £270,000&nbsp;&nbsp;&nbsp;&nbsp;
          E - £440,000
        </p>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showResults" class="results-container animated-results">
        <p class="correct-answer">The right answer is: <strong>£100,000</strong></p>
        <p class="explanation">Net worth is assets – liabilities</p>
        <div class="teams-container">
          <div
            v-for="(team, index) in teams"
            :key="index"
            class="team-result-box"
            :class="{ correct: teamAnswers[index] === correctAnswer, incorrect: teamAnswers[index] !== correctAnswer }"
          >
            <p>{{ team }}</p>
          </div>
        </div>
        <button class="next-question-button" @click="nextQuestion">Next Question</button>
      </div>

      <div v-else class="team-answers animated-answers">
        <p class="answer-label">Select Your Answer:</p>
        <div class="teams-container">
          <div v-for="(team, index) in teams" :key="index" class="team-box">
            <p>{{ team }}</p>
            <select v-model="teamAnswers[index]" class="team-select">
              <option value="" disabled>Select Answer</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>
        </div>
        <button class="show-answer-button animated-button" @click="showCorrectAnswer">Show Correct Answer</button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'QuestionNo1',
  props: {
    teams: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      correctAnswer: 'C',
      teamAnswers: Array(this.teams.length).fill(''), // Initialize with empty answers
      showResults: false, // To control the display of results
      timer: 180, // 5 minutes in seconds
      intervalId: null, // To store the interval ID for the timer
    };
  },
  computed: {
    minutes() {
      return Math.floor(this.timer / 60);
    },
    seconds() {
      return this.timer % 60;
    }
  },
  methods: {
    showCorrectAnswer() {
      this.showResults = true;
      clearInterval(this.intervalId); // Stop the timer
    },
    nextQuestion() {
      // Award 3 points if the answer is correct, otherwise 0 points
      const pointsArray = this.teamAnswers.map(answer => (answer === this.correctAnswer ? 3 : 0));
      this.$emit('award-points', pointsArray); // Emit points to parent
      this.$emit('next-question'); // Emit event to parent to move to the next question
    },
    startTimer() {
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.showCorrectAnswer(); // Show the correct answer when time is up
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
/* Styles remain unchanged */
.question-container {
  text-align: center;
  padding: 30px;
  background-color: #1e1e2f; /* Darker background */
  color: #ffffff; /* White text for better contrast */
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px; /* Max width for better responsiveness */
  margin: 20px auto; /* Centered and spaced */
  animation: slideIn 1s ease-out;
}

.timer {
  font-size: 1.2rem;
  color: #ffcc00;
  margin: 20px 0;
  animation: pulse 1.5s infinite;
}

@keyframes slideIn {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.question-header {
  margin-bottom: 20px;
}

.animated-header {
  font-size: 2rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animated-section {
  animation: fadeIn 1.2s ease-in;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.info-box {
  background-color: #2e2e48;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.info-text {
  color: #d1c4e9;
}

.assets-liabilities {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.card {
  background-color: #2c3e50;
  border-radius: 8px;
  padding: 15px;
  color: #ecf0f1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 45%;
}

.card-title {
  margin-bottom: 10px;
  font-size: 1.2rem;
  text-align: center;
}

.asset-list, .liability-list {
  list-style: none;
  padding: 0;
}

.asset-list li, .liability-list li {
  padding: 5px 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.animated-question {
  animation: bounceIn 1.5s;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.multiple-choice-container {
  margin-top: 20px;
  text-align: center;
}

.multiple-choice {
  font-size: 1rem;
  color: #ffffff;
  display: flex;
  justify-content: center;
  gap: 40px;
  animation: fadeIn 1.5s ease-in;
}

.results-container {
  animation: fadeInUp 1.2s ease-in;
  margin-top: 20px;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.correct-answer {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #00e676; /* Green for correct */
  animation: pulse 2s infinite;
}

.explanation {
  font-size: 1rem;
  color: #d1c4e9;
}

.team-answers {
  margin-top: 40px;
  animation: fadeIn 1.5s ease-in;
}

.answer-label {
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 20px;
}

.teams-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.team-box, .team-result-box {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  min-width: 60px;
  background-color: #34495e;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.team-select {
  width: 80px;
  padding: 8px;
  text-align: center;
  border: 2px solid #34495e;
  border-radius: 4px;
  background-color: #ffffff;
  color: #000000;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.team-select:hover {
  background-color: #2980b9;
  color: #ffffff;
}

.animated-button {
  background-color: #e74c3c;
  margin-top: 30px;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.animated-button:hover {
  background-color: #c0392b;
  transform: scale(1.1);
}

.next-question-button {
  margin-top: 30px;
  background-color: #1abc9c;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.next-question-button:hover {
  background-color: #16a085;
  transform: scale(1.1);
}

.correct {
  background-color: #2ecc71; /* Green */
  color: white;
}

.incorrect {
  background-color: #e74c3c; /* Red */
  color: white;
}
</style>
