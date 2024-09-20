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
}

.dashboard {
  display: grid;
  background-color: #f6f2ee;
}

.header-content {
  display: flex;
  align-items: center; /* Centers the image and text vertically */
  justify-items: center;
  text-align: left;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #000000; /* Sets the text color to black */
}

.header-icons {
  display: inline-flex;
  justify-items: center;
  align-self: center;
  align-items: center;
  justify-content: flex-end;
  width: auto;
}

.blueline {
  height: 50px; /* Adjust the height as needed */
}

.header-content span {
  font-size: 24px; /* Adjust the font size as needed */
  font-weight: bold; /* Optional: if you want the text to be bold */
}


.groups {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Align items to the start */
  align-items: center; /* Align items at their top edge */
  gap: 20px;
}

.group {
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: #FBFBFB; /* Navy blue background */
  padding: 20px;
  border-radius: 10px;
  width: 300px;; 
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensures that content is evenly spaced */
  white-space: nowrap; /* Prevents text from wrapping to the next line */
}

.group-header h2 {
  display: flex;
  align-items: center; /* Vertically center elements */
  flex-wrap: nowrap; /* Prevents the content from wrapping to the next line */
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hides any overflowing content */
  text-overflow: ellipsis; /* Adds '...' if the content overflows */
  margin: 0; /* Removes default margin to avoid extra spacing */
  font-size: 1.2rem; /* Adjust font size as necessary */
}

.group-header h2 .group-points {
  margin-left: 10px;
  font-size: 0.9rem; /* Adjust font size as needed */
  color: #888;
}

.group-points {
  font-size: 0.9rem;
  color: #888;
  margin-left: 10px;
}

.group-content {
  display: flex;
  flex-direction: column;
}

.group-header .edit-group-btn,
.group-header .remove-group-btn {
  margin-left: 10px; /* Adjusts spacing between buttons */
}

.inputs {
  display: flex;
  flex-direction: column;
}

.input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.input-row label {
  margin-right: 10px; /* Add some spacing between label and input */
  color: #000000
}

.input-row input {
  color: #000000;
  text-align: center;
}

.add-group-btn {
  background-color: #082148; /* Purple background */
  color: #ffffff; /* White text color */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease-out, box-shadow 0.2s ease;
  height: 500px; /* Adjust height to fit its content */
  align-self: center;
  margin: auto 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);

  /* Styles for vertical text */
  writing-mode: vertical-lr;
  text-orientation: mixed;
  transform: rotate(180deg);
}

.add-group-btn:hover, .add-group-btn:focus {
  background-color: #00035f;
  transform: rotate(180deg) scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3); /* Larger shadow for lifted effect */
}

.add-group-btn:active {
  transform: rotate(180deg) scale(0.95); 
  box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* Reset to smaller shadow */
}


.edit-group-btn img, .remove-group-btn img {
  width: 20px; /* Adjust the width as needed */
  height: auto; /* Maintain aspect ratio */
  display: block; /* To enable margin auto */
  margin: 0 auto; /* Center the image horizontally */
}

.edit-group-btn, .remove-group-btn {
  padding: 5px; /* Adjust padding to ensure buttons are not too large or too small */
  border: none; /* Remove any default border */
  background: transparent; /* Remove any default background */
  cursor: pointer; /* Change cursor to pointer to indicate clickable */
}

.edit-group-btn {
  margin-left: 130px;
}

.modern-input {
  background-color: #F0F0F0; /* Black background */
  color: #000000; /* White text */
  font-size: 16px;
  transition: border-color 0.3s;
}

.modern-input:focus {
  outline: none;
}


.modern-button {
  background-color: #082148; /* Yellow background */
  color: #ffffff;
  border: none;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s, transform 0.2s;
}

.modern-button:hover {
  background-color: #0a015a; /* Slightly darker red on hover */
  transform: scale(1.05); /* Slightly larger on hover */
}

.modern-button:focus {
  outline: none;
}

.modern-button:active {
  background-color: #cc0000; /* Even darker red on active/click */
  transform: scale(0.95); /* Slightly smaller on click */
}

.calculator-toggle, .simulation-controls-toggle, .simulation-history-toggle, .simulation-login-toggle {
  position: absolute;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #b6b6b6; /* Yellow color */
}

.simulation-controls-toggle {
  right: 80px; /* Adjust based on your layout */
}

.simulation-history-toggle {
  right: 140px; /* Adjust based on your layout */
}

.simulation-login-toggle {
  right: 200px;
}

