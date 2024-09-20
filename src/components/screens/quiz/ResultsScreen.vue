<template>
  <div class="results-container">
    <h2>Leaderboard</h2>

    <!-- Bar Chart Representation for Points -->
    <div class="team-results">
      <div
        v-for="(team, index) in rankedTeams"
        :key="team.name"
        :class="['team-bar-container', { expanded: expandedTeam === team.name, 'winning-team': team.rank === 1 }]"
        :style="{ backgroundColor: team.rank === 1 ? '#C5FF9A' : '' , color: team.rank === 1 ? 'black' : '' }"
        @click="toggleTeamExpansion(team.name)"
      >
        <div class="team-bar">
          <p class="team-name">
            {{ team.rank }}. {{ team.name }}
            <!-- Show crown image next to the team name for the winning team -->
            <img v-if="team.rank === 1" src="../../../assets/crown.png" alt="Crown" class="crown-icon" />
          </p>
          <!-- Bar Wrapper to control the alignment -->
          <div class="bar-wrapper">
            <div class="bar" :style="{ width: barWidths[team.name] + '%', transitionDelay: index * 0.2 + 's' }"></div>
          </div>
          <div class="points-info">
            <p class="points" :style="{ color: team.rank === 1 ? 'black' : 'white' }">⚡ {{ team.points }}</p>
            <p class="rank-change" :style="{ color: team.rank === 1 ? 'black' : 'white' }">⬆</p>
          </div>
        </div>

        <!-- Points Breakdown Table, shown when expanded -->
        <div v-if="expandedTeam === team.name" class="team-points-breakdown">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Task 1</td>
                <td>{{ team.taskScores[1] }}</td>
              </tr>
              <tr>
                <td>Task 2</td>
                <td>{{ team.taskScores[2] }}</td>
              </tr>
              <tr>
                <td>Task 3</td>
                <td>{{ team.taskScores[3] }}</td>
              </tr>
              <tr>
                <td>Task 4</td>
                <td>{{ team.taskScores[4] }}</td>
              </tr>
              <tr>
                <td>Task 5</td>
                <td>{{ team.taskScores[5] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="button-container">
      <button @click="goHome" class="home-button">Go to Home</button>
      <button class="next-button" @click="nextQuestion">Next</button>
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
      barWidths: {}, // Object to hold the final bar widths
      expandedTeam: null, // Track which team is expanded
      maxPoints: 23 // The total number of points available in the quiz
    };
  },
  computed: {
    sortedTeams() {
      // Return a sorted copy of localTeams without mutating the original array
      return [...this.localTeams].sort((a, b) => b.points - a.points);
    },
    rankedTeams() {
      const rankings = [];
      let rank = 1;

      this.sortedTeams.forEach((team, index) => {
        // If this is not the first team and this team has the same points as the previous one
        if (index > 0 && team.points === this.sortedTeams[index - 1].points) {
          // Assign the same rank as the previous team
          rankings.push({ ...team, rank: rankings[index - 1].rank });
        } else {
          // Assign the current rank and move the rank counter forward
          rankings.push({ ...team, rank });
          rank++;
        }
      });

      return rankings;
    }
  },
  methods: {
    calculateBarWidth(points) {
      // Ensure that the bar width reflects the percentage of the points relative to 23 points
      return (points / this.maxPoints) * 100; // Calculate percentage width relative to the max points (23)
    },
    toggleTeamExpansion(teamName) {
      // Toggle the expansion of a team's container
      this.expandedTeam = this.expandedTeam === teamName ? null : teamName;
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
    },
    nextQuestion() {
      this.$emit("next-question");
    },
  },
  mounted() {
    // Set the initial widths to 0 for animation
    this.sortedTeams.forEach(team => {
      this.barWidths[team.name] = 0;
    });

    // After a small delay, update the bar widths to the calculated values with cascading delays
    setTimeout(() => {
      this.sortedTeams.forEach((team, index) => {
        setTimeout(() => {
          this.barWidths[team.name] = this.calculateBarWidth(team.points);
        }, index * 300); // Add a small cascading delay between each team
      });
    }, 200); // Small delay before animation starts
  }
};
</script>

<style scoped>
.results-container {
  text-align: center;
  justify-content: center;
  padding: 30px;
  background: linear-gradient(to bottom, #c2e9fb, #a1c4fd); /* Light blue gradient */
  color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100vh;
  animation: slideIn 1s ease-out;
}

.results-container h2 {
  color: white;
  font-size: 2.5rem;
}

.team-results {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-bar-container {
  display: flex;
  flex-direction: column;
  background-color: #8397BF;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 60%;
  height: 40px;
  overflow: hidden;
  transition: height 0.3s ease, background-color 0.3s;
  cursor: pointer;
}

.team-bar-container:hover {
  background-color: #768BAE; /* Slight color change on hover */
}

.team-bar-container.expanded {
  height: 320px;
}

.team-bar {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.team-name {
  font-size: 1.2rem;
  margin-right: 20px;
  flex-basis: 15%; /* Reserve space for the team name */
}

/* Wrapper to control alignment and contain the bar */
.bar-wrapper {
  width: 55%;
  height: 20px;
  background-color: #ffffff; /* Background for the wrapper (optional) */
  border-radius: 20px;
  margin-right: 10px;
  overflow: hidden; /* Ensure the bar stays within the wrapper */
}

.bar {
  background: linear-gradient(90deg, #00c6ff, #0072ff); /* Blue gradient */
  height: 20px;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start; /* Start the bar from the left */
  padding-right: 10px;
  color: white;
  font-weight: bold;
  width: 0; /* Initial width is 0 */
  transition: width 1.5s ease-in-out; /* Smooth animation for width */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Add a subtle shadow for depth */
}


.points-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-basis: 20%; /* Space for points and rank change */
  justify-content: space-evenly;
}

.points {
  font-size: 1rem;
  font-weight: bold;
  color: white;
}

.rank-change {
  font-size: 1rem;
  color: white;
}

.team-points-breakdown {
  margin-top: 10px;
  overflow-x: auto; /* Ensure the table is responsive */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 1rem;
  color: #fff;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

tbody tr:nth-child(odd) {
  background-color: #8aa6c1;
}

tbody tr:nth-child(even) {
  background-color: #9bb3ce;
}

tbody tr:hover {
  background-color: #6c8ab5;
  transition: background-color 0.3s ease;
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

.next-button {
  font-weight: bold;
  color: black;
  background-color: white;
  border-color: black;
  border-radius: 20px;
  border-width: 4px;
  box-shadow: inset;
  padding: 10px;
  width: 7%;
  transition: 0.3s ease;
}

.crown-icon {
  width: 20px; /* Adjust the size of the crown */
  height: 40px;
  margin-left: 8px; /* Add some space between the team name and the crown */
  vertical-align: middle; /* Align the crown vertically with the text */
}

</style>
