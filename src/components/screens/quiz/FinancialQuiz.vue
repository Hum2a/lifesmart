<template>
  <div class="financial-quiz">
    <main class="main-content">
      <!-- Show the results screen between questions -->
      <ResultsScreen
        v-if="showResults && !quizComplete"
        :teams="sortedTeams"
        @next-question="nextQuestion"
      ></ResultsScreen>

      <!-- Render the question component if quiz is not complete and results screen is not showing -->
      <component
        v-if="!quizComplete && !showResults"
        :is="currentQuestionComponent"
        :teams="teams"
        @answer="handleAnswer"
        @next-question="showResultsAfterQuestion"
        @award-points="updateScores"
      ></component>

      <!-- Render the final results screen if quiz is complete -->
      <ResultsScreen
        v-else-if="quizComplete"
        :teams="teams"
        :quiz-complete="quizComplete"
        @go-home="goHome"
        @save-results="saveResultsAndNavigate"
      />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p class="footer-text">© 2024 Our App. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import ResultsScreen from "./ResultsScreen.vue"; // Import ResultsScreen component

// Import all question components
import Question1 from "./questions/Question1.vue";
import Question2 from "./questions/Question2.vue";
import Question3 from "./questions/Question3.vue";
import Question4 from "./questions/Question4.vue";
import Question5 from "./questions/Question5.vue";
import Question6 from "./questions/Question6.vue";

export default {
  name: "FinancialQuiz",
  components: {
    ResultsScreen, // Register ResultsScreen component
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const db = getFirestore();
    const auth = getAuth(); // Firebase Authentication

    const uid = ref(null); // Store the user's UID
    const teams = ref(
      route.query.teams
        ? route.query.teams.split(",").map((name) => ({
            name,
            points: 0,
            taskScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, // Initialize taskScores for each task
          }))
        : []
    );

    const currentQuestionIndex = ref(0);
    const totalQuestions = 6;
    const quizComplete = ref(false);
    const showResults = ref(false); // Control for showing results screen between questions

    const questionComponents = [
      Question1,
      Question2,
      Question3,
      Question4,
      Question5,
      Question6,
    ];

    const currentQuestionComponent = computed(
      () => questionComponents[currentQuestionIndex.value]
    );

    const sortedTeams = computed(() => {
      return [...teams.value].sort((a, b) => b.points - a.points);
    });

    const handleAnswer = (answer) => {
      console.log("Team answered:", answer);
    };

    const updateScores = (scores) => {
      scores.forEach((points, index) => {
        const currentTask = currentQuestionIndex.value + 1;
        teams.value[index].points += points;
        teams.value[index].taskScores[currentTask] = points; // Update task-specific points
      });
    };

    const showResultsAfterQuestion = () => {
      showResults.value = true; // Show the results screen after each question
    };

    const nextQuestion = () => {
      showResults.value = false; // Hide the results screen before moving to the next question
      if (currentQuestionIndex.value < totalQuestions - 1) {
        currentQuestionIndex.value += 1;
      } else {
        quizComplete.value = true; // Mark quiz as complete
        saveResultsAndNavigate(); // Automatically navigate to the simulation after the final question
      }
    };

    const goHome = () => {
      router.push({ name: "Home" });
    };

    const saveResultsAndNavigate = async () => {
      if (!uid.value) {
        alert("No user is logged in. Please sign in.");
        router.push({ name: "Home" });
        return;
      }

      const teamsCollectionRef = collection(
        db,
        uid.value,
        "Quiz Simulations",
        "Teams"
      );

      try {
        // Step 1: Retrieve and delete all existing team documents for this user
        const snapshot = await getDocs(teamsCollectionRef);

        const deletePromises = snapshot.docs.map((docSnapshot) =>
          deleteDoc(docSnapshot.ref)
        );
        await Promise.all(deletePromises); // Wait until all deletion operations are done

        console.log("All old teams deleted from Firebase for this user.");

        // Step 2: Save each new team's data from the current session
        const savePromises = sortedTeams.value.map((team) => {
          const teamDocRef = doc(teamsCollectionRef, team.name);
          return setDoc(teamDocRef, {
            name: team.name,
            points: team.points,
          });
        });

        await Promise.all(savePromises); // Wait until all saving operations are done

        console.log("New results saved to Firebase:", sortedTeams.value);

        // Step 3: Navigate to the simulation screen only after all operations are complete
        router.push({ name: "QuizSimulation" });
      } catch (error) {
        console.error("Error during saving results to Firebase:", error);
      }
    };

    onMounted(() => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        uid.value = currentUser.uid; // Get the current user's UID
      } else {
        console.error("No user is logged in.");
        router.push({ name: "Home" }); // Redirect to home if no user is logged in
      }
    });

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
      showResultsAfterQuestion,
      goHome,
      saveResultsAndNavigate, // Use this function to save results and navigate
      showResults, // Control for showing/hiding results
    };
  },
};
</script>

<style scoped>
.financial-quiz {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #ffffff; /* White Text */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 0;
  margin: 0;
  width: 100%;
}

.header {
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
  width: 100%;
  height: 100%;
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
  background-color: #283593;
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
  background-color: #283593;
  padding: 20px;
  text-align: center;
  width: 100%;
}

.footer-text {
  margin: 0;
  font-size: 0.9rem;
}
</style>
