// --- Responsive Books Data ---
const books = [
  {
    id: "book1",
    title: "A Legacy of Damage",
    cover: "MJOHANNES.png",
    chapters: [
      `As l drag my suitcase on the gravel road that leads from our house. I was in a hurry, I had to leave now before my mother changed her mind. But, a memory that l had plunged deep in my sub-consciousness chose to surface just at that time. <em>Seven-year-old me holding a knife to my chest and ready to plunge it through my heart and end I all. It was blunt, and the trip to sharpening it against a rock would have earned me questions from my mother who was stripping down the clothes l had washed into the dirt because they were not clean enough. Coward, couldn’t even bring myself to be seen sharpening a knife by my mother because that’s how much she scared me.</em>Another mind drifted to when l obsessed over our pictures looking for similarities, l hoped l had been the case of those kids who were switched at birth  by those nurses who did it for fun and especially when they didn’t like you. But even that, was a dead end because l was light in complexion like her, flat tummy, big breast and a generous behind. I was my mother’s daughter alright. I looked at our joined core house one last time, dug a little hole like my mother used to force me whenever l did anything new she didn’t like which was almost always and spit in it, but this time to swear never to step foot into this house again.`
      // Add more chapters/pages here as needed
    ],
    published: true,
  },
  {
    id: "book2",
    title: "Coming Soon",
    cover:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    chapters: [],
    published: false,
  },
  {
    id: "book3",
    title: "Coming Soon",
    cover:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    chapters: [],
    published: false,
  },
];

// --- Render Books ---
const booksGrid = document.getElementById("booksGrid");
booksGrid.innerHTML = ""; // Clear any existing content

books.forEach((book, i) => {
  const card = document.createElement("div");
  card.className = "book-card" + (book.published ? "" : " disabled");
  card.id = book.id;
  card.innerHTML = `
    ${
      !book.published
        ? '<div class="not-published">Not Published Yet</div>'
        : ""
    }
    <img src="${book.cover}" alt="${book.title}" class="book-image" />
    <h3>${book.title}</h3>
    <p>${
      book.published
        ? "A powerful tale of struggle and hope."
        : "Stay tuned for " + (i === 1 ? "the next release." : "future stories.")
    }</p>
  `;
  if (book.published) {
    card.addEventListener("click", () => openReader(book.id));
  }
  booksGrid.appendChild(card);
});

// --- Responsive Grid for Mobile ---
function adjustGridColumns() {
  if (window.innerWidth <= 600) {
    booksGrid.style.gridTemplateColumns = "1fr";
  } else {
    booksGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
  }
}
window.addEventListener("resize", adjustGridColumns);
adjustGridColumns(); // Initial call

// --- Menu Dropdown ---
const menuBtn = document.getElementById("menuBtn");
const dropdown = document.getElementById("dropdown");
menuBtn.addEventListener("click", function () {
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});
window.addEventListener("click", function (e) {
  if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

// --- Reader Modal Logic ---
const readerModal = document.getElementById("readerModal");
const closeReader = document.getElementById("closeReader");
const bookTitle = document.getElementById("bookTitle");
const chapterContent = document.getElementById("chapterContent");
const prevChapter = document.getElementById("prevChapter");
const nextChapter = document.getElementById("nextChapter");
const continueBtn = document.getElementById("continueBtn");
const adContainer = document.getElementById("adContainer");

let currentBook = null;
let currentChapter = 0;

function openReader(bookId) {
  currentBook = books.find((b) => b.id === bookId);
  currentChapter = 0;
  readerModal.style.display = "block";
  showChapter(currentChapter);

  // Continue button logic (if previously left off)
  const saved = localStorage.getItem("progress_" + bookId);
  if (saved && parseInt(saved) > 0) {
    continueBtn.style.display = "";
    continueBtn.onclick = function () {
      showChapter(parseInt(saved));
      continueBtn.style.display = "none";
    };
  } else {
    continueBtn.style.display = "none";
  }
}

// Show chapter and AdSense ad every 3 pages
function showChapter(chapterIndex) {
  if (!currentBook || !currentBook.chapters.length) return;
  currentChapter = chapterIndex;
  bookTitle.textContent =
    currentBook.title +
    " — Page " +
    (currentChapter + 1) +
    " of " +
    currentBook.chapters.length;
  chapterContent.innerHTML = currentBook.chapters[currentChapter];
  localStorage.setItem("progress_" + currentBook.id, currentChapter);

  // Show ad after every 3 chapters (on 3, 6, ...)
  if ((chapterIndex + 1) % 3 === 0) {
    adContainer.style.display = "block";
    if (window.adsbygoogle) {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // AdSense might throw if already initialized
      }
    }
  } else {
    adContainer.style.display = "none";
  }

  prevChapter.disabled = chapterIndex === 0;
  nextChapter.disabled = chapterIndex === currentBook.chapters.length - 1;

  continueBtn.style.display = chapterIndex > 0 ? "inline-block" : "none";
}

prevChapter.addEventListener("click", function () {
  if (currentBook && currentChapter > 0) {
    showChapter(currentChapter - 1);
  }
});

nextChapter.addEventListener("click", function () {
  if (currentBook && currentChapter < currentBook.chapters.length - 1) {
    showChapter(currentChapter + 1);
  }
});

closeReader.addEventListener("click", function () {
  readerModal.style.display = "none";
  currentBook = null;
});

window.onclick = function (event) {
  if (event.target === readerModal) {
    readerModal.style.display = "none";
    currentBook = null;
  }
};

let touchStartX = null;
chapterContent.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});
chapterContent.addEventListener("touchend", (e) => {
  if (!touchStartX) return;
  let touchEndX = e.changedTouches[0].clientX;
  if (touchEndX - touchStartX > 60 && currentChapter > 0) {
    showChapter(currentChapter - 1);
  } else if (touchStartX - touchEndX > 60 && currentChapter < currentBook.chapters.length - 1) {
    showChapter(currentChapter + 1);
  }
  touchStartX = null;
});
