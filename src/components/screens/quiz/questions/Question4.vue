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
        <div class="points-section">
          <h3>Challenge 4</h3>
          <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt">
          <p class="points">2 points</p>
        </div>
        <div class="button-container">
          <!-- <button class="hint-button" @click="showHintModal = true">Hint?</button> -->
        </div>
      </div>
      <div class="task-header-question">
        <p>
          Ben decides to use £500 a month of his savings and invest in a
          <span class="clickable-term"
                @mouseover="(event) => showHoverModal('Stocks Fund Portfolio', 'A basket of different companies that are all put together. When you buy a part of the basket, you own a small piece of all the companies in it. This helps spread the risk because if one company doesn’t do well, others in the basket might still grow!', event)"
                @mouseleave="hideHoverModal">
            <strong>stocks fund portfolio</strong>
          </span>.
          He chooses the ‘
          <span class="clickable-term"
                @mouseover="(event) => showHoverModal('S&P 500', 'A list of the 500 biggest and most important companies in America. If you invest in the S&P 500, you’re buying a little piece of each of those 500 companies.', event)"
                @mouseleave="hideHoverModal">
            <strong>S&P500 Fund</strong>
          </span>’ because it is predicted to return 8%.
        </p>
        <img src="../../../../assets/moneybars.png" alt="Task 4 Image" class="task-image">
      </div>
    </div>

     <!-- Glossary Sidebar -->
     <div v-if="showGlossary" class="glossary-sidebar">
      <div class="glossary-header">
        <h2>{{ glossaryTitle }}</h2>
        <button class="close-button" @click="showGlossary = false">X</button>
      </div>
      <div class="glossary-content">
        <p>{{ glossaryContent }}</p>
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

    <!-- Question and Points Section -->
    <div class="question-section">
      <p class="question-text">
        If he continues to put in £500 a month and the fund has a return of 8%
        <span class="clickable-term"
              @mouseover="(event) => showHoverModal('Annually', 'The return rate is calculated based on a yearly period. For example, an 8% annual return means an 8% increase over one year.', event)"
              @mouseleave="hideHoverModal">
          <strong>annually</strong>
        </span>, approximately how much money will he have after 10 years?
      </p>
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
      <p @click="toggleDetailedAnswer" class="toggle-detailed-answer">
        Click to {{ detailedAnswerShown ? 'hide detailed answer ⬆' : 'see detailed answer ⬇' }}
      </p>

      <!-- Detailed Answer with Calculator Widget -->
      <div v-if="detailedAnswerShown">
        <investment-calculator />
        <!-- <button @click="toggleCalculator" class="ic-link"> Link to Investment Calculator</button> -->
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

    <div v-if="hoverModal.show" 
        class="hover-modal" 
        :style="{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }">
      <h3>{{ hoverModal.title }}</h3>
      <p>{{ hoverModal.content }}</p>
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
      intervalId: null,
      timerStarted: false, // Timer is initially not started
      showGlossary: false,
      glossaryTitle: '',
      glossaryContent: '',
      showHintModal: false,
      hoverModal: {
        show: false,
        title: '',
        content: '',
        x: 0,
        y: 0
      },
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
    openGlossary(term) {
      this.showGlossary = true;

      if (term === 'stocksFundPortfolio') {
        this.glossaryTitle = 'Stocks Fund Portfolio';
        this.glossaryContent = 'A basket of different companies that are all put together. When you buy a part of the basket, you own a small piece of all the companies in it. This helps spread the risk because if one company doesn\'t do well, others in the basket might still grow!';
      } else if (term === 'sAndP500') {
        this.glossaryTitle = 'S&P 500';
        this.glossaryContent = 'A list of the 500 biggest and most important companies in America. If you invest in the S&P 500, you’re buying a little piece of each of those 500 companies.';
      } else if (term === 'annually') {
        this.glossaryTitle = 'Annually';
        this.glossaryContent = 'The return rate is calculated based on a yearly period. For example, an 8% annual return means an 8% increase over one year.';
      }
    },
    selectAnswer(answer) {
      this.selectedAnswer = answer;
    },
    showHoverModal(title, content, event) {
      this.hoverModal.show = true;
      this.hoverModal.title = title;
      this.hoverModal.content = content;
      this.hoverModal.x = event.clientX + 15; // Offset for better positioning
      this.hoverModal.y = event.clientY + 15;
    },
    hideHoverModal() {
      this.hoverModal.show = false;
      this.hoverModal.title = '';
      this.hoverModal.content = '';
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
    },
    toggleCalculator() {
      this.router.push({ name: 'InvestmentCalculator' });
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
  max-width: 1000px;
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

.glossary-content p {
  font-size: 1rem;
  color: #555;
  margin-top: 5px;
  line-height: 1.5;
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
  border: 2px solid #45a04933; /* Define the border with width, style, and color */
  border-radius: 10px;
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
  color: black;
}

.task-header h3 {
  font-size: 2rem;
}

.task-header p {
  color: #555;
  font-size: 1.3rem;
  margin-top: 5px;
  font-weight: bold;
}

.task-header-question {
  display: flex;
  flex-direction: row;
  align-items: center
}

.task-image {
  width: 200px;
  margin-right: 20px;
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
.glossary-button, .hint-button {
  background-color: #f0f4ff;
  border: 1px solid #e0e0e0;
  color: #003F91;
  font-weight: bold;
  font-size: 1.1rem;
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


/* Question Section */
.question-section {
  text-align: center;
  margin-top: 20px;
}

.question-section p {
  font-size: 1.6rem;
  font-weight: bold;
}

.question-text {
  color: black;
}

.points-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
}

.points {
  font-size: 1.3rem;
  color: #3b82f6;
  font-weight: bold;
}

.lightning-bolt {
  width: 40px;
  height: 40px;
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
  font-size: 1.3rem;
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
  font-size: 1.4rem;
  text-align: center;
}

/* Result Section */
.result-section {
  text-align: center;
  margin-top: 20px;
}

.correct-answer {
  display: inline-block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #000; /* Green color for correct answer */
  margin: 20px;
  background-color: #B3E3D3;
  border-radius: 50px;
  width: 25%;
  padding: 15px;
  text-align: center;
}

.toggle-detailed-answer {
  color: black;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

.toggle-detailed-answer:hover {
  font-size: 25px;
}

.toggle-detailed-answer::after {
  font-size: 23px;
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
  font-size: 1.5rem;
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
  width: 20%;
  background-color: #003F91;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 30px;
  font-size: 1.4rem;
  cursor: pointer;
  margin-top: 20px;
}

.submit-button:hover,
.next-button:hover {
  background-color: #2563eb;
}

.ic-link {
  color: #003F91CC;
  background-color: transparent;
}

.clickable-term {
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
}

.clickable-term:hover {
  color: #2563eb;
}
.hover-modal {
  position: fixed;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  max-width: 300px;
  z-index: 1000;
  pointer-events: none; /* Prevent blocking other interactions */
  transition: opacity 0.3s ease-in-out;
  font-family: Arial, sans-serif;
}

.hover-modal h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 8px;
}

.hover-modal p {
  font-size: 1.2rem;
  color: #555;
  margin: 0;
}

</style>
