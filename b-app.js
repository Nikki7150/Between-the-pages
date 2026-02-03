/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Import the functions you need from the SDKs you need
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
//  web app's Firebase configuration
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyD479DxywucfQkpvYJf7Imkt6y4Z4zc2kQ",
  authDomain: "between-the-pages-ce2ec.firebaseapp.com",
  projectId: "between-the-pages-ce2ec",
  storageBucket: "between-the-pages-ce2ec.appspot.com",
  messagingSenderId: "484810246963",
  appId: "1:484810246963:web:ca89001f441850b0f88c46"
};

// Initialize Firebase again
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    console.log(user);

    const name = user.displayName;
    const photo = user.photoURL;
    const email = user.email;

    const usernameEl = document.getElementById("username");
    const profilePicEl = document.getElementById("profile-pic");

    if (usernameEl) {
      usernameEl.textContent = name || email || "User";
    }

    if (profilePicEl && photo) {
      profilePicEl.src = photo;
      profilePicEl.alt = name || "Profile";
    }

  } else {
    // User is NOT logged in
    window.location.href = "index.html";
  }
});

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Bookshelf Functionality
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const books = [];

const bookshelfEl = document.getElementById("bookshelf");

function renderBookshelf() {
  bookshelfEl.innerHTML = "";

  if (books.length === 0) {
    bookshelfEl.classList.add("empty");
    return;
  }

  bookshelfEl.classList.remove("empty");

  books.forEach(book => {
    const bookEl = document.createElement("div");
    bookEl.className = "book";
    bookEl.innerHTML = `
      <div class="spine">${book.title}</div>
    `;

    bookshelfEl.appendChild(bookEl);
  });
}
renderBookshelf();

document.getElementById("add-book-button").addEventListener("click", () => {
  const newBook = {
    id: crypto.randomUUID(),
    title: "Untitled Book",
    author: "",
    pages: 0,
    rating: null,
    notes: "",
    cover: null
  };

  books.push(newBook);
  renderBookshelf();
});
