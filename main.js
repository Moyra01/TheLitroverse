// --- Responsive Books Data ---
const books = [
  {
    id: "book1",
    title: "A Legacy of Damage",
    cover: "MJOHANNES.png",
    chapters: [
      "Chapter 1: The Beginning<br><br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet.",
      "Chapter 2: The Damage Unfolds<br><br>Quisque eget eros nec urna gravida cursus. Suspendisse potenti.",
      "Chapter 3: The Legacy<br><br>Aliquam erat volutpat. Duis nec commodo erat, nec facilisis erat.",
      "Chapter 4: Healing<br><br>Morbi euismod, enim sed varius finibus, justo tortor cursus erat, sed pretium.",
      "Chapter 5: Hope<br><br>Nam mollis, est a rhoncus molestie, sapien massa sollicitudin quam, a dictum massa."
    ],
    published: true
  },
  {
    id: "book2",
    title: "Coming Soon",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    chapters: [],
    published: false
  },
  {
    id: "book3",
    title: "Coming Soon",
    cover: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    chapters: [],
    published: false
  }
];

// --- Render Books ---
const booksGrid = document.getElementById('booksGrid');
booksGrid.innerHTML = ""; // Clear any previous content
books.forEach((book, i) => {
  const card = document.createElement('div');
  card.className = 'book-card' + (book.published ? '' : ' disabled');
  card.id = book.id;
  card.innerHTML = `
    ${!book.published ? '<div class="not-published">Not Published Yet</div>' : ''}
    <img src="${book.cover}" alt="${book.title}" class="book-image">
    <h3>${book.title}</h3>
    <p>${book.published ? "A powerful tale of struggle and hope." : "Stay tuned for " + (i === 1 ? "the next release." : "future stories.")}</p>
  `;
  if (book.published) {
    card.addEventListener('click', () => openReader(book.id));
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
window.addEventListener('resize', adjustGridColumns);
adjustGridColumns(); // Initial call

// --- Menu Dropdown ---
const menuBtn = document.getElementById('menuBtn');
const dropdown = document.getElementById('dropdown');
menuBtn.addEventListener('click', function(){
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});
window.addEventListener('click', function(e){
  if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

// --- Reader Modal Logic ---
const readerModal = document.getElementById('readerModal');
const closeReader = document.getElementById('closeReader');
const bookTitle = document.getElementById('bookTitle');
const chapterContent = document.getElementById('chapterContent');
const prevChapter = document.getElementById('prevChapter');
const nextChapter = document.getElementById('nextChapter');
const continueBtn = document.getElementById('continueBtn');
const adContainer = document.getElementById('adContainer');

let currentBook = null;
let currentChapter = 0;

// Open modal for first book only
function openReader(bookId) {
  currentBook = books.find(b => b.id === bookId);
  currentChapter = 0;
  readerModal.style.display = 'block';
  showChapter(currentChapter);

  // Continue button logic (if previously left off)
  const saved = localStorage.getItem('progress_' + bookId);
  if (saved && parseInt(saved) > 0) {
    continueBtn.style.display = '';
    continueBtn.onclick = function() {
      showChapter(parseInt(saved));
      continueBtn.style.display = 'none';
    };
  } else {
    continueBtn.style.display = 'none';
  }
}

// Show chapter and AdSense ad every 2 pages
function showChapter(chapterIndex) {
  if (!currentBook || !currentBook.chapters.length) return;
  currentChapter = chapterIndex;
  bookTitle.textContent = currentBook.title + ' — ' + (currentChapter + 1) + '/' + currentBook.chapters.length;
  chapterContent.innerHTML = currentBook.chapters[currentChapter];
  localStorage.setItem('progress_' + currentBook.id, currentChapter);

  // Show ad after every 2 chapters (on 2, 4, ...)
  if ((chapterIndex + 1) % 2 === 0) {
    adContainer.style.display = 'block';
    // Reload AdSense ad if needed (adsbygoogle push)
    if (window.adsbygoogle) {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // AdSense might throw if already initialized
      }
    }
  } else {
    adContainer.style.display = 'none';
  }

  prevChapter.disabled = (chapterIndex === 0);
  nextChapter.disabled = (chapterIndex === currentBook.chapters.length - 1);

  // Continue button (simple demo: show on chapter 2+)
  continueBtn.style.display = chapterIndex > 0 ? 'inline-block' : 'none';
}

// Previous chapter
prevChapter.addEventListener('click', function() {
  if (currentBook && currentChapter > 0) {
    showChapter(currentChapter - 1);
  }
});

// Next chapter
nextChapter.addEventListener('click', function() {
  if (currentBook && currentChapter < currentBook.chapters.length - 1) {
    showChapter(currentChapter + 1);
  }
});

// Close modal
closeReader.addEventListener('click', function() {
  readerModal.style.display = 'none';
  currentBook = null;
});

// Optional: Close modal when clicking outside modal content
window.onclick = function(event) {
  if (event.target === readerModal) {
    readerModal.style.display = "none";
    currentBook = null;
  }
};

// --- Mobile Swipe Support ---
let touchStartX = null;
chapterContent.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
chapterContent.addEventListener('touchend', e => {
  if (!touchStartX) return;
  let touchEndX = e.changedTouches[0].clientX;
  if (touchEndX - touchStartX > 60 && currentChapter > 0) {
    showChapter(currentChapter - 1); // swipe right, prev
  } else if (touchStartX - touchEndX > 60 && currentChapter < currentBook.chapters.length - 1) {
    showChapter(currentChapter + 1); // swipe left, next
  }
  touchStartX = null;
});
