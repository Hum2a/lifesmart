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
      <h3>Task 4</h3>
      <p>Ben decides to use £500 a month of his savings and invest in a stocks fund portfolio. He chooses the ‘S&P500 Fund’ because it is predicted to return 8%.</p>
    </div>

    <!-- Question and Points Section -->
    <div class="question-section">
      <p class="question-text">If he continues to put in £500 a month and the fund has a return of 8% annually, approximately how much money will he have after 10 years?</p>
      <p class="points">⚡ 2 points</p>
    </div>

    <!-- Multiple Choice Options -->
    <div class="choices-container" v-if="!showResults">
      <button class="choice-button" @click="selectAnswer('A')">A. £25,000</button>
      <button class="choice-button" @click="selectAnswer('B')">B. £40,000</button>
      <button class="choice-button" @click="selectAnswer('C')">C. £55,000</button>
      <button class="choice-button" @click="selectAnswer('D')">D. £90,000</button>
      <button class="choice-button" @click="selectAnswer('E')">E. £120,000</button>
    </div>


    <!-- Team Answer or Result Section -->
    <div class="team-answer-section" v-if="!showResults">
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
      <button class="submit-button" @click="submitAnswers">Submit</button>
    </div>

    <!-- Correct Answer and Results Section -->
    <div v-if="showResults" class="result-section">
      <h4>Correct Answer:</h4>
      <p class="correct-answer">£90,000</p>
      <p @click="toggleDetailedAnswer" style="cursor: pointer; color: blue;">
        {{ detailedAnswerShown ? 'Hide detailed answer ⬆' : 'See detailed answer ⬇' }}
      </p>

      <!-- Detailed Answer with Calculator Widget -->
      <div v-if="detailedAnswerShown">
        <investment-calculator />
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
      <button class="next-question-button" @click="nextQuestion">Next</button>
    </div>

  </div>
</template>

<script>
import InvestmentCalculator from '../../../widgets/InvestmentCalculator.vue';

export default {
  name: 'QuestionNo4',
  components: { InvestmentCalculator },
  props: {
    teams: {
      type: Array,
      required: true // The teams will be passed from FinancialQuiz.vue
    }
  },
  data() {
    return {
      correctAnswer: 'D', // Correct answer for this question
      teamAnswers: Array(this.teams.length).fill(''), // Initialize with empty answers for each team
      showResults: false, // Controls when to show results and hide questions
      detailedAnswerShown: false, // Controls the visibility of the detailed answer
      timer: 240, // Timer starts at 4 minutes
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
      return (this.timer / 240) * 100; // Calculate progress bar width based on time remaining
    }
  },
  methods: {
    selectAnswer(answer) {
      this.selectedAnswer = answer;
    },
    submitAnswers() {
      this.showResults = true; // Set the showResults flag to true to reveal the correct answer and the comparison of each team's answer
      clearInterval(this.intervalId); // Clear the timer after submission
    },
    nextQuestion() {
      const pointsArray = this.teamAnswers.map(answer => (answer === this.correctAnswer ? 3 : 0));
      this.$emit('award-points', pointsArray); // Emit points to parent
      this.$emit('next-question'); // Emit event to parent to move to the next question
    },
    toggleDetailedAnswer() {
      this.detailedAnswerShown = !this.detailedAnswerShown;
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

/* Question Section */
.question-section {
  text-align: center;
  margin-top: 20px;
}

.question-section p {
  font-size: 1.2rem;
  font-weight: bold;
}

.question-text {
  color: black;
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
