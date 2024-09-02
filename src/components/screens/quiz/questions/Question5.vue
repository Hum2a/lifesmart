<template>
  <div class="question-container">
    <div class="question-header">
      <h2 class="animated-header">Credit Rating Improvement Tips</h2>
    </div>

    <div class="question-content animated-section">
      <p>
        Ben decides he wants to get another loan in the future, so he would like to improve his credit rating.
      </p>

      <div class="question animated-question">
        <p>WHICH OF THE FOLLOWING THINGS IMPROVE YOUR CREDIT RATING?</p>
        <span class="points">5 Points</span>
      </div>

      <!-- Display the timer -->
      <div class="timer">
        Time Remaining: {{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}
      </div>

      <!-- Multiple choice answers section -->
      <div class="multiple-choice-container">
        <p class="multiple-choice">
          A. Paying bills and payments on time<br>
          B. Registering on the electoral roll<br>
          C. Frequently applying for new credit<br>
          D. Paying off or maintaining low levels of debt<br>
          E. Keeping a bank account open for many years<br>
          F. Maxing out your credit cards regularly<br>
          G. Avoiding frequent credit applications<br>
          H. Moving house regularly
        </p>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showResults" class="results-container animated-results">
        <p class="correct-answer">The right answers are: <strong>A, B, D, E, G</strong></p>
        <p class="explanation">These actions generally help improve or maintain a good credit rating.</p>
        <div class="teams-container">
          <div v-for="(team, index) in teams" :key="index" class="team-result-box" :class="{ correct: isTeamAnswerCorrect(index), incorrect: !isTeamAnswerCorrect(index) }">
            <p>{{ team }}</p>
          </div>
        </div>
        <button class="next-question-button" @click="nextQuestion">Next Question</button>
      </div>

      <div v-else class="team-answers animated-answers">
        <p class="answer-label">Select Your Answers:</p>
        <div class="teams-container">
          <div v-for="(team, index) in teams" :key="index" class="team-box">
            <p>{{ team }}</p>
            <div class="checkbox-container">
              <label v-for="option in answerOptions" :key="option" class="checkbox-label">
                <input type="checkbox" :value="option" v-model="teamAnswers[index]" class="team-checkbox" />
                {{ option }}
              </label>
            </div>
          </div>
        </div>
        <button class="show-answer-button animated-button" @click="showCorrectAnswer">Show Correct Answer</button>
      </div>
    </transition>
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
      correctAnswer: ['A', 'B', 'D', 'E', 'G'], // Correct answers that improve credit rating
      teamAnswers: Array(this.teams.length).fill([]).map(() => []), // Initialize with empty answers array for each team
      showResults: false, // To control the display of results
      answerOptions: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], // Answer options
      timer: 300, // 5 minutes in seconds
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
      const pointsArray = this.teamAnswers.map(answers => {
        let points = 0;
        answers.forEach(answer => {
          if (this.correctAnswer.includes(answer)) {
            points++;
          }
        });
        return points; // 1 point for each correct answer selected
      });
      this.$emit('award-points', pointsArray); // Emit points to parent
      this.$emit('next-question'); // Emit event to parent to move to the next question
    },
    isTeamAnswerCorrect(index) {
      return this.teamAnswers[index].every(answer => this.correctAnswer.includes(answer)) && this.teamAnswers[index].length === this.correctAnswer.length;
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

.multiple-choice-container {
  margin-top: 20px;
  text-align: left;
  margin-left: 10%;
  animation: fadeIn 1.5s ease-in;
}

.multiple-choice {
  font-size: 1rem;
  color: #ffffff;
  line-height: 1.8;
}

.answers {
  margin-top: 20px;
  text-align: left;
  margin-left: 10%;
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

.checkbox-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.checkbox-label {
  margin-bottom: 5px;
  color: #ffffff;
}

.team-checkbox {
  margin-right: 8px;
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
