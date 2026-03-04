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


/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Settings modal logic
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const settingsBtn = document.getElementById("settings-button");
const settingsModal = document.getElementById("settings-modal");
const closeSettingsModal = document.getElementById("close-settings-modal");
const closeSettingsModalAlt = document.getElementById("close-s-modal");

settingsBtn.addEventListener("click", () => {
  settingsModal.classList.remove("hidden");
});

closeSettingsModal.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

closeSettingsModalAlt.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Color theme button listeners
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
document.getElementById("default").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#d4d4d4" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#7aa6dd"
  );
  if (newBtn) newBtn.style.backgroundColor = "#f0f0f0";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#ffffff"
  );
  await saveDashboard(auth.currentUser.uid);
});

document.getElementById("blue").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#638dd5" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#549ddd"
  );
  if (newBtn) newBtn.style.backgroundColor = "#638dd5";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#7da0ddb4"
  );
  await saveDashboard(auth.currentUser.uid);
});

document.getElementById("green").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#416e57" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#6cb485"
  );
  if (newBtn) newBtn.style.backgroundColor = "#416e57";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#508268b4"
  );
  await saveDashboard(auth.currentUser.uid);
});

document.getElementById("red").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#970404" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#e73838"
  );
  if (newBtn) newBtn.style.backgroundColor = "#970404";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#970404b4"
  );
  await saveDashboard(auth.currentUser.uid);
});

document.getElementById("purple").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#7546a2" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#8353c8"
  );
  if (newBtn) newBtn.style.backgroundColor = "#7546a2";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#7546a2b4"
  );
  await saveDashboard(auth.currentUser.uid);
});

document.getElementById("orange").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#ea8118" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#f8a74b"
  );
  if (newBtn) newBtn.style.backgroundColor = "#ea8118";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#fbae62e8"
  );
  await saveDashboard(auth.currentUser.uid);
});

document.getElementById("pink").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#f155a0" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#f289c6"
  );
  if (newBtn) newBtn.style.backgroundColor = "#f155a0";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#f6a8ce"
  );
  await saveDashboard(auth.currentUser.uid);
});

document.getElementById("gray").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#6d6d6d" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#838383"
  );
  if (newBtn) newBtn.style.backgroundColor = "#6d6d6d";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#c2c2c2"
  );
  await saveDashboard(auth.currentUser.uid);
});

document.getElementById("brown").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#935c50" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#7a5a5a"
  );
  if (newBtn) newBtn.style.backgroundColor = "#935c50";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#935c50b4"
  );
  await saveDashboard(auth.currentUser.uid);
});

document.getElementById("yellow").addEventListener("click", async () => {
  document.documentElement.style.setProperty(
    "--panel-bg",
    "#ebcb48" // pick any color
  );
  document.documentElement.style.setProperty(
    "--button-color",
    "#fcd677"
  );
  if (newBtn) newBtn.style.backgroundColor = "#ebcb48";
  // also change html background to match the new theme
  document.documentElement.style.setProperty(
    "--bg-color",
    "#ede0a9"
  );
  await saveDashboard(auth.currentUser.uid);
});

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// font style button listeners
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
document.getElementById("default-f").addEventListener("click", () => {
  document.documentElement.style.setProperty("--global-font", "'Indie Flower', cursive");
});

document.getElementById("share-tech-mono-f").addEventListener("click", () => {
  document.documentElement.style.setProperty("--global-font", "'Share Tech Mono', monospace");
});

document.getElementById("arial-f").addEventListener("click", () => {
  document.documentElement.style.setProperty("--global-font", "Arial, sans-serif");
});

document.getElementById("verdana-f").addEventListener("click", () => {
  document.documentElement.style.setProperty("--global-font", "Verdana, sans-serif");
});

document.getElementById("times-new-roman-f").addEventListener("click", () => {
  document.documentElement.style.setProperty("--global-font", "'Times New Roman', serif");
});

document.getElementById("playpen-sans-f").addEventListener("click", () => {
  document.documentElement.style.setProperty("--global-font", "'Playpen Sans', sans-serif");
});

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Profile modal logic
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const profileBtn = document.getElementById("profile-pic");
const profileModal = document.getElementById("profile-modal");
const closeProfileModal = document.getElementById("close-profile-modal");
const closeProfileModalAlt = document.getElementById("close-p-modal");

profileBtn.addEventListener("click", () => {
  profileModal.classList.remove("hidden");
});

closeProfileModal.addEventListener("click", () => {
  profileModal.classList.add("hidden");
});

closeProfileModalAlt.addEventListener("click", () => {
  profileModal.classList.add("hidden");
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    console.log(user);

    const name = user.displayName;
    const photo = user.photoURL;
    const email = user.email;

    const usernameEl = document.getElementById("profile-username");
    const profilePicEl = document.getElementById("profile-pic-large");
    const emailEl = document.getElementById("profile-email");

    if (emailEl) {
      emailEl.textContent = email || "No email provided";
    }

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

  // user log out logic
  const logoutBtn = document.getElementById("logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if(confirm('Are you sure you want to log out?')) {
      signOut(auth).then(() => {
        window.location.href = "index.html";
      });
    }
    });
  }
});