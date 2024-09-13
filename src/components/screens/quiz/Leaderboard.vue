<template>
  <div class="leaderboard-container">
    <h2 class="leaderboard-title">LEADERBOARD</h2>

    <div class="team-columns">
      <!-- Render each team and their corresponding vertical bar -->
      <div v-for="(team, index) in sortedTeams" :key="team.name" class="team-column">
        <div class="team-rank" :class="getRankClass(index)">
          <!-- Bar representing team's score -->
          <div class="score-bar" :style="{ height: animatedHeights[index] + '%' }">
            <p class="points">{{ team.points }} XP</p>
          </div>

          <!-- Display crown for first place -->
          <p v-if="index === 0" class="crown">👑</p>
          <h3>{{ getRank(index) }}</h3>
          <p>{{ team.name }}</p>
        </div>
      </div>
    </div>

    <!-- Next button to move to the next question -->
    <button class="next-button" @click="nextQuestion">Next</button>
  </div>
</template>

<script>
export default {
  name: "LeaderBoard",
  props: {
    teams: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      animatedHeights: [], // Store heights for the animation
    };
  },
  computed: {
    sortedTeams() {
      return [...this.teams].sort((a, b) => b.points - a.points);
    },
  },
  methods: {
    getRank(index) {
      const ranks = ["1st", "2nd", "3rd"];
      return ranks[index] || `${index + 1}th`;
    },
    getRankClass(index) {
      const rankClasses = ["first", "second", "third"];
      return rankClasses[index] || "other";
    },
    calculateHeight(points) {
      const maxPoints = this.sortedTeams[0].points || 1; // Avoid division by 0
      return (points / maxPoints) * 100;
    },
    animateBars() {
      this.sortedTeams.forEach((team, index) => {
        const height = this.calculateHeight(team.points);
        setTimeout(() => {
          this.animatedHeights.splice(index, 1, height);
        }, index * 200); // Delayed animation for each bar
      });
    },
    nextQuestion() {
      this.$emit("next-question");
    },
  },
  mounted() {
    this.animatedHeights = Array(this.sortedTeams.length).fill(0); // Initialize with 0 heights
    this.animateBars(); // Trigger the animation after the component is mounted
  },
};
</script>

<style scoped>
.leaderboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}

.leaderboard-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000000;
}

/* Team columns with bars for scores */
.team-columns {
  display: flex;
  gap: 30px;
  margin-bottom: 100px;
}

.team-column {
  display: flex;
}

.team-rank {
  text-align: center;
  width: 80px;
  position: relative;
  color: #000000;
}

.crown {
  font-size: 1.8rem;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
}

/* Score bar styles */
.score-bar {
  background-color: #e0e0e0;
  border-radius: 10px;
  width: 50px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  transition: height 1s ease; /* Smooth animation for the height */
  margin-top: auto; /* Ensures the bar starts from the bottom */
}

.score-bar .points {
  font-size: 1rem;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 3px 8px;
  border-radius: 5px;
  margin-bottom: 5px;
}

/* Team placement colors */
.first .score-bar {
  background-color: #ffd700; /* Gold */
}

.second .score-bar {
  background-color: #c0c0c0; /* Silver */
}

.third .score-bar {
  background-color: #cd7f32; /* Bronze */
}

.other .score-bar {
  background-color: #4caf50; /* Green for other ranks */
}

h3 {
  font-size: 1.2rem;
  margin-top: 10px;
}

/* Next button */
.next-button {
  background-color: #1e3a8a;
  color: white;
  padding: 15px 40px;
  font-size: 1.2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 30px;
}

.next-button:hover {
  background-color: #2563eb;
}
</style>
