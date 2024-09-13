<template>
  <div class="question-container">
    <!-- Progress Bar and Timer -->
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressBarWidth + '%' }"></div>
      </div>
      <div class="timer">{{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}</div>
    </div>

    <!-- Conditionally render either the question section or the results section -->
    <div v-if="!showResults">
      <!-- Task Description -->
      <div class="task-header">
        <h3>Task 5</h3>
        <p>Ben decides he wants to get another loan in the future, so he would like to improve his credit rating.</p>
      </div>

      <!-- Question Section -->
      <div class="question-section">
        <p>Which of the following things improve your credit rating?</p>
        <p class="points">⚡ 10 points</p>
      </div>

      <!-- Answer Options (Displayed Once) -->
      <div class="answer-options">
        <div v-for="(option, index) in answerOptions" :key="index" class="answer-option">
          <p>{{ option }}</p>
        </div>
      </div>

      <!-- Teams Answer Selection -->
      <div class="teams-selection">
        <div v-for="(team, teamIndex) in teams" :key="teamIndex" class="team-selection">
          <h4>{{ team.name }}</h4>
          <div class="team-options">
            <button 
              v-for="(option, index) in answerOptions" 
              :key="index" 
              :class="{'selected': teamAnswers[teamIndex].includes(index)}" 
              @click="toggleTeamAnswer(teamIndex, index)">
              {{ String.fromCharCode(65 + index) }} <!-- A, B, C, D, ... -->
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button class="submit-button" @click="submitAnswers">Submit</button>
    </div>

    <!-- Results Section with Extravagant Design -->
    <div v-else class="results-section">
      <div class="answer-header">
        <h4>Correct Answers 🎉</h4>
        <p class="correct-answer">A, B, D, E, G</p>
      </div>

      <div class="teams-results">
        <div v-for="(team, index) in teams" :key="index" class="team-result">
          <p>{{ team.name }}</p>
          <div :class="{ correct: calculateScore(index) > 0, incorrect: calculateScore(index) === 0 }">
            <div class="score-icon" v-if="calculateScore(index) > 0">✅</div>
            <div class="score-icon" v-else>❌</div>
            <p class="score">{{ calculateScore(index) }} points</p>
          </div>
        </div>
      </div>

      <button class="next-button" @click="nextQuestion">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionNo5',
  props: {
    teams: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      answerOptions: [
        'Paying bills and payments on time',
        'Registering on the electoral roll',
        'Frequently applying for new credit',
        'Paying off or maintaining low levels of debt',
        'Keeping a bank account open for many years',
        'Maxing out your credit cards regularly',
        'Avoiding frequent credit applications',
        'Moving house regularly'
      ],
      correctAnswers: [0, 1, 3, 4, 6], // Corresponds to A, B, D, E, G
      teamAnswers: Array.from({ length: this.teams.length }, () => []), // Array for each team's answers
      showResults: false,
      timer: 300,
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
      return (this.timer / 300) * 100;
    }
  },
  methods: {
    toggleTeamAnswer(teamIndex, optionIndex) {
      const answers = this.teamAnswers[teamIndex];
      const answerPosition = answers.indexOf(optionIndex);

      if (answerPosition === -1) {
        this.teamAnswers[teamIndex].push(optionIndex);
      } else {
        this.teamAnswers[teamIndex].splice(answerPosition, 1);
      }
    },
    
    submitAnswers() {
      this.showResults = true;
      clearInterval(this.intervalId);
    },

    calculateScore(index) {
      const answers = this.teamAnswers[index] || [];
      let score = 0;
      answers.forEach((answer) => {
        if (this.correctAnswers.includes(answer)) {
          score += 1; // Add 1 point for correct answers
        }
      });
      return score;
    },

    nextQuestion() {
      const pointsArray = this.teamAnswers.map((answers, index) => this.calculateScore(index));
      this.$emit('award-points', pointsArray); // Emit the points to the parent
      this.$emit('next-question'); // Move to the next question
    },

    startTimer() {
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.submitAnswers();
        }
      }, 1000);
    }
  },
  
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  }
};
</script>

<style scoped>
/* General Container */
.question-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.5s ease;
}

/* Progress Bar */
.progress-bar-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.progress-bar {
  width: 80%;
  height: 5px;
  background-color: #e0e0e0;
  border-radius: 5px;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
}

.timer {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffcc00;
}

/* Task Header */
.task-header {
  margin-bottom: 20px;
}

.task-header h3 {
  font-size: 1.5rem;
}

.task-header p {
  color: #555;
  font-size: 1rem;
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
  color: #4caf50;
}

/* Answer Options Styling */
.answer-options {
  margin: 20px 0;
}

.answer-option {
  background-color: #e0f7fa;
  color: black;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  text-align: left;
  font-size: 1rem;
}

/* Teams Answer Selection */
.teams-selection {
  margin-top: 20px;
}

.team-selection {
  margin-bottom: 20px;
}

.team-selection h4 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.team-options {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.team-options button {
  padding: 10px 15px;
  border-radius: 50%;
  border: none;
  background-color: #e0e0e0;
  font-size: 1.2rem;
  cursor: pointer;
}

.team-options button.selected {
  background-color: #007bff;
  color: white;
}

.team-options button:hover {
  background-color: #0056b3;
  color: white;
}

/* Results Section */
.results-section {
  margin-top: 20px;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 1s ease-out;
}

.answer-header {
  background-color: #4caf50;
  color: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  animation: bounceIn 1.5s;
}

.correct-answer {
  font-size: 1.5rem;
  color: #ffd700;
  font-weight: bold;
}

.teams-results {
  display: flex;
  justify-content: space-around;
  animation: fadeInUp 1s ease-in;
}

.team-result {
  margin-bottom: 10px;
}

.correct {
  color: #4caf50;
}

.incorrect {
  color: #f44336;
}

.score-icon {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Submit and Next Buttons */
.submit-button, .next-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 20px;
}

.submit-button:hover, .next-button:hover {
  background-color: #0056b3;
}

/* Animations */
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
</style>
