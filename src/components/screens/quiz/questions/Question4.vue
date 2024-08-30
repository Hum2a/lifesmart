<template>
    <div class="question-container">
      <div class="question-header">
        <h2 class="animated-header">Investment Growth Projection</h2>
      </div>
  
      <div class="question-content animated-section">
        <p>
          Ben decides to use £500 a month of his savings and invest in a stocks fund portfolio. He chooses the ‘S&P500 Fund’ because it is predicted to return 8%.
        </p>
  
        <div class="question animated-question">
          <p>IF HE CONTINUES TO PUT IN £500 A MONTH AND THE FUND HAS A RETURN OF 8% ANNUALLY, APPROXIMATELY HOW MUCH MONEY WILL HE HAVE AFTER 10 YEARS?</p>
          <span class="points">2 Points</span>
        </div>
  
        <!-- Multiple choice answers section -->
        <div class="multiple-choice-container">
          <p class="multiple-choice">
            A - £25,000&nbsp;&nbsp;&nbsp;&nbsp;
            B - £40,000&nbsp;&nbsp;&nbsp;&nbsp;
            C - £55,000&nbsp;&nbsp;&nbsp;&nbsp;
            D - £90,000&nbsp;&nbsp;&nbsp;&nbsp;
            E - £120,000
          </p>
        </div>
      </div>
  
      <!-- Combine v-if and v-else in the same transition block -->
      <transition name="fade">
        <div v-if="showResults" class="results-container animated-results">
          <p class="correct-answer">The right answer is: <strong>E - £120,000</strong></p>
          <p class="explanation">Investing £500 per month with an 8% annual return compounds to approximately £120,000 over 10 years.</p>
          <div class="teams-container">
            <div v-for="(team, index) in teams" :key="index" class="team-result-box" :class="{ correct: teamAnswers[index] === correctAnswer, incorrect: teamAnswers[index] !== correctAnswer }">
              <p>{{ team }}</p>
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
          <button class="timer-button animated-button" @click="startTimer">Start timer – 1 minute</button>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuestionNo4',
    props: {
      teams: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        correctAnswer: 'E', // Correct answer is 'E - £120,000'
        teamAnswers: Array(this.teams.length).fill(''), // Initialize with empty answers
        showResults: false, // To control the display of results
      };
    },
    methods: {
      showCorrectAnswer() {
        this.showResults = true;
      },
      nextQuestion() {
        const pointsArray = this.teamAnswers.map(answer => answer === this.correctAnswer ? 2 : 0);
        this.$emit('award-points', pointsArray); // Emit points to parent
        this.$emit('next-question'); // Emit event to parent to move to the next question
      },
      startTimer() {
        // Timer logic can be added here
        console.log("Timer started for 1 minute.");
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
  