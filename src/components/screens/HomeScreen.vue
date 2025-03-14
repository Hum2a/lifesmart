<template>
  <div class="auth-screen">
    <!-- Header -->
    <header class="header">
      <h1 class="header-title">Life Smart</h1>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="button-container" v-if="!showForm">
        <button @click="showSignInForm" class="button sign-in-button">Sign In</button>
        <button @click="showRegisterForm" class="button register-button">Register</button>
      </div>

      <form v-if="showForm" @submit.prevent="handleFormSubmit" class="auth-form">
        <h2>{{ isSignInMode ? 'Sign In' : 'Register' }}</h2>
        <input
          type="email"
          v-model="email"
          placeholder="Enter your email"
          required
          class="form-input"
        />
        <input
          type="password"
          v-model="password"
          placeholder="Enter your password"
          required
          class="form-input"
        />
        <input
          v-if="!isSignInMode"
          type="password"
          v-model="confirmPassword"
          placeholder="Confirm your password"
          required
          class="form-input"
        />
        <button type="submit" class="form-button">
          {{ isSignInMode ? 'Sign In' : 'Register' }}
        </button>
        <button type="button" @click="closeForm" class="close-form-button">
          Cancel
        </button>
      </form>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p class="footer-text">© 2024 Life Smart. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { firebaseAuth } from "@/firebase/initFirebase"; // Import Firebase Auth instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router"; // Import Vue Router

export default {
  name: "AuthScreen",
  data() {
    return {
      showForm: false,
      isSignInMode: true, // Determines if the form is for Sign-In or Register
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  setup() {
    const router = useRouter(); // Setup Vue Router
    return { router };
  },
  methods: {
    showSignInForm() {
      this.isSignInMode = true;
      this.showForm = true;
    },
    showRegisterForm() {
      this.isSignInMode = false;
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
    },
    async handleFormSubmit() {
      if (!this.isSignInMode && this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        if (this.isSignInMode) {
          // Handle Sign-In
          const userCredential = await signInWithEmailAndPassword(firebaseAuth, this.email, this.password);
          console.log("Signed in user:", userCredential.user);
          alert("Sign-In successful!");
          this.router.push({ name: "QuizLanding" }); // Redirect to QuizLanding
        } else {
          // Handle Register
          const userCredential = await createUserWithEmailAndPassword(firebaseAuth, this.email, this.password);
          console.log("Registered user:", userCredential.user);
          alert("Registration successful!");
          this.router.push({ name: "QuizLanding" }); // Redirect to QuizLanding after registration
        }
        this.closeForm();
      } catch (error) {
        console.error("Authentication error:", error.message);
        alert(error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Same CSS as before */
.auth-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(circle, rgba(58, 117, 196, 1) 0%, rgba(25, 37, 71, 1) 100%);
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  position: relative;
  overflow: hidden;
}

.header {
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(5px);
}

.header-title {
  margin: 0;
  font-size: 3rem;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

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
}

.button:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.4);
}

.sign-in-button {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
}

.register-button {
  background: linear-gradient(135deg, #ff6a00, #ee0979);
}

.footer {
  background: rgba(40, 53, 147, 0.8);
  padding: 10px;
  text-align: center;
  backdrop-filter: blur(5px);
}

.footer-text {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.auth-form {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.auth-form h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-button {
  width: 100%;
  padding: 10px;
  background: #478ed1;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.form-button:hover {
  background: #357ac4;
}

.close-form-button {
  background: #ff5252;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.close-form-button:hover {
  background: #ff1744;
}
</style>
