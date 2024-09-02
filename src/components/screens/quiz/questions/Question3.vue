<template>
  <div class="question-container">
    <div class="question-header">
      <h2 class="animated-header">Investment Decision</h2>
    </div>

    <div class="question-content animated-section">
      <p>Ben inherits a £20,000 gift from an old uncle. He has several options on what to do with the money:</p>

      <div class="assets-liabilities">
        <div class="card assets-card">
          <h3 class="card-title">Assets</h3>
          <p>🏠 House - £200,000</p>
          <p>🚗 Car - £50,000</p>
          <p>💵 Cash - £20,000</p>
        </div>
        <div class="card liabilities-card">
          <h3 class="card-title">Liabilities</h3>
          <p>🏠 Mortgage (6%) - £150,000</p>
          <p>🚗 Car Loan (10%) - £20,000</p>
        </div>
      </div>

      <ul class="options-list animated-options">
        <li>💼 Pay off some of his mortgage (house loan)</li>
        <li>🚗 Pay off his car loan</li>
        <li>📚 Spend the money on a training and self development course and take a holiday from work to have a break</li>
        <li>🪙 Invest in a new cryptocurrency coin his friend has just bought (Skibidicoin)</li>
        <li>🏦 Put the money in a savings account (paying 3% interest)</li>
      </ul>

      <p class="question">WHAT SHOULD HE DO WITH THE MONEY? <span class="points">10 Points</span></p>

      <!-- Display the timer -->
      <div class="timer">
        Time Remaining: {{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}
      </div>
    </div>

    <transition name="fade">
      <div v-if="showResults" class="results-container animated-results">
        <p class="correct-answer">Each answer has a different point value:</p>
        <div class="teams-container">
          <div
            v-for="(team, index) in teams"
            :key="index"
            class="team-result-box"
            :class="{ correct: teamAnswers[index] === correctAnswer, incorrect: teamAnswers[index] !== correctAnswer }"
          >
            <p>{{ team }}</p>
            <p>{{ getPoints(teamAnswers[index]) }} Points</p>
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
  name: 'QuestionNo3',
  props: {
    teams: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      teamAnswers: Array(this.teams.length).fill(''), // Initialize with empty answers
      showResults: false, // To control the display of results
      pointsMapping: { 'A': 7, 'B': 10, 'C': 8, 'D': 6, 'E': 4 }, // Points for each answer
      timer: 480, // 8 minutes in seconds
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
      const pointsArray = this.teamAnswers.map(answer => this.getPoints(answer));
      this.$emit('award-points', pointsArray); // Emit points to parent
      this.$emit('next-question'); // Emit event to parent to move to the next question
    },
    getPoints(answer) {
      return this.pointsMapping[answer] || 0; // Get points for the answer or 0 if no answer
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

.assets-liabilities {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  animation: fadeIn 1.2s ease-in;
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

.options-list {
  text-align: left;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #34495e;
  border-radius: 8px;
  animation: slideIn 1s ease-out;
}

.animated-options li {
  padding: 5px 0;
  color: #ecf0f1;
}

.question {
  color: red;
  font-weight: bold;
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

.points {
  font-weight: normal;
  color: black;
}

.answers {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  animation: fadeInUp 1.5s ease-in;
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

.results-container {
  margin-top: 20px;
  animation: fadeInUp 1.2s ease-in;
}

.correct-answer {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #00e676;
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
