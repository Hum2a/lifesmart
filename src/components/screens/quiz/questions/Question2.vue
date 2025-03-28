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
        <div class="points-section">
          <h3>Challenge 2</h3>
          <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt">
          <p class="points">3 points</p>
        </div>
        <div class="button-container">
          <button class="hint-button" @click="showHintModal = true">Hint?</button>
        </div>
      </div>
      <p>
        Ben earns £60,000 a year. 
        <span 
          class="clickable-term" 
          @mouseover="(event) => showHoverModal('Income Tax', 'A portion of the money that people earn from their jobs or other places, which they need to give to the government. This money helps pay for things like schools, roads, and hospitals.', event)" 
          @mouseleave="hideHoverModal">
          <strong>Income Tax</strong>
        </span>
        automatically comes out of his paycheck before he gets the money.
      </p>
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
        <p>The first £10,000 Ben earns doesn't get taxed at all. The next money he makes from £10,000 - £40,000 (which is £30,000) gets taxed at 20%. The remaining money he makes after £40,000 gets taxed at 40%.</p>
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
            <th>
              <span 
                class="clickable-term" 
                @mouseover="(event) => showHoverModal('Tax Rate', 'This tells you how much income tax you need to pay. It’s like a rule that says how much money you give to the government based on how much money you make.', event)" 
                @mouseleave="hideHoverModal">
                <strong>Tax Rate</strong>
              </span>
            </th>
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

    <!-- Hover Modal -->
    <div v-if="hoverModal.show" class="hover-modal" :style="{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }">
      <h3>{{ hoverModal.title }}</h3>
      <p>{{ hoverModal.content }}</p>
    </div>

    <!-- Conditionally display answer options or result section -->
    <div v-if="!showResults">
      <!-- Question and Points Section -->
      <div class="question-section">
        <p>How much money does he get in his account after tax?</p>
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
      timerStarted: false,
      glossaryTitle: '',
      glossaryContent: '',
      hoverModal: {
        show: false,
        title: "",
        content: "",
        x: 0,
        y: 0,
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
    showHoverModal(title, content, event) {
      console.log("Showing modal with:", { title, content, event });
      if (!event) {
        console.error("Event is missing for hover modal.");
        return;
      }
      this.hoverModal.show = true;
      this.hoverModal.title = title;
      this.hoverModal.content = content;
      this.hoverModal.x = event.clientX + 15;
      this.hoverModal.y = event.clientY + 15;
    },
    hideHoverModal() {
      this.hoverModal.show = false;
    },
    openGlossary(term) {
      this.showGlossary = true;

      if (term === 'incomeTax') {
        this.glossaryTitle = 'Income Tax';
        this.glossaryContent = 'A portion of the money that people earn from their jobs or other places, which they need to give to the government. This money helps pay for things like schools, roads, and hospitals.';
      } else if (term === 'taxRate') {
        this.glossaryTitle = 'Tax Rate';
        this.glossaryContent = 'This tells you how much income tax you need to pay. It’s like a rule that says how much money you give to the government based on how much money you make.';
      }
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
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
}

.clickable-term {
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
}

.clickable-term:hover {
  color: #2563eb;
}

/* Hover Modal */
.hover-modal {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 15px;
  z-index: 1000;
  width: 300px;
}

.hover-modal h3 {
  font-size: 1.4rem;
  margin-bottom: 5px;
  color: #003f91;
}

.hover-modal p {
  font-size: 1.2rem;
  color: #333;
}

.task-header h3 {
  font-size: 1.8rem;
  color: #000;
  flex-grow: 1;
  text-align: start;
}

.task-header p {
  color: #555;
  font-size: 1.3rem;
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
  font-size: 1.1rem;
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
  font-size: 1.9rem;
  margin-bottom: 10px;
  color: black;
}

.hint-modal p {
  font-size: 1.6rem;
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

/* Glossary Styles (Consolidated) */
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
}

.glossary-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.glossary-header h2 {
  font-size: 1.8rem;
  color: #003F91;
}

.glossary-header .close-button {
  background-color: transparent;
  border: none;
  font-size: 1.9rem;
  cursor: pointer;
  color: #003F91;
}

.glossary-content p {
  font-size: 1.6rem;
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
  font-size: 1.6rem;
  font-weight: bold;
}

.points-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.points {
  font-size: 1.3rem;
  color: #3b82f6;
  font-weight: bold;
}

.lightning-bolt {
  width: 40px;
  height: 40px
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
  font-size: 1.4rem;
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
  font-size: 1.3rem;
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

/* Detailed Answer Section */
.detailed-answer-toggle {
  cursor: pointer;
  color: #3b82f6;
  font-size: 1.4rem;
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
  font-size: 1.6rem;
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
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 20px;
}

.submit-button:hover,
.next-button:hover {
  background-color: #2563eb;
}
</style>
