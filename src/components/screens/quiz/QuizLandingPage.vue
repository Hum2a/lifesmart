<template>
    <div class="quiz-landing-page">
      <!-- Header -->
      <header class="header">
        <h1 class="header-title">Create Your Teams</h1>
      </header>
  
      <!-- Main Content -->
      <main class="main-content">
        <form @submit.prevent="addTeam" class="team-form">
          <input
            type="text"
            v-model="teamName"
            placeholder="Enter team name"
            class="team-input"
            required
          />
          <button type="submit" class="button add-team-button">Add Team</button>
        </form>
  
        <!-- Display Teams -->
        <div class="teams-container" v-if="teams.length > 0">
          <h2 class="teams-title">Teams</h2>
          <ul class="teams-list">
            <li v-for="(team, index) in teams" :key="index" class="team-item">
              {{ team }}
            </li>
          </ul>
        </div>
      </main>
  
      <!-- Footer -->
      <footer class="footer">
        <button @click="startQuiz" class="button start-quiz-button" :disabled="teams.length === 0">Start Quiz</button>
      </footer>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'QuizLandingPage',
    setup() {
      const router = useRouter();
      const teamName = ref('');
      const teams = ref([]);
  
      const addTeam = () => {
        if (teamName.value.trim()) {
          teams.value.push(teamName.value.trim());
          teamName.value = ''; // Clear the input field after adding
        }
      };
  
      const startQuiz = () => {
        if (teams.value.length > 0) {
          // Pass teams data as query parameters
          router.push({ name: 'Quiz', query: { teams: teams.value.join(',') } });
        }
      };
  
      return {
        teamName,
        teams,
        addTeam,
        startQuiz,
      };
    },
  };
  </script>
  
  <style scoped>
  .quiz-landing-page {
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .team-form {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
  }
  
  .team-input {
    padding: 10px;
    font-size: 1.1rem;
    border-radius: 5px;
    border: none;
    outline: none;
    width: 200px;
  }
  
  .button {
    padding: 10px 20px;
    font-size: 1.1rem;
    color: #ffffff;
    background-color: #3949ab; /* Button Background */
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
  }
  
  .button:hover {
    background-color: #5c6bc0; /* Lighter Blue on Hover */
    transform: scale(1.05);
    border-color: #ffffff; /* White Border on Hover */
  }
  
  .teams-container {
    text-align: center;
    margin-top: 20px;
  }
  
  .teams-title {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  .teams-list {
    list-style: none;
    padding: 0;
  }
  
  .team-item {
    background-color: #3949ab;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
  }
  
  .footer {
    background-color: #283593; /* Same as Header Background */
    padding: 20px;
    text-align: center;
  }
  
  .start-quiz-button {
    background-color: #1565c0; /* Blue Button */
  }
  
  .start-quiz-button:disabled {
    background-color: #3949ab; /* Darker Blue When Disabled */
    cursor: not-allowed;
  }
  </style>
  