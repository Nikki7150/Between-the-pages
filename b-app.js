/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Import the functions you need from the SDKs you need
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth , onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

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

import { 
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";


// Initialize Firebase again
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is logged in
    await loadDashboard(user.uid);
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
// Function to save the dashboard state to Firestore
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
async function saveDashboard(userId) {
  try {
    const ref = doc(db, "users", userId);

    await setDoc(ref, {
      books: books
    }, { merge: true });

    console.log("Dashboard saved");
  } catch (err) {
    console.error("Error saving dashboard:", err);
  }
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Function to load the dashboard state from Firestore
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
async function loadDashboard(userId) {
  try {
    const ref = doc(db, "users", userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    if (data.books) {
      books.length = 0; // clear current
      books.push(...data.books);
      renderBookshelf();
    }

  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Bookshelf Functionality
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const books = [];

const bookshelfEl = document.getElementById("bookshelf");

function renderBookshelf() {

  bookshelfEl.innerHTML = "";

  const shelfWidth = bookshelfEl.clientWidth;

  let shelf = document.createElement("div");
  shelf.className = "shelf";

  let currentWidth = 0;
  const gap = 4;

  books.forEach(item => {

    if (!item.type) {
      item.type = "book"; // default old saved books
    }

    let itemWidth;
    let itemHeight;
    let itemEl;

    if (item.type === "book") {
      itemWidth = getBookWidth(item.pages);
      itemHeight = getBookHeight(item.genre);
    }

    else if (item.type === "trinket") {
      itemWidth = item.width || 60;
      itemHeight = item.height || 180;
    }

    // if item doesn't fit, create new shelf
    if (currentWidth + itemWidth > shelfWidth) {
      bookshelfEl.appendChild(shelf);

      shelf = document.createElement("div");
      shelf.className = "shelf";

      currentWidth = 0;
    }

    if (item.type === "book") {

      itemEl = document.createElement("div");
      itemEl.className = "book";

      itemEl.style.width = itemWidth + "px";
      itemEl.style.height = itemHeight + "px";
      itemEl.style.backgroundColor = item.color || "#e8e8e8";

      itemEl.innerHTML = `
        <div class="spine">${item.title}</div>
      `;

      itemEl.addEventListener("click", () => {
        openBook(item);
      });

    }

    else if (item.type === "trinket") {

      itemEl = document.createElement("div");
      itemEl.className = "trinket";

      itemEl.style.width = item.width + "px";
      itemEl.style.height = item.height + "px";

      itemEl.innerHTML = `<img src="${item.image}" />`;

      // save resize
      const observer = new ResizeObserver(entries => {

        const rect = entries[0].contentRect;

        item.width = rect.width;
        item.height = rect.height;

        saveDashboard(auth.currentUser.uid);

      });
      
      observer.observe(itemEl);

    }
    if (!itemEl) return;

    shelf.appendChild(itemEl);
    currentWidth += itemWidth + gap;

  });

  bookshelfEl.appendChild(shelf);
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Add book button logic
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
document.getElementById("add-book-button").addEventListener("click", async () => {
  const newBook = {
    id: crypto.randomUUID(),
    type: "book",
    title: "",
    author: "",
    pages: 0,
    rating: null,
    notes: "",
    cover: null,
    color: "#e8e8e8"
  };

  books.push(newBook);
  renderBookshelf();
  await saveDashboard(auth.currentUser.uid);
});

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Add trtinkets logic 
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
document.getElementById("add-trinkets").addEventListener("click", async () => {

  books.push(newTrinket);
  renderBookshelf();
  saveDashboard(auth.currentUser.uid);
});


/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Stars rating logic
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Access all radio buttons
const stars = document.querySelectorAll('.rating input');
const output = document.getElementById('output');

// Add event listener to each radio button
stars.forEach(star => {
    star.addEventListener('click', () => {
        const ratingValue = star.value;
        output.innerText = `Rating is: ${ratingValue}/5`;
        // Here you can add logic to send the rating to your server
    });
});


/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Book details modal logic
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const bookModal = document.getElementById("book-modal");
const bookModalContent = document.getElementById("book-modal-content");
const closeBookModal = document.getElementById("close-book-modal");

function hideBookModal() {
  bookModalContent.classList.remove("remove");
  bookModal.classList.add("hidden");
}

function closeBookModalWithAnimation() {
  const handleAnimationEnd = () => {
    bookModalContent.removeEventListener("animationend", handleAnimationEnd);
    hideBookModal();
  };

  bookModalContent.addEventListener("animationend", handleAnimationEnd);
  bookModalContent.classList.add("remove");
}

closeBookModal.addEventListener("click", () => {
  closeBookModalWithAnimation();
});

const deleteBookButton = document.getElementById("delete-book-button");

deleteBookButton.addEventListener("click", async () => {
  if (!activeBook) return;
  
  if (confirm(`Are you sure you want to delete "${activeBook.title}"?`)) {
    const bookIndex = books.findIndex(b => b.id === activeBook.id);
    
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      renderBookshelf();
      await saveDashboard(auth.currentUser.uid);
      
      const handleAnimationEnd = () => {
        bookModalContent.removeEventListener("animationend", handleAnimationEnd);
        hideBookModal();
        activeBook = null;
      };

      bookModalContent.addEventListener("animationend", handleAnimationEnd);
      bookModalContent.classList.add("remove");
    }
  }
});

let activeBook = null;
let saveBookNotesListener = null;

function openBook(book) {
  activeBook = book;

  document.getElementById("book-title").value = book.title;
  document.getElementById("book-author").value = book.author;
  document.getElementById("book-notes").value = book.notes;
  if (book.rating) {
    const star = document.querySelector(`.rating input[value="${book.rating}"]`);
    if (star) star.checked = true;
  }
  document.getElementById("output").innerText = `Rating is: ${book.rating || 0}/5`;
  document.getElementById("color").value = book.color || "#e8e8e8";
  document.getElementById("genre-button").innerText = book.genre || "Select Genre";
  const coverPreviewEl = document.getElementById("book-cover-preview");
  const uploadCoverButtonEl = document.getElementById("upload-cover-button");

  if (book.cover) {
    coverPreviewEl.style.backgroundImage = `url(${book.cover})`;
    coverPreviewEl.style.backgroundSize = "cover";
    coverPreviewEl.style.backgroundPosition = "center";
    uploadCoverButtonEl.style.display = "none";
  } else {
    coverPreviewEl.style.backgroundImage = "none";
    uploadCoverButtonEl.style.display = "block";
  }
  document.getElementById("book-pages").value = book.pages || "";

  // Remove old listener before adding new one to prevent stacking
  const saveBookNotesBtn = document.getElementById("save-book-notes");
  if (saveBookNotesListener) {
    saveBookNotesBtn.removeEventListener("click", saveBookNotesListener);
  }

  saveBookNotesListener = async () => {
    if (!activeBook) return;

    activeBook.title = document.getElementById("book-title").value;
    activeBook.author = document.getElementById("book-author").value;
    activeBook.pages = Number(document.getElementById("book-pages").value);
    activeBook.notes = document.getElementById("book-notes").value;
    activeBook.color = document.getElementById("color").value;

    const selectedStar = document.querySelector(".rating input:checked");
    activeBook.rating = selectedStar ? selectedStar.value : null;

    renderBookshelf();
    await saveDashboard(auth.currentUser.uid);
    genres.classList.add("hidden");

    hideBookModal();
  };

  saveBookNotesBtn.addEventListener("click", saveBookNotesListener);

  bookModalContent.classList.remove("remove");
  bookModal.classList.remove("hidden");
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// change color of book logic
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const colorInput = document.getElementById("color");

colorInput.addEventListener("input", async (e) => {
  if (!activeBook) return;

  const color = e.target.value;
  activeBook.color = color;

  renderBookshelf();
  await saveDashboard(auth.currentUser.uid);
});

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// saving book cover logic
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const uploadButton = document.getElementById("upload-cover-button");
const coverPreview = document.getElementById("book-cover-preview");

uploadButton.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file || !activeBook) return;

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const extension = file.name.split(".").pop() || "jpg";
      const storagePath = `users/${uid}/book-covers/${activeBook.id}.${extension}`;
      const fileRef = ref(storage, storagePath);

      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);

      activeBook.cover = downloadUrl;
      coverPreview.style.backgroundImage = `url(${downloadUrl})`;
      coverPreview.style.backgroundSize = "cover";
      coverPreview.style.backgroundPosition = "center";
      uploadButton.style.display = "none";

      renderBookshelf();
      await saveDashboard(uid);
    } catch (err) {
      console.error("Error uploading cover:", err);
      alert("Couldn't upload cover. Please try again.");
    }
  });

  input.click();
});

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// Genre selection logic 
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const genreButton = document.getElementById("genre-button");
const genres = document.getElementById("genre-popup");
const customGenreInput = document.getElementById("custom-genre-input");

