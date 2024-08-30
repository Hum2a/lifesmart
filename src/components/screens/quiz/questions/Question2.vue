<template>
    <div class="question-container">
      <div class="question-header">
        <h2 class="animated-header">Tax Calculation Challenge</h2>
      </div>
  
      <div class="question-content animated-section">
        <p>Ben earns £60,000 a year. Income tax automatically comes out of his paycheck before he gets the money.</p>
  
        <div class="tax-info">
          <div class="tax-bracket">
            <p><strong>0 – £10,000 = 0%</strong> (The first 10k is tax-free)</p>
            <p><strong>£10,000 - £40,000 = 20%</strong> (You pay 20% tax on the money IN THIS BRACKET only)</p>
            <p><strong>£40,000 - £100,000 = 40%</strong> (You pay 40% tax on the money IN THIS BRACKET only)</p>
          </div>
        </div>
  
        <p class="question animated-question">HOW MUCH MONEY DOES HE GET IN HIS ACCOUNT AFTER TAX? <span class="points">3 Points</span></p>
  
        <div class="answers animated-answers">
          <p>A - £38,000</p>
          <p>B - £42,000</p>
          <p>C - £46,000</p>
          <p>D - £48,000</p>
          <p>E - £50,000</p>
        </div>
      </div>
  
      <!-- Combine v-if and v-else in the same transition block -->
      <transition name="fade">
        <div v-if="showResults" class="results-container animated-results">
          <p class="correct-answer">The correct answer is: <strong>C - £46,000</strong></p>
          <div class="teams-container">
            <div v-for="(team, index) in teams" :key="index" class="team-result-box" :class="{ correct: teamAnswers[index] === correctAnswer, incorrect: teamAnswers[index] !== correctAnswer }">
              <p>{{ team }}</p>
              <p>{{ teamAnswers[index] }}</p>
            </div>
          </div>
          <button class="next-question-button" @click="nextQuestion">Next Question</button>
        </div>
  
        <!-- v-else must be directly after v-if -->
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
          <button class="timer-button animated-button" @click="startTimer">Start timer – 4 minutes</button>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuestionNo2',
    props: {
      teams: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        correctAnswer: 'C', // Correct answer for this question
        teamAnswers: Array(this.teams.length).fill(''), // Initialize with empty answers
        showResults: false, // To control the display of results
      };
    },
    methods: {
      showCorrectAnswer() {
        this.showResults = true;
      },
      nextQuestion() {
        const pointsArray = this.teamAnswers.map(answer => (answer === this.correctAnswer ? 3 : 0));
        this.$emit('award-points', pointsArray); // Emit points to parent
        this.$emit('next-question'); // Emit event to parent to move to the next question
      },
      startTimer() {
        // Timer logic can be added here
        console.log("Timer started for 4 minutes.");
      }
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
  
  .tax-info {
    margin: 20px 0;
    animation: fadeInUp 1.5s ease-in;
  }
  
  .tax-bracket {
    background-color: #34495e;
    padding: 15px;
    border-radius: 8px;
    color: #ecf0f1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
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
  
  .answers {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    animation: fadeInUp 1.5s ease-in;
  }
  
  .results-container {
    margin-top: 20px;
    animation: fadeInUp 1.2s ease-in;
  }
  
  .correct-answer {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #00e676; /* Green for correct */
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
  