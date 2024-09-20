<template>
  <div class="home-screen">
    <!-- Header -->
    <header class="header">
      <h1 class="header-title">Life Smart</h1>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="button-container">
        <button @click="startQuiz" class="button start-quiz-button">Start Quiz</button>
        <button @click="startSimulation" class="button start-simulation-button">
          Start Simulation Without Quiz
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p class="footer-text">© 2024 Our App. All rights reserved.</p>
    </footer>
  </div>
</template>

  
<script>
import { useRouter } from 'vue-router';

export default {
  name: 'HomeScreen',
  setup() {
    const router = useRouter();

    const startQuiz = () => {
      router.push({ name: 'QuizLanding' }); // Replace with actual route
    };

    const startSimulation = () => {
      router.push({ name: 'Simulation' }); // Replace with actual route
    };

    return {
      startQuiz,
      startSimulation,
    };
  },
};
</script>

  
<style scoped>
/* Home Screen Layout */
.home-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(circle, rgba(58,117,196,1) 0%, rgba(25,37,71,1) 100%); /* Fancy Gradient Background */
  color: #ffffff;
  font-family: 'Poppins', sans-serif; /* Modern Font */
  position: relative;
  overflow: hidden;
}

/* Header */
.header {
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(5px); /* Glassmorphism Effect */
}

.header-title {
  margin: 0;
  font-size: 3rem;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

/* Main Content */
.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1;
}

.button {
  padding: 15px 40px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(135deg, #42a5f5, #478ed1);
  border: none;
  border-radius: 30px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  backdrop-filter: blur(4px);
  background-size: 200% 200%;
  position: relative;
}

.button:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.4);
  background-position: right center;
}

.start-quiz-button {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
}

.start-simulation-button {
  background: linear-gradient(135deg, #ff6a00, #ee0979);
}

/* Footer */
.footer {
  background: rgba(40, 53, 147, 0.8); /* Transparent footer with glassmorphism */
  padding: 10px;
  text-align: center;
  backdrop-filter: blur(5px);
}

.footer-text {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Floating Elements (for decoration) */
.home-screen::before,
.home-screen::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  filter: blur(60px);
  width: 400px;
  height: 400px;
  border-radius: 50%;
  animation: float 10s ease-in-out infinite;
}

.home-screen::before {
  top: -100px;
  left: -100px;
}

.home-screen::after {
  bottom: -100px;
  right: -100px;
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-30px) translateX(30px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}
</style>
