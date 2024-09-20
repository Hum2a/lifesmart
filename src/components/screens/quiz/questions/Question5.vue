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
      <div class="top-layer">
        <h3>Task 5</h3>
        <div class="button-container">
          <button class="glossary-button" @click="showGlossary = true">Glossary</button>
          <!-- <button class="hint-button" @click="showHintModal = true">Hint?</button> -->
        </div>
      </div>
      <div>
        <p>Ben decides he wants to get another loan in the future, so he would like to improve his credit rating.</p>
        <img src="../../../../assets/moneyhandshake.png" alt="Task 5 Image" class="task-image">
      </div>
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

    <!-- Question Section -->
    <div class="question-section">
      <p>Which of the following things improve your credit rating?</p>
      <div class="points-section">
        <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt">
        <p class="points">5 points</p>
      </div>
    </div>

    <!-- Conditionally render either the answer options or the results section -->
    <div v-if="!showResults">
      <!-- Answer Options -->
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

    <!-- Results Section -->
    <div v-else class="results-section">
      <!-- Updated answer options with correct/incorrect indicators -->
      <div class="answer-options">
        <div v-for="(option, index) in answerOptions" :key="index" :class="{'correct': correctAnswers.includes(index), 'incorrect': !correctAnswers.includes(index)}" class="answer-option">
          <p>{{ option }}</p>
        </div>
      </div>

      <!-- Team Results -->
      <div class="teams-results">
        <div v-for="(team, index) in teams" :key="index" class="team-result">
          <h4>{{ team.name }}</h4>
          <div v-for="(answer, answerIndex) in teamAnswers[index]" :key="answerIndex" :class="{'correct': correctAnswers.includes(answer), 'incorrect': !correctAnswers.includes(answer)}">
            {{ String.fromCharCode(65 + answer) }}
          </div>
          <p>Points: {{ calculateScore(index) }}</p>
        </div>
      </div>

      <!-- Next Button -->
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
        'A: Paying bills and payments on time',
        'B: Registering on the electoral roll',
        'C: Frequently applying for new credit',
        'D: Paying off or maintaining low levels of debt',
        'E: Keeping a bank account open for many years',
        'F: Maxing out your credit cards regularly',
        'F: Avoiding frequent credit applications',
        'G: Moving house regularly'
      ],
      correctAnswers: [0, 1, 3, 4, 6], // Correct answers: A, B, D, E, G
      teamAnswers: Array.from({ length: this.teams.length }, () => []),
      showResults: false,
      timer: 300,
      intervalId: null,
      showGlossary: false,
      showHintModal: false,
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
          score += 1; // Add 1 point for each correct answer
        }
      });
      return score;
    },
    nextQuestion() {
      const pointsArray = this.teamAnswers.map((answers, index) => this.calculateScore(index));
      this.$emit('award-points', pointsArray); // Emit points to parent
      this.$emit('next-question'); // Move to the next question
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

/* Glossary Sidebar Styling */
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

.glossary-button:hover, .hint-button:hover {
  background-color: #dbe9ff;
}

.hint-button::after {
  content: '?';
  font-size: 1rem;
  margin-left: 5px;
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
  color: #000;
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

.top-layer {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
}

.button-container {
  display: flex;
  gap: 10px;
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
  margin-bottom: 20px;
}

.task-header h3 {
  font-size: 1.5rem;
  color: black;
}

.task-header p {
  color: #555;
  font-size: 1rem;
}

.task-image {
  width: 200px;
  margin-right: 20px;
}

/* Question Section */
.question-section {
  text-align: center;
  margin-top: 20px;
}

.question-section p {
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
}

.points-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
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


/* Answer Options Styling */
.answer-options {
  margin: 20px 0;
}

.answer-option {
  background-color: #B8CEF0;
  color: black;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  text-align: left;
  font-size: 1rem;
}

.correct {
  background-color: #B3E3D3 !important;
}

.incorrect {
  background-color: #FF6B6B99 !important;
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

.teams-results {
  display: flex;
  justify-content: space-around;
  animation: fadeInUp 1s ease-in;
}

.team-result {
  margin-bottom: 10px;
}

.team-result h4 {
  color: black;
}

.team-result p {
  color: black;
}

.score-icon {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
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
/* Animations */
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
