<template>
  <div class="leaderboard-container">
    <h2 class="leaderboard-title">LEADERBOARD</h2>

    <div class="podium-container">
      <!-- 2nd place (left) -->
      <div v-if="sortedTeams[1]" class="podium second">
        <div class="podium-rank">2nd</div>
        <div class="podium-team">
          <p class="podium-team-name">{{ sortedTeams[1].name }}</p>
          <p class="podium-team-xp">{{ sortedTeams[1].points }} XP</p>
        </div>
      </div>

      <!-- 1st place (center) -->
      <div v-if="sortedTeams[0]" class="podium first">
        <div class="podium-rank">1st</div>
        <div class="podium-team">
          <p class="podium-team-name">{{ sortedTeams[0].name }}</p>
          <p class="podium-team-xp">{{ sortedTeams[0].points }} XP</p>
        </div>
      </div>

      <!-- 3rd place (right) -->
      <div v-if="sortedTeams[2]" class="podium third">
        <div class="podium-rank">3rd</div>
        <div class="podium-team">
          <p class="podium-team-name">{{ sortedTeams[2].name }}</p>
          <p class="podium-team-xp">{{ sortedTeams[2].points }} XP</p>
        </div>
      </div>
    </div>

    <!-- Additional teams below the podium -->
    <div class="other-teams" v-if="sortedTeams.length > 3">
      <div v-for="(team, index) in sortedTeams.slice(3)" :key="team.name" class="team-card">
        <div class="team-rank">{{ index + 4 }}th</div>
        <div class="team-info">
          <p class="team-name">{{ team.name }}</p>
          <p class="team-xp">{{ team.points }} XP</p>
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
  computed: {
    sortedTeams() {
      return [...this.teams].sort((a, b) => b.points - a.points);
    },
  },
  methods: {
    nextQuestion() {
      this.$emit("next-question");
    },
  },
};
</script>

<style scoped>
/* Container for the leaderboard */
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

/* Title for the leaderboard */
.leaderboard-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #000000;
}

/* Podium container */
.podium-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 50px;
}

/* General podium styling */
.podium {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100px;
  height: 150px;
  background-color: #f0f4ff;
  border-radius: 20px;
  position: relative;
  margin: 0 20px;
}

/* First place styling */
.first {
  width: 140px;
  height: 200px;
  background-color: #FFB627;
  color: #FFB627;
}

/* Second place styling */
.second {
  width: 120px;
  height: 160px;
  background-color: #99D19CCC;
  color: #99D19CCC;
}

/* Third place styling */
.third {
  width: 120px;
  height: 160px;
  background-color: #8075FF;
  color: #8075FF;
}

/* Rank text at the top of the podium */
.podium-rank {
  font-size: 1.3rem;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 5px 5px;
  border-radius: 50px;
  width: 97px;
  position: absolute;
  top: 20px;
}

/* Team names and XP */
.podium-team p {
  margin: 5px 0;
  font-weight: bold;
}

.podium-team-name {
  top: 30px;
  color: white;
}

.podium-team-xp {
  color: white;
}

/* Other teams section */
.other-teams {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Individual team card styling */
.team-card {
  background-color: #f0f4ff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
}

.team-card:hover {
  background-color: #e0e6ff;
}

/* Rank and team info inside the card */
.team-rank {
  font-size: 1.2rem;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 8px 15px;
  border-radius: 10px;
}

.team-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.team-name {
  font-weight: bold;
  color: #1e3a8a;
}

.team-xp {
  color: #333;
  font-weight: bold;
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
