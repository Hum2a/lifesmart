// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeScreen from '../components/screens/HomeScreen.vue';
import QuizLandingPage from '../components/screens/quiz/QuizLandingPage.vue';
import FinancialQuiz from '../components/screens/quiz/FinancialQuiz.vue'; // Import the new component

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
