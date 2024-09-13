<template>
  <div class="results-container">
    <h2>Quiz Results</h2>

    <!-- Bar Chart Representation for Points -->
    <div class="team-results">
      <div
        v-for="(team, index) in sortedTeams"
        :key="team.name"
        class="team-bar-container"
      >
        <div class="team-bar">
          <p class="team-name">{{ index + 1 }}. {{ team.name }}</p>
          <div class="bar" :style="{ width: calculateBarWidth(team.points) + '%' }">
            <p class="points">{{ team.points }} XP</p>
          </div>
        </div>
        <div class="team-points-breakdown">
          <h4>Points Breakdown</h4>
          <ul>
            <li>Task 1: {{ team.taskScores[1] }} XP</li>
            <li>Task 2: {{ team.taskScores[2] }} XP</li>
            <li>Task 3: {{ team.taskScores[3] }} XP</li>
            <li>Task 4: {{ team.taskScores[4] }} XP</li>
            <li>Task 5: {{ team.taskScores[5] }} XP</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="button-container">
      <button @click="goHome" class="home-button">Go to Home</button>
      <button @click="saveResultsAndNavigate" class="simulation-button">Go to Simulation</button>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ResultsScreen',
  props: {
    teams: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localTeams: [...this.teams], // Create a local copy of the teams array to avoid mutating props
      barWidths: {} // Object to hold the final bar widths
    };
  },
  computed: {
    sortedTeams() {
      // Return a sorted copy of localTeams without mutating the original array
      return [...this.localTeams].sort((a, b) => b.points - a.points);
    }
  },
  methods: {
    calculateBarWidth(points) {
      const maxPoints = this.sortedTeams[0].points || 1; // Avoid division by zero
      return (points / maxPoints) * 100;
    },
    getPointsBreakdown(team) {
      // Placeholder logic for the breakdown
      const pointsPerTask = Math.floor(team.points / 5); // Simple division by number of tasks
      return pointsPerTask; // Replace this with actual points breakdown logic
    },
    goHome() {
      this.$router.push({ name: 'Home' });
    },
    async saveResultsAndNavigate() {
      const db = getFirestore();
      const teamsCollectionRef = collection(db, 'Quiz', 'Quiz Simulations', 'Teams');

      try {
        // Retrieve and delete all existing team documents
        const snapshot = await getDocs(teamsCollectionRef);
        const deletePromises = snapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
        await Promise.all(deletePromises);

        // Save new team's data from the current session
        const savePromises = this.sortedTeams.map(team => {
          const teamDocRef = doc(teamsCollectionRef, team.name);
          return setDoc(teamDocRef, {
            name: team.name,
            points: team.points
          });
        });

        await Promise.all(savePromises); // Wait until all saving operations are done

        // Navigate to the next screen
        this.$router.push({ name: 'QuizSimulation' });
      } catch (error) {
        console.error('Error during saving results to Firebase:', error);
      }
    }
  },
  mounted() {
    // Set the initial widths to 0 for animation
    this.sortedTeams.forEach(team => {
      this.barWidths[team.name] = 0;
    });

    // After a small delay, update the bar widths to the calculated values
    setTimeout(() => {
      this.sortedTeams.forEach(team => {
        this.barWidths[team.name] = this.calculateBarWidth(team.points);
      });
    }, 200); // Small delay before animation starts
  }
};


</script>

<style scoped>
.results-container {
  text-align: center;
  padding: 30px;
  background-color: #1e1e2f;
  color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 900px;
  margin: 20px auto;
  animation: slideIn 1s ease-out;
}

.team-results {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.team-bar-container {
  display: flex;
  flex-direction: column;
  background-color: #2c2f3b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.team-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
}

.team-name {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

/* Bar for the points with smooth animation */
.bar {
  background-color: #4caf50;
  height: 40px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  color: white;
  font-weight: bold;
  width: 0; /* Initial width is 0 */
  transition: width 1.5s ease-in-out; /* Smooth animation for the width */
}


.points {
  font-size: 1.2rem;
}

.team-points-breakdown {
  margin-top: 10px;
}

.team-points-breakdown h4 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.team-points-breakdown ul {
  list-style: none;
  padding: 0;
}

.team-points-breakdown li {
  font-size: 1rem;
  margin-bottom: 5px;
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
