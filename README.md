# LifeSmart: Financial Education & Investment Simulation Tool

![Vue.js](https://img.shields.io/badge/Vue.js-3.2.13-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.13.1-FFCA28?style=flat&logo=firebase&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.4-FF6384?style=flat&logo=chart.js&logoColor=white)

A financial education platform featuring interactive quizzes and investment simulations to help users learn about personal finance and investment strategies.

## 🚀 Features

- **Interactive Financial Quizzes**: Test and improve your financial knowledge
- **Team-based Gameplay**: Create teams for collaborative learning
- **Investment Simulator**: Practice investment strategies without real-world risk
- **Investment Calculator**: Calculate potential returns based on different investment strategies
- **Dynamic Data Visualization**: View your simulation results with interactive charts

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## 🛠️ Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/lifesmart.git
cd lifesmart
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Add your Firebase configuration in `src/firebase/initFirebase.js`

4. Run the development server
```bash
npm run serve
```

5. Open your browser and navigate to `http://localhost:8080`

## 📦 Build for Production

```bash
npm run build
```

## 🧪 Testing

```bash
npm run lint
```

## 🔧 Technologies

- **Frontend**: Vue.js 3, Vue Router
- **Backend**: Firebase (Authentication, Firestore, Realtime Database)
- **Data Visualization**: Chart.js with annotation plugin
- **Tooling**: Vue CLI, Babel, ESLint

## 🗂️ Project Structure

```
lifesmart/
├── public/            # Static files
├── src/               # Source files
│   ├── assets/        # Assets (images, fonts, etc.)
│   ├── components/    # Vue components
│   │   └── screens/   # Main application screens
│   │       ├── quiz/         # Quiz-related components
│   │       └── simulation/   # Simulation-related components
│   ├── firebase/      # Firebase configuration and services
│   ├── router/        # Vue Router configuration
│   ├── App.vue        # Main application component
│   └── main.js        # Application entry point
└── ...
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- List anyone or any resources that helped with the project

