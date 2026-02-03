// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD479DxywucfQkpvYJf7Imkt6y4Z4zc2kQ",
  authDomain: "between-the-pages-ce2ec.firebaseapp.com",
  projectId: "between-the-pages-ce2ec",
  storageBucket: "between-the-pages-ce2ec.appspot.com",
  messagingSenderId: "484810246963",
  appId: "1:484810246963:web:ca89001f441850b0f88c46"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Function to auto login - wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-button");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const provider = new GoogleAuthProvider();
      
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          const name = user.displayName || "User";
          
          // Save name for personalization
          localStorage.setItem("username", name);
           
          window.location.href = "bookshelf.html";
          
        })
        .catch((err) => {
          console.error("Sign-in error:", err);
          console.error("Error code:", err.code);
          console.error("Error message:", err.message);
          alert("Login failed — " + err.message);
        });
    });
  }
});