<template>
  <div class="results-container">
    <!-- Buttons to navigate home and to the simulation -->
    <button @click="goHome" class="home-button">Go to Home</button>
    <button @click="saveResultsAndNavigate" class="simulation-button">Go to Simulation</button>
    
    <h2 class="title">Scoreboard</h2>

    <div class="content-wrapper">
      <!-- Bar Chart Representation for Points -->
      <div class="team-results">
        <div
          v-for="(team, index) in rankedTeams"
          :key="team.name"
          :class="['team-bar-container', { expanded: expandedTeam === team.name, 'winning-team': team.rank === 1 }]"
          :style="{ backgroundColor: team.rank === 1 ? '#C5FF9A' : '', color: team.rank === 1 ? 'black' : '' }"
          @click="toggleTeamExpansion(team.name)"
        >
          <div class="team-bar">
            <p class="team-name">
              {{ team.rank }}. {{ team.name }}
              <img v-if="team.rank === 1" src="../../../assets/crown.png" alt="Crown" class="crown-icon" />
            </p>
            <div class="bar-wrapper">
              <div class="bar" :style="{ width: barWidths[team.name] + '%', transitionDelay: index * 0.2 + 's' }"></div>
            </div>
            <div class="points-info">
              <p class="points" :style="{ color: team.rank === 1 ? 'black' : 'white' }">⚡ {{ team.points }}</p>
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
                <tr v-for="(points, task) in team.taskScores" :key="task">
                  <td>Task {{ task }}</td>
                  <td>{{ points }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Next Button -->
        <div class="next-button-container">
          <button class="next-button" @click="nextOrNavigateToSimulation">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, setDoc, doc, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "ResultsScreen",
  props: {
    teams: {
      type: Array,
      required: true,
    },
    quizComplete: {
      type: Boolean,
      required: true,
    }, // A prop to check if the quiz is complete or not
  },
  data() {
    return {
      localTeams: [...this.teams], // Create a local copy of the teams array to avoid mutating props
      barWidths: {}, // Object to hold the final bar widths
      expandedTeam: null, // Track which team is expanded
      maxPoints: 23, // The total number of points available in the quiz
      uid: null, // Store the current user's UID
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
    },
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
      this.$router.push({ name: "Home" });
    },
    async saveResultsAndNavigate() {
      const db = getFirestore();
      const teamsCollectionRef = collection(
        db,
        this.uid,
        "Quiz Simulations",
        "Teams"
      );

      try {
        // Retrieve and delete all existing team documents for this user
        const snapshot = await getDocs(teamsCollectionRef);
        const deletePromises = snapshot.docs.map((docSnapshot) =>
          deleteDoc(docSnapshot.ref)
        );
        await Promise.all(deletePromises);

        // Save new team's data from the current session
        const savePromises = this.sortedTeams.map((team) => {
          const teamDocRef = doc(teamsCollectionRef, team.name);
          return setDoc(teamDocRef, {
            name: team.name,
            points: team.points,
            taskScores: team.taskScores, // Include task-specific points
          });
        });

        await Promise.all(savePromises); // Wait until all saving operations are done

        // Navigate to the simulation screen
        this.$router.push({ name: "QuizSimulation" });
      } catch (error) {
        console.error("Error during saving results to Firebase:", error);
      }
    },
    nextOrNavigateToSimulation() {
      // If the quiz is complete, navigate directly to the simulation
      if (this.quizComplete) {
        this.saveResultsAndNavigate();
      } else {
        // Otherwise, emit the next-question event
        this.$emit("next-question");
      }
    },
  },
  mounted() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      this.uid = currentUser.uid; // Retrieve the user's UID
    } else {
      console.error("No user is logged in.");
      this.$router.push({ name: "Home" }); // Redirect to home if no user is logged in
    }

    // Set the initial widths to 0 for animation
    this.sortedTeams.forEach((team) => {
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
  },
};
</script>

<style scoped>
.results-container {
  position: relative; /* Ensure the container is the reference for the absolute buttons */
  text-align: center;
  justify-content: center;
  padding: 30px;
  background: linear-gradient(to bottom, #c2e9fb, #a1c4fd); /* Light blue gradient */
  background: url('../../../assets/classroom.jpg') no-repeat center center; /* Add the background image */
  background-size: cover; /* Ensure the image covers the entire container */
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100vh;
  animation: slideIn 1s ease-out;
  box-sizing: border-box; /* Include padding in dimensions */
}

.results-container h2 {
  position: absolute; /* Position at the top without affecting other elements */
  top: 20px; /* Adjust to place at the top of the screen */
  left: 50%; /* Center horizontally */
  transform: translateX(-50%); /* Offset half the width to perfectly center */
  background-color: white; /* White background */
  padding: 10px 20px; /* Add padding for better aesthetics */
  border-radius: 10px; /* Optional: round the corners */
  font-size: 2.5rem; /* Adjust font size */
  color: black; /* Text color */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  z-index: 1000; /* Ensure it appears above other elements */
}

.content-wrapper {
  display: flex;
  flex-direction: column; /* Stack team-results and next-button-container vertically */
  align-items: center; /* Center horizontally */
  justify-content: flex-start; /* Start from the top */
  width: 100%;
  height: calc(100% - 80px); /* Adjust for the scoreboard title */
  overflow-y: auto; /* Allow scrolling if content exceeds screen */
  padding: 10px 0;
}
.team-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center the team results vertically */
  position: absolute; /* Position relative to the container */
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust for exact centering */
  width: 100%; /* Ensure it spans the full width */
  padding: 20px; /* Add padding for spacing */
  overflow-y: hidden; /* Allow scrolling if content exceeds screen height */
  box-sizing: border-box; /* Include padding in width and height */
}

.team-bar-container {
  display: flex;
  flex-direction: column;
  background-color: #8397bf;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 60%;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  line-height: '1.5';
  margin-bottom: '10px';
}

.team-bar-container:hover {
  background-color: #768bae; /* Slightly darker shade */
  transform: scale(1.05); /* Slightly enlarge the container */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Increase the shadow for depth */
}

.team-bar-container.expanded {
  height: 320px; /* Expand height for expanded content */
}

.team-bar {
  flex: 2;
  display: flex;
  align-items: center;;
  width: 100%;
  justify-content: space-between;
}

.team-name {
  font-size: 1.5rem;
  margin-right: 20px;
  flex-basis: 15%; /* Reserve space for the team name */
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 10px;
  font-weight: bold;
}

.team-result-bar {
  flex: 2;
  display: flex;
  align-items: center;
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
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
}

.rank-change {
  font-size: 1.5rem;
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
  font-size: 1.5rem;
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

.title {
  color: black;
}

.home-button {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #16a085;
}

.simulation-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.simulation-button:hover {
  background-color: #16a085;
}

.next-button-container {
  width: 100%; /* Full width to align with the content */
  display: flex;
  justify-content: center; /* Center the button */
  margin-top: 20px; /* Space above */
  padding: 10px 0;
}

.next-button {
  font-weight: bold;
  color: black;
  background-color: white;
  border-color: black;
  border-radius: 20px;
  border-width: 4px;
  padding: 10px 20px;
  width: 150px; /* Fixed width */
  cursor: pointer;
  transition: 0.3s ease;
}

.next-button:hover {
  background-color: #f0f0f0;
  transform: scale(1.05); /* Slightly enlarge on hover */
}

.crown-icon {
  width: 20px; /* Adjust the size of the crown */
  height: 40px;
  margin-left: 8px; /* Add some space between the team name and the crown */
  vertical-align: middle; /* Align the crown vertically with the text */
}
</style>
