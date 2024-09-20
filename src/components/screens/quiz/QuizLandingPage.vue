<template>
  <div class="quiz-landing-page">
    <!-- Landing Page Section -->
    <div v-if="!showTeamCreation" class="landing-page">
      <header class="header">
        <h1 class="header-title">Welcome to</h1>
        <h1 class="header-title">The Financial Game!</h1>
      </header>
      <main class="main-content">
        <p class="welcome-message">
          Welcome to the game that helps prepare you for your financial future. Explore concepts like credit, loans, savings, and investments while building your financial savviness.
        </p>
        <button @click="startTeamCreation" class="button start-game-button">Start Game</button>
      </main>

      <!-- Background Icons -->
      <div class="background-icons">
        <img src="@/assets/piggy_bank.png" alt="Piggy Bank" class="icon piggy-bank">
        <img src="@/assets/dollar_tree.png" alt="Dollar Tree" class="icon dollar-tree">
        <img src="@/assets/chart.png" alt="Chart" class="icon chart">
        <img src="@/assets/card.png" alt="Card" class="icon card">
        <img src="@/assets/money.png" alt="Money" class="icon money">
        <img src="@/assets/seed.png" alt="Seed" class="icon seed">
        <img src="@/assets/graduate.png" alt="Graduate" class="icon graduate">
      </div>
    </div>

    <!-- Team Creation Section -->
    <div v-else class="team-creation-page">
      <header class="header">
        <h1 class="header-title">Enter Game Details</h1>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <div class="team-details">
          <div class="team-number">
            <label for="teamCount">NUMBER OF TEAMS</label>
            <div class="team-controls">
              <button @click="decreaseTeams" class="team-control-button">-</button>
              <input type="text" v-model="teamCount" id="teamCount" class="team-count-display" readonly />
              <button @click="increaseTeams" class="team-control-button">+</button>
            </div>
          </div>

          <div class="team-names">
            <label>TEAM NAMES</label>
            <div v-for="(team, index) in teamCount" :key="index" class="team-name-input-container">
              <input v-model="teams[index]" type="text" placeholder="Enter team name" class="team-input" />
            </div>
          </div>

          <button @click="startQuiz" class="button next-button" :disabled="teams.some(name => !name)">Next</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'QuizLandingPage',
  setup() {
    const router = useRouter();
    const showTeamCreation = ref(false);
    const teamCount = ref(1);  // Default team count starts at 1
    const maxTeams = 5;  // Maximum number of teams
    const teams = ref(Array(teamCount.value).fill(""));  // Initialize an array for storing team names

    const startTeamCreation = () => {
      showTeamCreation.value = true;
    };

    const increaseTeams = () => {
      if (teamCount.value < maxTeams) {
        teamCount.value++;
        teams.value.push(""); // Add an empty input field for the new team
      }
    };

    const decreaseTeams = () => {
      if (teamCount.value > 1) {
        teamCount.value--;
        teams.value.pop(); // Remove the last team input field
      }
    };

    const startQuiz = () => {
      if (teams.value.every(name => name.trim())) {
        router.push({ name: 'Quiz', query: { teams: teams.value.join(',') } });
      }
    };

    return {
      showTeamCreation,
      teamCount,
      teams,
      maxTeams,
      startTeamCreation,
      increaseTeams,
      decreaseTeams,
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
  background-color: #ffffff;
  font-family: 'Arial', sans-serif;
  text-align: center;
  color: #000000;
}

/* Landing Page Styles */
.landing-page {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Vertically center */
  align-items: center; /* Horizontally center */
  min-height: 100vh; /* Ensures full viewport height */
}

.header {
  background-color: #ffffff;
  padding: 20px;
  text-align: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header-title {
  font-size: 2rem;
  font-weight: bold;
  color: #003F91; /* Dark Blue */
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.welcome-message {
  font-size: 1rem;
  line-height: 1.6;
  color: #4f4f4f;
  max-width: 600px;
  margin-bottom: 30px;
}

.start-game-button {
  background-color: #1a237e;
  color: white;
  padding: 5px 20px;
  font-size: 24px;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.start-game-button:hover {
  background-color: #3949ab;
  transform: scale(1.05);
}

/* Team Creation Page */
.team-creation-page {
  background-color: #ffffff;
  padding: 40px;
}

.team-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.team-number {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.team-number label {
  font-weight: bold;
}

.team-controls {
  display: flex;
  align-items: center;
}

.team-control-button {
  background-color: #B8CEF0;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  margin: 0 10px;
}

.team-count-display {
  padding: 10px;
  font-size: 1.2rem;
  width: 40px;
  text-align: center;
  border: none;
  background-color: #B8CEF0;
  border-radius: 8px;
}

.team-names {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Ensure that the input boxes are spaced further apart */
  align-items: flex-start;
  width: 100%; /* Ensures that the content takes up full width */
}

.team-names label {
  font-weight: bold;
}

.team-name-input-container {
  width: 100%;
  max-width: 400px;
}

.team-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1rem;
  border: transparent;
  background-color: #B8CEF0;
  border-radius: 8px;
}

.add-team-button {
  background-color: transparent;
  color: #1a237e;
  border: 2px solid #1a237e;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.add-team-button:hover {
  background-color: #1a237e;
  color: white;
}

.next-button {
  background-color: #1a237e;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.next-button:disabled {
  background-color: #d3d3d3;
  cursor: not-allowed;
}

.next-button:hover:not(:disabled) {
  background-color: #3949ab;
  transform: scale(1.05);
}
</style>
