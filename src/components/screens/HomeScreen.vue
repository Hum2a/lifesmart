<template>
    <div class="home-screen">
      <!-- Header -->
      <header class="header">
        <h1 class="header-title">Welcome to Our App</h1>
      </header>
  
      <!-- Main Content -->
      <main class="main-content">
        <div class="button-container">
          <button @click="startQuiz" class="button start-quiz-button">Start Quiz</button>
          <button @click="startSimulation" class="button start-simulation-button">Start Simulation Without Quiz</button>
        </div>
      </main>
  
      <!-- Footer -->
      <footer class="footer">
        <p class="footer-text">© 2024 Our App. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'HomeScreen',
    setup() {
      const router = useRouter();
  
      const startQuiz = () => {
        router.push({ name: 'QuizLanding' }); // Replace 'Quiz' with your actual route name
      };
  
      const startSimulation = () => {
        router.push({ name: 'Simulation' }); // Replace 'Simulation' with your actual route name
      };
  
      return {
        startQuiz,
        startSimulation,
      };
    },
  };
  </script>
  
  <style scoped>
  .home-screen {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #1a237e; /* Dark Blue Background */
    color: #ffffff; /* White Text */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
    justify-content: center;
    align-items: center;
  }
  
  .button-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .button {
    padding: 15px 30px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #ffffff;
    background: linear-gradient(90deg, #3a75c4, #6daeed); /* Blue Gradient */
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s ease, border-color 0.3s ease;
    background-size: 200% 100%;
    background-position: 100%;
    position: relative;
    overflow: hidden;
  }
  
  .button:hover {
    transform: scale(1.05);
    border-color: #ffffff; /* White Border on Hover */
    animation: shimmer 1.5s infinite;
  }
  
  /* Shimmer Animation */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .start-quiz-button {
    background: linear-gradient(90deg, #1565c0, #42a5f5); /* Different shades of blue */
  }
  
  .start-simulation-button {
    background: linear-gradient(90deg, #1e88e5, #64b5f6); /* Different shades of blue */
  }
  
  .footer {
    background-color: #283593; /* Same as Header Background */
    padding: 10px;
    text-align: center;
  }
  
  .footer-text {
    margin: 0;
    font-size: 0.9rem;
  }
  </style>
  