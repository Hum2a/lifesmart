<template>
  <div class="simulation-controls">
    <h2>Simulation Controls</h2>
    <form @submit.prevent="onSubmit">
      <div class="input-group">
        <label for="years">Years:</label>
        <input type="number" id="years" v-model.number="years" min="1" />
      </div>
      <div class="quarterly-changes">
        <h3>Quarterly Asset Changes</h3>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Quarter</th>
              <th v-for="asset in assets" :key="asset">{{ asset }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="yearIndex in totalYears" :key="'Year ' + yearIndex">
              <tr v-for="(quarter, qIndex) in quarters" :key="`${yearIndex}-${quarter}`"
                  :class="`year-${yearIndex}`"
                  :style="{ backgroundColor: getColorForYear(yearIndex) }">
                <td v-if="qIndex === 0" :rowspan="quarters.length">{{ yearIndex }}</td>
                <td>
                  <button type="button" class="quarter-button" @click="quarterClicked(yearIndex, quarter)">
                    {{ quarter }}
                  </button>
                </td>
                <td v-for="asset in assets" :key="`${yearIndex}-${quarter}-${asset}`">
                  <input type="number" v-model.number="assetChanges[yearIndex-1][quarter][asset]" step="0.01" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <button @click="toggleEventList" class="toggle-event-list-button">
          {{ showEventList ? 'Hide Events' : 'Show Events' }}
      </button>
      <button type="submit" class="save-button">Save</button>
      <button type="button" class="modern-button" @click="generateRandomValues">Generate Random Values</button>
      <!-- <button @click="downloadTemplate" class="download-template-button">
        Download Excel Template
      </button> -->
      <label class="custom-file-upload">
        <input 
          type="file"
          @change="handleFileUpload"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          style="display: none;" />
        <span>Upload File</span>
      </label>
      <label class="custom-file-upload">
        <input
          type="file"
          @change="handleEventFileUpload"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          style="display: none;" />
        <span>Upload Event File</span>
      </label>
    </form>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="modal-overlay" @click.self="closeConfirmationModal">
      <div class="modal-content">
        <h3>{{ confirmationMessage }}</h3>
        <button @click="closeConfirmationModal">Close</button>
      </div>
    </div>
  </div>

  <div v-if="showEventModal" class="event-modal-overlay" @click.self="closeEventModal">
    <div class="event-modal">
      <h3>Add Event for {{ selectedYear }} - {{ selectedQuarter }}</h3>
      <label for="eventName">Event Name:</label>
      <input type="text" id="eventName" v-model="eventName">
      
      <label for="eventDescription">Description:</label>
      <textarea id="eventDescription" v-model="eventDescription"></textarea>
      
      <button @click="saveEvent">Save Event</button>
      <button @click="closeEventModal">Cancel</button>
    </div>
  </div>

  <div class="event-list-container" v-if="showEventList" >
    <h3>Active Events</h3>
    <ul class="event-list">
      <li v-for="(yearEvents, year) in events" :key="year">
        <h4>Year {{ year }}</h4>
        <ul>
          <li v-for="(event, quarter) in yearEvents" :key="quarter">
            {{ quarter }}: {{ event.name }}
            <span class="event-description"> - {{ event.description }}</span>
            <button class='edit-button' @click="editEvent(year, quarter)">Edit</button>
            <button class='delete-button' @click="deleteEvent(year, quarter)">Delete</button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';
import * as XLSX from 'xlsx';

export default {
  name: 'SimulationControls',
  data() {
    return {
      years: 1,
      assets: ['Equity', 'Bonds', 'RealEstate', 'Commodities', 'Other'],
      quarters: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'],
      assetChanges: [],
      showEventModal: false,
      selectedYear: null,
      selectedQuarter: null,
      eventName: '',
      eventDescription: '',
      events: {},
      showEventList: false,
      showConfirmationModal: false, // For confirmation modal visibility
      confirmationMessage: '', // To hold the confirmation message
    };
  },
  watch: {
    years(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initializeAssetChanges(newVal);
      }
    },
  },
  methods: {
    async getNextSimulationIndex() {
      const db = getFirestore();
      const simulationRef = collection(db, 'Quiz', 'Asset Market Simulations', 'Simulations');
      try {
        const snapshot = await getDocs(simulationRef);
        console.log(`Number of documents in collection 'Quiz':`, snapshot.size);
        return snapshot.size + 1; // Returns the next index
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    },

    handleEventFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.processEventUploadedData(jsonData);
      };
      reader.readAsBinaryString(file);
    },
    processEventUploadedData(data) {
      data.shift(); // Remove header row
      
      // Initialize events object
      const events = {};
      
      // Populate events with the data
      data.forEach(row => {
        const yearMatch = row[0].match(/\d+/);
        const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
        const quarter = this.quarters.find(q => row[1].includes(q));
        
        // Extract event name and description
        const eventName = row[2] ? row[2].toString().trim() : "";
        const eventDescription = row[3] ? row[3].toString().trim() : "";

        // Skip the row if no event name or description is provided
        if (!eventName && !eventDescription) return;
        
        // Initialize year and quarter in events object if not exist
        if (!events[year]) events[year] = {};
        if (!events[year][quarter]) events[year][quarter] = {};
        
        // Add the event to the events object
        events[year][quarter] = { name: eventName, description: eventDescription };
      });

      // Update the component's state with the new events
      this.events = events;
    },

    initializeAssetChanges(years) {
      this.assetChanges = Array.from({ length: years }, () => {
        return this.quarters.reduce((acc, quarter) => {
          acc[quarter] = this.assets.reduce((acc, asset) => {
            acc[asset] = 0;
            return acc;
          }, {});
          return acc;
        }, {});
      });
    },

    async onSubmit() {
      const simulationIndex = await this.getNextSimulationIndex();
      console.log(`Simulation Index: ${simulationIndex}`);

      if (!simulationIndex) {
        console.error('Failed to fetch simulation index');
        this.showConfirmationModalWithMessage('Error: Failed to fetch simulation index');
        return; // Exit if failed to fetch the index
      }

      const db = getFirestore();

      // Reference to the main document where you want to log the creation time
      const mainDocRef = doc(db, 'Quiz', 'Asset Market Simulations', 'Simulations', `Simulation ${simulationIndex}`);
      const controlsDocRef = doc(db, 'Quiz', 'Asset Market Simulations', 'Simulations', `Simulation ${simulationIndex}`, 'Simulation Controls', 'Controls');

      // Data to initialize the main simulation document with the current timestamp
      const mainData = {
        createdAt: new Date() // Stores current date and time
      };

      // Prepare the data to update, directly including the events from the component's state
      const controlsData = {
        years: this.years,
        assetChanges: this.assetChanges,
        events: this.events // Directly use the updated events object
      };

      try {
        // First, set the creation date in the main document
        await setDoc(mainDocRef, mainData);

        // Then, set the controls data in the specific 'Controls' document
        await setDoc(controlsDocRef, controlsData);

        console.log('All changes, including events, have been saved to Firestore');
        this.showConfirmationModalWithMessage('Data has been successfully saved.');
      } catch (error) {
        console.error('Error saving data to Firestore:', error);
        this.showConfirmationModalWithMessage('Error: Failed to save data.');
      }
    },

    showConfirmationModalWithMessage(message) {
      this.confirmationMessage = message;
      this.showConfirmationModal = true;
    },

    closeConfirmationModal() {
      this.showConfirmationModal = false;
    },

    getColorForYear(index) {
      // Generate a color based on the year index
      const hue = (index * 137) % 360; // Use a simple algorithm to generate a hue
      return `hsl(${hue}, 70%, 80%)`; // Return a light color with moderate saturation
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.processUploadedData(jsonData);
      };
      reader.readAsBinaryString(file);
    },

    processUploadedData(data) {
      data.shift(); // Remove header row
      
      // Determine the unique years from the data to establish the total number of years
      const uniqueYears = new Set();
      data.forEach(row => {
        const yearMatch = row[0].match(/\d+/);
        if (yearMatch) {
          uniqueYears.add(yearMatch[0]);
        }
      });
      const yearsCount = uniqueYears.size;

      // Initialize asset changes structure with the new years count if it changed
      if (this.years !== yearsCount) {
        this.years = yearsCount; // This will trigger the watcher to reinitialize assetChanges
        this.$nextTick(() => {
          this.populateAssetChangesWithData(data);
        });
      } else {
        this.populateAssetChangesWithData(data);
      }
    },

    populateAssetChangesWithData(data) {
      // Clear existing data in assetChanges
      this.initializeAssetChanges(this.years);

      // Populate assetChanges with the data
      data.forEach(row => {
        const yearMatch = row[0].match(/\d+/);
        const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
        const quarter = this.quarters.includes(row[1]) ? row[1] : null;
        if (year === null || quarter === null) return;

        this.assets.forEach((asset, index) => {
          let value = row[index + 2]; // Adjust if assets start at a different column
          if (!isNaN(parseFloat(value)) && isFinite(value)) {
            this.assetChanges[year - 1][quarter][asset] = parseFloat(value);
          }
        });
      });
    },

    quarterClicked(yearIndex, quarter) {
      this.selectedYear = yearIndex;
      this.selectedQuarter = quarter;
      this.eventName = '';
      this.eventDescription = '';
      this.showEventModal = true;
    },

    closeEventModal() {
      this.showEventModal = false;
    },

    saveEvent() {
      // Update the events object in the local state
      if (!this.events[this.selectedYear]) {
        this.events[this.selectedYear] = {};
      }
      this.events[this.selectedYear][this.selectedQuarter] = {
        name: this.eventName,
        description: this.eventDescription
      };

      // Log for confirmation and close the modal
      console.log('Event added to local state');
      this.closeEventModal();
    },

    generateRandomValues() {
      this.assetChanges.forEach(yearData => {
        Object.keys(yearData).forEach(quarter => {
          this.assets.forEach(asset => {
            yearData[quarter][asset] = this.getRandomNumber();
          });
        });
      });
    },

    getRandomNumber() {
      return parseFloat((Math.random() * 20 - 10).toFixed(2));
    },

    toggleEventList() {
      this.showEventList = !this.showEventList;
    },

    editEvent(year, quarter) {
      const event = this.events[year][quarter];
      if (event) {
        this.selectedYear = year;
        this.selectedQuarter = quarter;
        this.eventName = event.name;
        this.eventDescription = event.description;
        this.showEventModal = true;
      }
    },

    deleteEvent(year, quarter) {
      if (confirm(`Are you sure you want to delete the event for ${quarter} of year ${year}?`)) {
        delete this.events[year][quarter];
        if (Object.keys(this.events[year]).length === 0) {
          delete this.events[year]; // If no events left for the year, delete the year object
        }
        this.events = { ...this.events };
        console.log(`Event for ${quarter} of year ${year} deleted`);
      }
    }
  },
  computed: {
    totalYears() {
      return Array.from({ length: this.years }, (_, i) => i + 1);
    }
  },
  created() {
    this.initializeAssetChanges(this.years);
  },
};
</script>

<style scoped>
@import url('../../styles/SimulationControlsStyles.css');

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}
</style>
