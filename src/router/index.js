import { createRouter, createWebHistory } from 'vue-router';
import HomeScreen from '../components/screens/HomeScreen.vue';
import QuizLandingPage from '../components/screens/quiz/QuizLandingPage.vue';
import FinancialQuiz from '../components/screens/quiz/FinancialQuiz.vue'; // Import the new component
import GroupCreation from '../components/screens/simulation/GroupCreation.vue';
import SimulationPage from '../components/screens/simulation/Simulation.vue';
import ResultsScreen from '../components/screens/simulation/ResultsScreen.vue';
import QuizSimulation from '../components/screens/simulation/QuizSimulation.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeScreen,
  },
  {
    path: '/quiz-landing',
    name: 'QuizLanding',
    component: QuizLandingPage,
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: FinancialQuiz,
    props: route => ({ teams: route.query.teams }), // Passing team names as props
  },
  {
    path: '/quiz-simulation',
    name: 'QuizSimulation',
    component: QuizSimulation,
    props: route => ({ teams: route.query.teams }), // Add this line to pass teams as props
  },
  {
    path: '/simulation',
    name: 'Simulation',
    component: GroupCreation,
  },
  {
    path: '/simulation-page',
    name: 'SimulationPage',
    component: SimulationPage
  },
  {
    path: '/simulation-results',
    name: 'SimResults',
    component: ResultsScreen,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
