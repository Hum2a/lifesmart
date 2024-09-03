<template>
  <div class="results-container">
    <h2>Quiz Results</h2>
    <table class="results-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team Name</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(team, index) in sortedTeams" :key="team.name">
          <td>{{ index + 1 }}</td>
          <td>{{ team.name }}</td>
          <td>{{ team.points }}</td>
        </tr>
      </tbody>
    </table>

    <div class="button-container">
      <button @click="goHome" class="home-button">Go to Home</button>
      <button @click="saveResultsAndNavigate" class="simulation-button">Go to Simulation</button>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';

export default {
  name: 'ResultsScreen',
  props: {
    teams: {
      type: Array,
      required: true
    }
  },
  computed: {
    sortedTeams() {
      // Sort teams by points in descending order
      return this.teams.sort((a, b) => b.points - a.points);
    }
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' });
    },
    async saveResultsAndNavigate() {
      const db = getFirestore();
      const teamsCollectionRef = collection(db, 'Quiz', 'Quiz Simulations', 'Teams');

      // Save each team's data to the Teams collection
      for (const team of this.sortedTeams) {
        const teamDocRef = doc(teamsCollectionRef, team.name);
        await setDoc(teamDocRef, {
          name: team.name,
          points: team.points
        });
      }

      console.log('Results saved to Firebase:', this.sortedTeams);

      this.$router.push({ name: 'QuizSimulation' }); // Navigate to Quiz Simulation
    }
  }
};
</script>

<style scoped>
.results-container {
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

.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.results-table th,
.results-table td {
  border: 1px solid #ffffff;
  padding: 10px;
  text-align: center;
}

.results-table th {
  background-color: #283593; /* Header background */
}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.home-button,
.simulation-button {
  padding: 10px 20px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover,
.simulation-button:hover {
  background-color: #16a085;
}
</style>