.simulation-login-toggle img {
  width: 40px;  /* Adjust the width as needed */
  height: 40px; /* Maintain the aspect ratio */
}


.calculator-toggle i, .simulation-controls-toggle i, .simulation-history-toggle i, .simulation-login-toggle i {
  transition: transform 0.3s ease;
  }

.calculator-toggle:hover i, .simulation-controls-toggle:hover i, .simulation-history-toggle:hover i, .simulation-login-toggle:hover i {
transform: scale(1.2);
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
}

.modal-content input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Makes sure padding does not affect overall width */
}

.modal-content button {
  width: 100%;
  background-color: #001f3f; /* Navy blue background */
  color: yellow; /* Yellow text */
  padding: 14px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #000080; /* A slightly lighter navy blue for hover */
}


.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.header {
  grid-column: 1 / -1; /* Full width */
  display: flex;
  justify-content: space-between;
  align-items: center; /* Vertically center the content */
  padding: 0.2em;
  background-color: #102454;
  border-top-left-radius: 0;      /* Top left corner */
  border-top-right-radius: 0;     /* Top right corner */
  border-bottom-right-radius: 25px;  /* Bottom right corner */
  border-bottom-left-radius: 25px;   /* Bottom left corner */
  position: relative;
}

.header p {
  color: white; /* Choose a color that fits your header's theme */
  position: absolute;
  color: white;
  top: 50%; /* Aligns the top of the element at the center of the parent */
  left: 50%; /* Aligns the left of the element at the center of the parent */
  transform: translate(-50%, -50%); 
}

.toolbar {
  display: flex;
  gap: 20px; /* Space between buttons */
}

button {
  background-color: #0073e6; /* Lighter blue for buttons */
  color: #ffffff; /* White text */
  border: none;
  padding: 10px 15px;
  border-radius: 5px; /* Rounded corners for a modern look */
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s; /* Smooth transitions for hover and click */
}

button:hover {
  background-color: #005cb800; /* Darker blue on hover */
  transform: scale(1.05); /* Slightly larger on hover */
}

button:active {
  transform: scale(0.95); /* Slightly smaller when clicked */
}


.logo {
  height: auto; /* Maintain aspect ratio */
  width: auto; /* Example width; adjust as needed */
  display: block; /* To prevent inline default behavior */
  margin-left: 0; /* Align the logo to the left */
  clip-path: polygon(0 0, 60% 0, 60% 100%, 0% 100%);

}

/* Font Awesome Icons */
.fas {
  margin-right: 8px; /* Space between icon and text */
}

.total-value {
  margin-top: 20px; /* Adds space above the total value display */
  margin-bottom: 20px;
  padding: 10px; /* Adds padding around the text for better readability */
  border-radius: 5px; /* Rounded corners for the total value display */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow for depth */
  text-align: center; /* Centers the total value text */
  background-color: #082148; /* Yellow background */
  color: #ffffff;
  border: none;
  font-size: 16px;
  margin-bottom: 10px;
}

.pie-chart-container {
  width: 300px; /* Adjust based on desired size and number of charts per row */
  height: 200px; /* Keep the same height as width for a 1:1 aspect ratio */
  margin: auto; /* Center the canvas in the pie chart container if needed */
  margin-top: 10px;
}

.welcome-message {
  padding: 10px 20px;
  background-color: #f0f4f844; /* Light grey-blue, soothing and professional */
  color: #2c3e50; /* Dark blue for contrast and readability */
  border-left: 5px solid #5cb85c; /* A green accent color */
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Subtle shadow for depth */
  margin-bottom: 20px; /* Space it out from other content */
  display: inline-block; /* Aligns better with other inline or block elements */
}

.settings {
  background-color: #f2f2f2; /* Light grey background */
  padding: 15px;            /* Padding around the content */
  margin: 20px 0;           /* Vertical spacing for separation */
  border-radius: 8px;       /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
  display: flex;            /* Flexible box layout */
  align-items: center;      /* Vertically align items in the middle */
  justify-content: space-between; /* Space between label and input field */
}

.settings label {
  font-weight: bold;        /* Bold font for label */
  margin-right: 10px;       /* Space between label and input */
  color: #333;              /* Darker text color for better readability */
}

.settings input[type="number"] {
  width: 100px;             /* Fixed width for the input field */
  padding: 8px;             /* Padding inside the input field */
  border: 1px solid #ccc;   /* Light grey border */
  border-radius: 4px;       /* Rounded corners for the input field */
  font-size: 16px;          /* Sufficiently large font size for easy reading */
}

.enter-all-btn {
  margin-top: 10px;
}
</style>
