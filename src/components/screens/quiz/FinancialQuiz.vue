<template>
    <div class="financial-quiz">
      <!-- Header -->
      <header class="header">
        <h1 class="header-title">Financial Quiz</h1>
      </header>
  
      <!-- Main Content -->
      <main class="main-content">
        <component
          :is="currentQuestionComponent"
          :teams="teams"
          @answer="handleAnswer"
        ></component>
  
        <div class="navigation-buttons" v-if="currentQuestionIndex < totalQuestions - 1">
          <button @click="nextQuestion" class="next-question-button">Next Question</button>
        </div>
  
        <!-- Quiz Completed Message -->
        <div v-else class="quiz-complete">
          <h2>Quiz Complete!</h2>
          <p>Thank you for participating.</p>
        </div>
      </main>
  
      <!-- Footer -->
      <footer class="footer">
        <p class="footer-text">© 2024 Our App. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  // Import all question components
  import Question1 from './questions/Question1.vue';
  // import Question2 from '../questions/Question2.vue';
  // import Question3 from '../questions/Question3.vue';
  // import Question4 from '../questions/Question4.vue';
  // import Question5 from '../questions/Question5.vue';
  // import Question6 from '../questions/Question6.vue';
  // import Question7 from '../questions/Question7.vue';
  
  export default {
    name: 'FinancialQuiz',
    setup() {
      const route = useRoute();
      const teams = ref(route.query.teams ? route.query.teams.split(',') : []); // Parse teams from query params
  
      const currentQuestionIndex = ref(0);
      const totalQuestions = 1; // Set to 7 when all questions are included
  
      // Array of question components
      const questionComponents = [
        Question1,
        // Question2,
        // Question3,
        // Question4,
        // Question5,
        // Question6,
        // Question7,
      ];
  
      const currentQuestionComponent = computed(() => questionComponents[currentQuestionIndex.value]);
  
      const handleAnswer = (answer) => {
        console.log('Team answered:', answer);
        // Logic to handle the answer and store results
      };
  
      const nextQuestion = () => {
        if (currentQuestionIndex.value < totalQuestions - 1) {
          currentQuestionIndex.value += 1;
        }
      };
  
      return {
        teams,
        currentQuestionComponent,
        currentQuestionIndex,
        totalQuestions,
        handleAnswer,
        nextQuestion,
      };
    },
  };
  </script>
  
  <style scoped>
  .financial-quiz {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #1a237e; /* Dark Blue Background */
    color: #ffffff; /* White Text */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 0; /* Remove padding if necessary */
    margin: 0; /* Remove margin if necessary */
    width: 100%; /* Ensure full width */
  }  
  
  .header {
    background-color: #283593; /* Slightly lighter dark blue */
    padding: 20px;
    text-align: center;
  }
  
  .header-title {
    margin: 0;
    font-size: 2.5rem;
  }
  
  .main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%; /* Ensure main content is full width */
  }
  
  .navigation-buttons {
    margin-top: 20px;
  }
  
  .next-question-button {
    padding: 10px 20px;
    font-size: 1.2rem;
    color: #ffffff;
    background-color: #1565c0; /* Blue Button */
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .quiz-complete {
    text-align: center;
  }
  
  .footer {
    background-color: #283593; /* Same as Header Background */
    padding: 20px;
    text-align: center;
    width: 100%; /* Ensure footer is full width */
  }
  
  .footer-text {
    margin: 0;
    font-size: 0.9rem;
  }
  </style>
  