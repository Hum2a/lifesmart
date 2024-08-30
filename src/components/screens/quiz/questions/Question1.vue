<template>
    <div class="question-container">
      <div class="question-content">
        <p>Ben is a 30 year old engineer.</p>
        <p>He has the following assets and liabilities:</p>
        
        <div class="assets-liabilities">
          <div class="assets">
            <p><strong>Assets:</strong></p>
            <p>House - £200,000</p>
            <p>Car - £50,000</p>
            <p>Cash - £20,000</p>
          </div>
          <div class="liabilities">
            <p><strong>Liabilities:</strong></p>
            <p>Mortgage (6%) - £150,000</p>
            <p>Car Loan (10%) - £20,000</p>
          </div>
        </div>
  
        <p class="question">WHAT IS HIS NET WORTH? <span class="points">3 Points</span></p>
      </div>
  
      <div v-if="showResults" class="results-container">
        <p class="correct-answer">The right answer is: <strong>£100,000</strong></p>
        <p>Net worth is assets – liabilities</p>
        <div class="teams-container">
          <div v-for="(team, index) in teams" :key="index" class="team-result-box" :class="{ correct: teamAnswers[index] === correctAnswer, incorrect: teamAnswers[index] !== correctAnswer }">
            <p>{{ team }}</p>
          </div>
        </div>
      </div>
  
      <div v-else class="team-answers">
        <p>Answer</p>
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
        <button class="show-answer-button" @click="showCorrectAnswer">Show Correct Answer</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuestionNo1',
    props: {
      teams: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        correctAnswer: 'C',
        teamAnswers: Array(this.teams.length).fill(''), // Initialize with empty answers
        showResults: false, // To control the display of results
      };
    },
    methods: {
      showCorrectAnswer() {
        this.showResults = true;
      }
    }
  };
  </script>
  
  <style scoped>
  .question-container {
    text-align: center;
    padding: 20px;
    background-color: #ffffff; /* White background for clarity */
    color: #000000; /* Black text */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%; /* Full width */
    max-width: none; /* No maximum width constraint */
    margin: 0; /* Remove margin */
  }
  
  .question-content {
    margin-bottom: 30px;
  }
  
  .assets-liabilities {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  
  .assets, .liabilities {
    text-align: left;
  }
  
  .question {
    color: red;
    font-weight: bold;
  }
  
  .points {
    font-weight: normal;
    color: black;
  }
  
  .results-container {
    margin-top: 20px;
  }
  
  .correct-answer {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .team-answers {
    margin-top: 40px;
  }
  
  .teams-container {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  
  .team-box, .team-result-box {
    text-align: center;
    padding: 10px;
    border-radius: 4px;
    min-width: 50px;
  }
  
  .team-select {
    width: 100px;
    padding: 5px;
    text-align: center;
    border: 1px solid #000000;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
  }
  
  .show-answer-button {
    padding: 10px 20px;
    background-color: #1a237e; /* Dark blue background */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .show-answer-button:hover {
    background-color: #283593; /* Slightly lighter blue on hover */
  }
  
  .correct {
    background-color: green;
    color: white;
  }
  
  .incorrect {
    background-color: red;
    color: white;
  }
  </style>
  