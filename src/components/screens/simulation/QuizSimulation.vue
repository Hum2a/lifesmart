<template>
  <div v-if="isLoading" class="loading-spinner">Loading...</div>
  <div class="dashboard" v-else>
    <header class="header">
      <img src="../../../assets/LifeSmartLogo.png" alt="Logo" class="logo">
      <div class="header-icons">
        <button @click="toggleCalculator" class="calculator-toggle">
          <i class="fas fa-calculator"></i>
        </button>
        <button @click="toggleSimulationControls" class="simulation-controls-toggle">
          <img src="../../../assets/settings (1) 1.png" alt="Controls">
        </button>
        <button @click="toggleSimulationHistory" class="simulation-history-toggle">
          <img src="../../../assets/calendar 1.png" alt="Calendar">
        </button>
      </div>
    </header>

    <SimulationControls v-if="showSimulationControls" />
    <SimulationHistory v-if="showSimulationHistory" @viewSimulationDetails="handleViewSimulationDetails" />

    <main v-if="!currentSimulationIndex">
      <h1 class="header-content">
        <img src="../../../assets/Blue line.png" alt="BlueLine" class="blueline">
        <span>Group Management</span>
      </h1>

      <!-- Display the teams and their points -->
      <div class="teams-overview">
        <h2>Teams and Points</h2>
        <ul>
          <li v-for="team in groups" :key="team.name">
            {{ team.name }}: {{ team.points }} points
          </li>
        </ul>
      </div>

      <div class="groups">
        <div v-for="(group, index) in groups" :key="index" class="group">
          <div class="group-header">
            <h2>
              {{ group.name }}
              <button @click="editGroupName(index)" class="edit-group-btn">
                <img src="../../../assets/pencil 1.png" alt="Pencil">
              </button>
              <button @click="removeGroup(index)" class="remove-group-btn">
                <img src="../../../assets/remove.png" alt="Remove">
              </button>
            </h2>
          </div>
          <div class="group-content">
            <div class="inputs">
              <div class="input-row" v-for="(asset, key) in group.assets" :key="key">
                <label :for="key">{{ key.charAt(0).toUpperCase() + key.slice(1) }}:</label>
                <input 
                  type="number" 
                  v-model.number="group.assets[key]" 
                  :id="key" 
                  class="modern-input"
                  @input="updateSpendableAmount(index)"
                >
              </div>
              <div class="total-value">
                Total Spendable Amount: £{{ getRemainingSpendableAmount(group).toFixed(2) }}
              </div>
              <button @click="updateAllGroupValues(index)" class="modern-button enter-all-btn">Enter All</button>
            </div>
            <div class="pie-chart-container">
                <canvas :id="'pieChart_' + index"></canvas>
            </div>
          </div>
        </div>
      </div>

      <button @click="startSimulation" class="modern-button">
        Start Simulation
        <img src="../../../assets/Arrow 17.png" alt="Icon" style="margin-left: 5px;">
      </button>
    </main>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="toggleModal">&times;</span>
        <h3>Add a new group</h3>
        <form @submit.prevent="confirmAddGroup">
          <input type="text" v-model="newGroupName" placeholder="Enter group name" required autofocus>
          <button @click="confirmAddGroup">Confirm</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { getFirestore, doc, collection, getDocs, writeBatch, setDoc, query } from 'firebase/firestore';
import SimulationControls from './SimulationControls.vue';
import SimulationHistory from './PastSimulations.vue';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, Title);

