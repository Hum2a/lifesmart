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
        <h3>Task 3</h3>
        <div class="button-container">
          <!-- <button class="hint-button" @click="showHintModal = true">Hint?</button> -->
        </div>
      </div>
      <div class="task-header-question">
        <p>Ben inherits a £20,000 gift from an old uncle. He has several options on what to do with the money.</p>
        <img src="../../../../assets/bluecash.png" alt="Task 3 Image" class="task-image">
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
              <span class="asset-icon">🏠 <span class="clickable-term" @click="openGlossary('mortgage')"><strong>Mortgage</strong></span> (6%)</span>
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
          <li>A. Pay off some of his <span class="clickable-term" @click="openGlossary('mortgage')"><strong>Mortgage</strong></span> (house loan)</li>
          <li>B. Pay off his car loan</li>
          <li>C. Spend the money on a training and self-development course</li>
          <li>D. Invest in a new <span class="clickable-term" @click="openGlossary('cryptocurrency')"><strong>cryptocurrency</strong></span> coin his friend has just bought (Skibidicoin)</li>
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
          <li @click="toggleDetails('A')">
            <div class="top">
              <span class="option-text">A. Pay off some of his <span class="clickable-term" @click="openGlossary('mortgage')"><strong>Mortgage</strong></span> (house loan)</span>
              <span class="points-display">
                <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 7 points
              </span>
            </div>
            <div v-if="detailsVisible.A" class="details-content">
              <table>
                <thead>
                  <tr>
                    <th>Assets</th>
                    <th>Liabilities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>House £200,000</td>
                    <td><span class="clickable-term" @click="openGlossary('mortgage')"><strong>Mortgage</strong></span> £150,000</td>
                  </tr>
                  <tr>
                    <td>Car £50,000</td>
                    <td>Car Loan £20,000</td>
                  </tr>
                  <tr>
                    <td>Cash £28,000</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><strong>Total: £278,000</strong></td>
                    <td><strong>Total: £170,000</strong></td>
                  </tr>
                  <tr>
                    <td colspan="2"><strong>Net Worth = £128,000</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>

          <li @click="toggleDetails('B')">
            <div class="top">
              <span class="option-text">B. Pay off his car loan</span>
              <span class="points-display">
                <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 10 points
              </span>
            </div>
            <div v-if="detailsVisible.B" class="details-content">
              <table>
                <thead>
                  <tr>
                    <th>Assets</th>
                    <th>Liabilities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>House £200,000</td>
                    <td><span class="clickable-term" @click="openGlossary('mortgage')"><strong>Mortgage</strong></span> £150,000</td>
                  </tr>
                  <tr>
                    <td>Car £50,000</td>
                    <td>Car Loan £0</td>
                  </tr>
                  <tr>
                    <td>Cash £35,000</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><strong>Total: £285,000</strong></td>
                    <td><strong>Total: £150,000</strong></td>
                  </tr>
                  <tr>
                    <td colspan="2"><strong>Net Worth = £135,000</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>

          <li @click="toggleDetails('C')">
            <div class="top">
              <span class="option-text">C. Spend the money on a training and self-development course</span>
              <span class="points-display">
                <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 8 points
              </span>
            </div>
            <div v-if="detailsVisible.C" class="details-content">
              <table>
                <thead>
                  <tr>
                    <th>Assets</th>
                    <th>Liabilities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>House £200,000</td>
                    <td><span class="clickable-term" @click="openGlossary('mortgage')"><strong>Mortgage</strong></span> £150,000</td>
                  </tr>
                  <tr>
                    <td>Car £50,000</td>
                    <td>Car Loan £20,000</td>
                  </tr>
                  <tr>
                    <td>Cash £50,000</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><strong>Total: £300,000</strong></td>
                    <td><strong>Total: £170,000</strong></td>
                  </tr>
                  <tr>
                    <td colspan="2"><strong>Net Worth = £130,000</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>

          <li @click="toggleDetails('D')">
            <div class="top">
              <span class="option-text">D. Invest in a new <span class="clickable-term" @click="openGlossary('cryptocurrency')"><strong>cryptocurrency</strong></span> coin his friend has just bought (Skibidicoin)</span>
              <span class="points-display">
                <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 6 points
              </span>
            </div>
            <div v-if="detailsVisible.D" class="details-content">
              <table>
                <thead>
                  <tr>
                    <th>Assets</th>
                    <th>Liabilities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>House £200,000</td>
                    <td><span class="clickable-term" @click="openGlossary('mortgage')"><strong>Mortgage</strong></span> £150,000</td>
                  </tr>
                  <tr>
                    <td>Car £50,000</td>
                    <td>Car Loan £20,000</td>
                  </tr>
                  <tr>
                    <td>Cash £25,000</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><strong>Total: £275,000</strong></td>
                    <td><strong>Total: £170,000</strong></td>
                  </tr>
                  <tr>
                    <td colspan="2"><strong>Net Worth = £105,000</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>

          <li @click="toggleDetails('E')">
            <div class="top">
              <span class="option-text">E. Put the money in a savings account (paying 3% interest)</span>
              <span class="points-display">
                <img src="../../../../assets/Lightning Bolt.png" alt="Lightning Bolt" class="lightning-bolt"> 4 points
              </span>
            </div>
            <div v-if="detailsVisible.E" class="details-content">
              <table>
                <thead>
                  <tr>
                    <th>Assets</th>
                    <th>Liabilities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>House £200,000</td>
                    <td><span class="clickable-term" @click="openGlossary('mortgage')"><strong>Mortgage</strong></span> £150,000</td>
                  </tr>
                  <tr>
                    <td>Car £50,000</td>
                    <td>Car Loan £20,000</td>
                  </tr>
                  <tr>
                    <td>Cash £45,000</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><strong>Total: £275,000</strong></td>
                    <td><strong>Total: £170,000</strong></td>
                  </tr>
                  <tr>
                    <td colspan="2"><strong>Net Worth = £125,000</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
        </ol>
      </div>

      <!-- Team Answers with Points -->
      <div class="team-answer-comparison">
        <div v-for="(team, index) in teams" :key="team.name" class="team-answer-box">
          <p>{{ team.name }}</p>
          <div class="points-earned" :style="{ backgroundColor: getPointsColor(getPoints(teamAnswers[index])) }">
            {{ getPoints(teamAnswers[index]) }} points
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <button class="next-button" @click="nextQuestion">Next</button>
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
      timerStarted: false,
      showGlossary: false,
      showHintModal: false,
      glossaryTitle: '',
      glossaryContent: '',
      pointsMapping: {
        A: 7,
        B: 10,
        C: 8,
        D: 6,
        E: 4
      },
      // Track visibility of details for each option
      detailsVisible: {
        A: false,
        B: false,
        C: false,
        D: false,
        E: false
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
    openGlossary(term) {
      this.showGlossary = true;

      if (term === 'mortgage') {
        this.glossaryTitle = 'Mortgage';
        this.glossaryContent = 'A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.';
      } else if (term === 'cryptocurrency') {
        this.glossaryTitle = 'Cryptocurrency';
        this.glossaryContent = 'A type of money you can use on a computer but can\'t touch like coins or bills. It’s made using special computer codes, and you can use it to buy things online.';
      }
    },
    toggleDetails(option) {
      this.detailsVisible[option] = !this.detailsVisible[option]; // Toggle the visibility of the selected option's details
    },
    submitAnswers() {
      this.showResults = true;
      clearInterval(this.intervalId); // Clear the timer after submission
    },
    getPoints(answer) {
      return this.pointsMapping[answer] || 0;
    },
    getPointsColor(points) {
      const minPoints = 0;
      const maxPoints = 10;
      const coldColor = [0, 0, 255]; // Cold: Blue (RGB)
      const warmColor = [0, 255, 0];   // Warm: Green (RGB)

      const ratio = (points - minPoints) / (maxPoints - minPoints);

      const r = Math.round(coldColor[0] + ratio * (warmColor[0] - coldColor[0]));
      const g = Math.round(coldColor[1] + ratio * (warmColor[1] - coldColor[1]));
      const b = Math.round(coldColor[2] + ratio * (warmColor[2] - coldColor[2]));

      return `rgb(${r}, ${g}, ${b})`;
    },
    nextQuestion() {
      const pointsArray = this.teamAnswers.map(answer => this.getPoints(answer));
      this.$emit('award-points', pointsArray); // Emit points to parent
      this.$emit('next-question'); // Emit event to parent to move to the next question
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

/* Glossary and Hint Buttons */

/* Glossary Styles */
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
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.top {
  display: flex;
  flex-direction: row;
  width: 100%;
}

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
  width: 85%;
}

.option-text:hover {
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

/* Details content (table or additional information) */
.details-content {
  margin-top: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 10px;
}

.details-content table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  border: 1px solid #B3E3D3;
}

.details-content table th,
.details-content table td {
  padding: 5px;
}

.details-content table th {
  background-color: #EFEFEF;
  color: #333;
  font-weight: bold;
}

.details-content table td {
  border-bottom: 1px solid #ccc;
  background-color: #FFFFFF;
  color: #000;
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

.clickable-term {
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
}
</style>