function toggleGenrePopup() {
  if (!activeBook) {
    console.warn("No active book when trying to open genre popup");
    return;
  }

  const isHidden = genres.classList.contains("hidden");
  
  if (isHidden) {
    genres.classList.remove("hidden");
    genres.style.visibility = "visible";
    genres.style.pointerEvents = "auto";
    // Position popup relative to the genre button
    const rect = genreButton.getBoundingClientRect();
    genres.style.top = `${rect.bottom + window.scrollY + 8}px`;
    genres.style.left = `${rect.left + window.scrollX}px`;
  } else {
    genres.classList.add("hidden");
    genres.style.visibility = "hidden";
    genres.style.pointerEvents = "none";
  }
}

genreButton.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleGenrePopup();
});

// Close genre popup when clicking outside
document.addEventListener("click", (e) => {
  if (!genres.classList.contains("hidden") && 
      !genres.contains(e.target) && 
      e.target !== genreButton) {
    genres.classList.add("hidden");
  }
});

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Add event listeners to genre options
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
genres.addEventListener("click", async (event) => {
  const target = event.target;

  if (!activeBook) return;

  if (target.tagName === "BUTTON" && target.id !== "genre-button") {
    const genre = target.textContent.trim();
    activeBook.genre = genre;
    genreButton.textContent = genre;

    renderBookshelf();
    await saveDashboard(auth.currentUser.uid);
    genres.classList.add("hidden");
  }
});

customGenreInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  if (!activeBook) return;

  const genre = customGenreInput.value.trim();
  if (!genre) return;

  activeBook.genre = genre;
  genreButton.textContent = genre;
  customGenreInput.value = "";

  renderBookshelf();
  await saveDashboard(auth.currentUser.uid);
  genres.classList.add("hidden");
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// change height of books based on pages
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
function getBookHeight(genre) {
  if (!genre) return 180; // default height
  const genreHeights = {
    "Fantasy": 210,
    "Science Fiction": 205,
    "Mystery": 200,
    "Romance": 195,
    "Horror": 190,
    "Non-Fiction": 185,
    "Historical": 180,
    "Thriller": 175,
    "Young Adult": 170,
    "Children's": 165,
    "Memoir": 160,
    "Self Help": 155,
    "Literary Fiction": 150,
    "True Crime": 145
  };

  return genreHeights[genre] || 180; // default height if genre not found
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// change width of books based on pages
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
function getBookWidth(pages) {
  if (!pages) return 16; // default width

  const width = Math.ceil(pages / 100) * 16;

  return Math.min(width, 160); // cap max width at 160px
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// change font size of spine text based on book height and width
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function getSpineFontSize(width, height) {
  // base size from both dimensions
  const sizeFromWidth = width * 0.28;
  const sizeFromHeight = height * 0.08;

  // use the smaller one so text still fits
  const fontSize = Math.min(sizeFromWidth, sizeFromHeight);

  // keep it readable, but not ridiculous
  return Math.max(10, Math.min(fontSize, 22));
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// open trinkets popup logic
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const trinketsBtn = document.getElementById("add-trinkets");
const trinketsPopup = document.getElementById("trinkets-popup");  
trinketsBtn.addEventListener("click", () => {
  if (trinketsPopup.style.display === "block") {
    trinketsPopup.style.display = "none";
  } else {
    trinketsPopup.style.display = "block";
    const rect = trinketsBtn.getBoundingClientRect();
    trinketsPopup.style.top = `${rect.bottom + window.scrollY}px`;
    trinketsPopup.style.left = `${rect.left + window.scrollX}px`;
  }
});

// close trinkets popup when clicking outside
document.addEventListener("click", (e) => {
  if (!trinketsPopup.contains(e.target) && e.target !== trinketsBtn) {
    trinketsPopup.style.display = "none";
  }
});

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// custom trinket button logic
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
const customTrinket = document.getElementById("custom-trinket");

customTrinket.addEventListener("click", () => {
  // open computer's file explorer to select an image for the trinket
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // when the file is loaded, create a new trinket and add the picture in the bookshelf instead of a book
    reader.onload = function(event) {
      const base64Image = event.target.result;

      const newTrinket = {
        id: crypto.randomUUID(),
        type: "trinket",
        image: base64Image,
        width: 60,
        height: 60
      };

      books.push(newTrinket);
      renderBookshelf();
      saveDashboard(auth.currentUser.uid);
    };

    reader.readAsDataURL(file);

  });

  input.click();
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

const deleteAllBooksBtn = document.getElementById("delete-all-books");

deleteAllBooksBtn.addEventListener("click", async () => {
  if (books.length === 0) {
    alert("No books to delete!");
    return;
  }

  if (confirm(`Are you sure you want to delete ALL ${books.length} book(s)? This cannot be undone!`)) {
    books.length = 0; // Clear the books array
    renderBookshelf();
    await saveDashboard(auth.currentUser.uid);
    settingsModal.classList.add("hidden");
    alert("All books have been deleted.");
  }
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

function openProfileModal() {
  if (!profileModal) return;
  profileModal.classList.remove("hidden");
}

if (profileBtn) {
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openProfileModal();
  });
} else {
  alert("Profile button not found! Profile modal won't work.");
}

document.addEventListener("click", (e) => {
  if (e.target.closest && e.target.closest("#profile-pic")) {
    openProfileModal();
  }
});

if (closeProfileModal) {
  closeProfileModal.addEventListener("click", () => {
    if (profileModal) {
      profileModal.classList.add("hidden");
    }
  });
}

if (closeProfileModalAlt) {
  closeProfileModalAlt.addEventListener("click", () => {
    if (profileModal) {
      profileModal.classList.add("hidden");
    }
  });
}

// Close profile modal when clicking outside
document.addEventListener("click", (e) => {
  if (profileModal && 
      !profileModal.classList.contains("hidden") && 
      !profileModal.contains(e.target) && 
      e.target !== profileBtn) {
    profileModal.classList.add("hidden");
  }
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