<template>
  <div class="financial-quiz">
    <!-- Header -->
    <header class="header">
      <h1 class="header-title">Financial Quiz</h1>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Render the question component if quiz is not complete -->
      <component
        v-if="!quizComplete"
        :is="currentQuestionComponent"
        :teams="teams"
        @answer="handleAnswer"
        @next-question="nextQuestion"
        @award-points="updateScores"
      ></component>

      <!-- Display current scores after each question -->
      <div v-if="!quizComplete" class="scoreboard">
        <h3>Current Scores:</h3>
        <table class="scores-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in teams" :key="index">
              <td>{{ team.name }}</td>
              <td>{{ team.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Render the results screen if quiz is complete -->
      <div v-else class="results-screen">
        <h2>Quiz Complete!</h2>
        <p>Thank you for participating.</p>
        <h3>Final Scores:</h3>
        <table class="results-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in sortedTeams" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ team.name }}</td>
              <td>{{ team.points }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="goHome" class="home-button">Go to Home</button>
        <button @click="goToSimulation" class="simulation-button">Go to Simulation</button>
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
import { useRoute, useRouter } from 'vue-router';

// Import all question components
import Question1 from './questions/Question1.vue';
import Question2 from './questions/Question2.vue';
import Question3 from './questions/Question3.vue';
import Question4 from './questions/Question4.vue';
import Question5 from './questions/Question5.vue';

export default {
  name: 'FinancialQuiz',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const teams = ref(route.query.teams ? route.query.teams.split(',').map(name => ({ name, points: 0 })) : []);

    const currentQuestionIndex = ref(0);
    const totalQuestions = 5; // Update to the total number of questions
    const quizComplete = ref(false);

    // Array of question components
    const questionComponents = [
      Question1,
      Question2,
      Question3,
      Question4,
      Question5,
    ];

    const currentQuestionComponent = computed(() => questionComponents[currentQuestionIndex.value]);

    const sortedTeams = computed(() => {
      // Sort teams by points in descending order
      return [...teams.value].sort((a, b) => b.points - a.points);
    });

    const handleAnswer = (answer) => {
      console.log('Team answered:', answer);
      // Logic to handle the answer and store results
    };

    const updateScores = (scores) => {
      // Update each team's score with the points awarded
      scores.forEach((points, index) => {
        teams.value[index].points += points;
      });
    };

    const nextQuestion = () => {
      if (currentQuestionIndex.value < totalQuestions - 1) {
        currentQuestionIndex.value += 1;
      } else {
        quizComplete.value = true;
      }
    };

    const goHome = () => {
      router.push({ name: 'Home' }); // Navigate back to the home page or starting screen
    };

    const goToSimulation = () => {
      router.push({ name: 'Simulation' }); // Navigate to the simulation screen
    };

    return {
      teams,
      sortedTeams,
      currentQuestionComponent,
      currentQuestionIndex,
      totalQuestions,
      quizComplete,
      handleAnswer,
      updateScores,
      nextQuestion,
      goHome,
      goToSimulation,
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

.scoreboard, .results-screen {
  text-align: center;
  margin-top: 20px;
  animation: fadeIn 1.5s ease-in;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.scores-table, .results-table {
  width: 60%;
  margin: 20px auto;
  border-collapse: collapse;
  color: #ffffff;
}

.scores-table th, .results-table th,
.scores-table td, .results-table td {
  border: 1px solid #ffffff;
  padding: 10px;
  text-align: center;
}

.scores-table th, .results-table th {
  background-color: #283593; /* Header background */
}

.home-button, .simulation-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover, .simulation-button:hover {
  background-color: #16a085;
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