export default {
  name: 'QuizSimulation',
  components: {
    SimulationControls,
    SimulationHistory,
  },
  setup() {
    const router = useRouter();
    return {
      router,
    };
  },
  data() {
    return {
      groups: [],
      showCalculator: false,
      showSimulationControls: false,
      showSimulationHistory: false,
      showModal: false,
      newGroupName: '',
      currentSimulationIndex: null,
      charts: [],
      isLoading: true,
    };
  },
  async created() {
    await this.fetchTeamsFromFirebase();
  },
  methods: {
    async fetchTeamsFromFirebase() {
      const db = getFirestore();
      const teamsCollectionRef = collection(db, 'Quiz', 'Quiz Simulations', 'Teams');

      try {
        const querySnapshot = await getDocs(teamsCollectionRef);
        if (querySnapshot.empty) {
          console.error('No team data found in Firebase.');
          this.isLoading = false;
          return;
        }

        this.groups = querySnapshot.docs.map(doc => ({
          name: doc.data().name,
          points: doc.data().points,
          assets: {
            equity: 0,
            bonds: 0,
            realestate: 0,
            commodities: 0,
            other: 0,
          },
          allocatedFunds: 0, // Initialize allocatedFunds if needed
        }));

        this.groups.forEach((group, index) => {
          this.generateRandomValues(index);
        });

        this.isLoading = false;
      } catch (error) {
        console.error('Error fetching team data from Firebase:', error);
        this.isLoading = false;
      }
    },
    getTotalSpendableAmount(points) {
      return 100000 + (points * 500);
    },
    getRemainingSpendableAmount(group) {
      const totalSpendable = this.getTotalSpendableAmount(group.points);
      const totalAllocated = Object.values(group.assets).reduce((sum, value) => sum + value, 0);
      return totalSpendable - totalAllocated;
    },
    updateSpendableAmount(index) {
      const group = this.groups[index];
      this.groups[index].allocatedFunds = this.getRemainingSpendableAmount(group);
    },
    addGroup() {
      this.toggleModal();
    },
    toggleModal() {
      this.showModal = !this.showModal;
    },
    confirmAddGroup() {
      if (this.newGroupName.trim()) {
        this.groups.push({
          name: this.newGroupName.trim(),
          points: 0,
          assets: {
            equity: 0,
            bonds: 0,
            realestate: 0,
            commodities: 0,
            other: 0,
          },
          allocatedFunds: 0,
        });
        this.newGroupName = ''; 
        this.toggleModal();
      } else {
        alert('Please enter a group name.');
      }
    },
    editGroupName(index) {
      const newName = prompt("Enter new group name:", this.groups[index].name);
      if (newName && newName.trim() !== '') {
        this.groups[index].name = newName.trim();
      }
    },
    removeGroup(index) {
      this.groups.splice(index, 1);
      if (this.charts[index]) {
        this.charts[index].destroy();
        this.charts.splice(index, 1);
      }
    },
    async fetchLatestSimulationIndex() {
      const db = getFirestore();
      const simulationsRef = collection(db, 'Quiz', 'Asset Market Simulations', 'Simulations');
      const querySnapshot = await getDocs(simulationsRef);
      return querySnapshot.size;
    },
    async clearGroups() {
      if (!this.currentSimulationIndex) {
        console.error("No simulation index set.");
        return;
      }
      const db = getFirestore();
      const querySnapshot = await getDocs(query(collection(db, 'Quiz', 'Asset Market Simulations', 'Simulations', `Simulation ${this.currentSimulationIndex}`, 'Groups')));
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('All groups have been removed from Firestore.');
    },
    async saveGroups() {
      if (!this.currentSimulationIndex) {
        console.error("No simulation index set.");
        return;
      }
      const db = getFirestore();
      
      try {
        await Promise.all(this.groups.map(group => {
          const groupDocRef = doc(db, 'Quiz', 'Asset Market Simulations', 'Simulations', `Simulation ${this.currentSimulationIndex}`, 'Groups', group.name);
          return setDoc(groupDocRef, group);
        }));
      } catch (err) {
        console.error('Error saving groups to Firestore: ', err);
        alert('Failed to save groups.');
      }
      
      this.router.push({ name: 'SimulationPage' });
    },
    async startSimulation() {
      const latestIndex = await this.fetchLatestSimulationIndex();
      if (latestIndex === null) {
        console.error("No existing simulations found.");
        alert("No existing simulations found. Please create a new simulation first.");
        return;
      }
      this.currentSimulationIndex = latestIndex;
      await this.clearGroups();
      await this.saveGroups();
    },
    generateRandomValues(index) {
      // Initialize all asset values to 0 on startup
      const group = this.groups[index];
      Object.keys(group.assets).forEach(key => {
        group.assets[key] = 0;
      });
      this.updateSpendableAmount(index); // Update spendable amount display
    },
    renderPieChart(index) {
      const group = this.groups[index];
      this.$nextTick(() => {
        const canvasId = 'pieChart_' + index;
        const canvas = document.getElementById(canvasId);
        
        if (!canvas) {
          console.error(`Canvas element not found for index: ${index}`);
          return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          console.error(`Unable to get canvas context for index: ${index}`);
          return;
        }

        const data = {
          labels: ['Equity', 'Bonds', 'Real Estate', 'Commodities', 'Other'],
          datasets: [{
            label: `${group.name} Asset Allocation`,
            data: Object.values(group.assets),
            backgroundColor: [
              'rgba(114, 93, 255, 1)',
              'rgba(230, 96, 131, 1)',
              'rgba(255, 133, 76, 1)',
              'rgba(30, 174, 174, 1)',
              'rgba(54, 48, 82, 1)'
            ],
            borderColor: [
              'rgba(114, 93, 255, 1)',
              'rgba(230, 96, 131, 1)',
              'rgba(255, 133, 76, 1)',
              'rgba(30, 174, 174, 1)',
              'rgba(54, 48, 82, 1)'
            ],
            borderWidth: 1
          }]
        };

        if (this.charts[index]) {
          this.charts[index].destroy();
        }

        this.charts[index] = new Chart(ctx, {
          type: 'pie',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  color: '#000',
                  font: {
                    size: 10,
                    family: 'Helvetica'
                  },
                  boxWidth: 20,
                  usePointStyle: true
                }
              }
            },
            animation: {
              animateRotate: true,
              animateScale: true,
            },
            cutout: '65%'
          }
        });

        console.log(`Chart instance created for index: ${index}`);
      });
    },
    updateAllGroupValues(index) {
      const group = this.groups[index];
      Object.keys(group.assets).forEach(field => {
        // Ensure the value is retained and not reset to 0
        group.assets[field] = parseFloat(group.assets[field]) || 0;
      });
      this.updatePieChart(index); // Update the pie chart after finalizing values
    },
    updatePieChart(index) {
      this.renderPieChart(index);
    },
    toggleCalculator() {
      this.router.push({ name: 'InvestmentCalculator' });
    },
    toggleSimulationControls() {
      this.showSimulationControls = !this.showSimulationControls;
    },
    handleViewSimulationDetails(simulationIndex) {
      this.currentSimulationIndex = simulationIndex;
      this.showSimulationHistory = false;
    },
    toggleSimulationHistory() {
      this.showSimulationHistory = !this.showSimulationHistory;
      this.currentSimulationIndex = null;
    }
  },
  mounted() {
    this.groups.forEach((group, index) => {
      this.$nextTick(() => this.renderPieChart(index));
    });
    console.log('Teams:', this.teams);
  }
};
</script>

<style scoped>
@import url('../../styles/GroupCreationStyles.css');
.enter-all-btn {
  margin-top: 10px;
}
</style>
