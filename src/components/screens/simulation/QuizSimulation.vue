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

      <button @click="fetchAvailableGroups" class="modern-button">Restore Group</button>

      <div class="groups">
        <div v-for="(group, index) in groups" :key="index" class="group">
          <div class="group-header">
            <h2>
              {{ group.name }}
              <span class="group-points">({{ group.points }} points)</span>
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
                Total: £{{ getRemainingSpendableAmount(group).toFixed(2) }}
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
  <!-- Restore Group Modal -->
  <div class="modal" v-if="showRestoreModal">
    <div class="modal-content">
      <span class="close" @click="toggleRestoreModal">&times;</span>
      <h3>Select a Group to Restore</h3>
      <ul class="group-list">
        <li v-for="group in availableGroups" :key="group.name" class="group-list-item">
          <span>{{ group.name }} ({{ group.points }} points)</span>
          <button @click="restoreGroup(group.name)" class="restore-button">Restore</button>
        </li>
      </ul>
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
      availableGroups: [], // Holds groups fetched for restoration
      showRestoreModal: false, // Controls the restore modal visibility
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
    // async restoreGroup(groupName) {
    //   const db = getFirestore();
    //   const teamsCollectionRef = collection(db, 'Quiz', 'Quiz Simulations', 'Teams');
      
    //   try {
    //     // Query Firestore for the specific group by name
    //     const querySnapshot = await getDocs(teamsCollectionRef);
    //     const teamDoc = querySnapshot.docs.find(doc => doc.data().name === groupName);

    //     if (teamDoc) {
    //       const points = teamDoc.data().points;
    //       this.groups.push({
    //         name: groupName,
    //         points: points,
    //         assets: {
    //           equity: 0,
    //           bonds: 0,
    //           realestate: 0,
    //           commodities: 0,
    //           other: 0,
    //         },
    //         allocatedFunds: this.getTotalSpendableAmount(points)
    //       });
    //       this.$nextTick(() => this.renderPieChart(this.groups.length - 1)); // Render pie chart for the restored group
    //       alert(`Group "${groupName}" has been restored with ${points} points.`);
    //     } else {
    //       alert(`Group "${groupName}" could not be found in Firestore.`);
    //     }
    //   } catch (error) {
    //     console.error('Error restoring group from Firestore:', error);
    //     alert('Failed to restore group. Please try again.');
    //   }
    // },
    restoreGroupPrompt() {
      const groupName = prompt("Enter the name of the group you wish to restore:");
      if (groupName && groupName.trim() !== '') {
        this.restoreGroup(groupName.trim());
      }
    },
    async fetchAvailableGroups() {
      const db = getFirestore();
      const teamsCollectionRef = collection(db, 'Quiz', 'Quiz Simulations', 'Teams');
      
      try {
        const querySnapshot = await getDocs(teamsCollectionRef);
        if (querySnapshot.empty) {
          alert('No groups available to restore.');
          return;
        }

        this.availableGroups = querySnapshot.docs.map(doc => ({
          name: doc.data().name,
          points: doc.data().points,
        }));
        
        this.toggleRestoreModal(); // Show the modal after fetching groups
      } catch (error) {
        console.error('Error fetching available groups from Firestore:', error);
        alert('Failed to fetch available groups.');
      }
    },
    toggleRestoreModal() {
      this.showRestoreModal = !this.showRestoreModal;
    },
    async restoreGroup(groupName) {
      this.showRestoreModal = false; // Close the modal when a group is selected

      const db = getFirestore();
      const teamsCollectionRef = collection(db, 'Quiz', 'Quiz Simulations', 'Teams');
      
      try {
        const querySnapshot = await getDocs(teamsCollectionRef);
        const teamDoc = querySnapshot.docs.find(doc => doc.data().name === groupName);

        if (teamDoc) {
          const points = teamDoc.data().points;
          this.groups.push({
            name: groupName,
            points: points,
            assets: {
              equity: 0,
              bonds: 0,
              realestate: 0,
              commodities: 0,
              other: 0,
            },
            allocatedFunds: this.getTotalSpendableAmount(points)
          });
          this.$nextTick(() => this.renderPieChart(this.groups.length - 1)); // Render pie chart for the restored group
          alert(`Group "${groupName}" has been restored with ${points} points.`);
        } else {
          alert(`Group "${groupName}" could not be found in Firestore.`);
        }
      } catch (error) {
        console.error('Error restoring group from Firestore:', error);
        alert('Failed to restore group. Please try again.');
      }
    },
    getTotalSpendableAmount(points) {
      return 100000 + (points * 200);
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
body {
  margin: auto;
  font-size: 1.1em; /* Global font size increase */
}

.dashboard {
  display: grid;
  background-color: #f6f2ee;
}

.header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2em;
  background-color: #102454;
  border-radius: 0 0 25px 25px;
  position: relative;
}

.header .logo {
  height: auto;
  width: auto;
  margin-left: 0;
  clip-path: polygon(0 0, 60% 0, 60% 100%, 0% 100%);
}

.header .header-icons {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
}

.header-icons button {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #b6b6b6;
  transition: transform 0.3s ease;
}

.header-icons button:hover i {
  transform: scale(1.2);
}

.header-content {
  display: flex;
  align-items: center;
  text-align: left;
  margin: 20px 0;
  color: #000000;
}

.header-content span {
  font-size: 26px;
  font-weight: bold;
}

.header-content .blueline {
  height: 50px;
}

.groups {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.group {
  background-color: #FBFBFB;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  margin: 0 20px 20px 0;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
}

.group-header h2 {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  font-size: 1.8rem;
}

.group-header h2 .group-points {
  margin-left: 10px;
  font-size: 1rem;
  color: #cb1111;
}

.group .group-content {
  display: flex;
  flex-direction: column;
}

.group .inputs {
  display: flex;
  flex-direction: column;
}

.group .inputs .input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.group .inputs .input-row label {
  margin-right: 10px;
  color: #000000;
  font-size: 1.5em
}

.group .inputs .input-row input {
  color: #000000;
  text-align: center;
}

.total-value {
  margin: 20px 0;
  padding: 10px;
  background-color: #082148;
  color: #ffffff;
  border-radius: 5px;
  text-align: center;
  font-size: 26px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pie-chart-container {
  width: 300px;
  height: 200px;
  margin: 10px auto 0;
}

.button, .modern-button {
  background-color: #082148;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.button:hover, .modern-button:hover {
  background-color: #0a015a;
  transform: scale(1.05);
}

.button:active, .modern-button:active {
  transform: scale(0.95);
  background-color: #cc0000;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  margin: auto;
}

.modal-content h3 {
  font-size: 1.1em;
}

.modal-content input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-content button {
  width: 100%;
  background-color: #001f3f;
  color: yellow;
  padding: 14px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #000080;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover, .close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.group-list {
  list-style: none;
  padding: 0;
}

.group-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.group-list-item:last-child {
  border-bottom: none;
}

.restore-button {
  background-color: #082148;
  color: #ffffff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.restore-button:hover {
  background-color: #0a015a;
}


</style>
