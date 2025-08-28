// Sample data -- replace with your real books!
const books = [
  {
    id: "book1",
    title: "The Dreamer's Journey",
    cover: "https://covers.openlibrary.org/b/id/10521288-L.jpg",
    chapters: [
      "Chapter 1: It all began on a misty dawn. ...",
      "Chapter 2: As the sun rose, she realized she was not alone. ...",
      "Chapter 3: The journey continued through lands of wonder. ..."
    ]
  },
  {
    id: "book2",
    title: "Mystery of the Old Library",
    cover: "https://covers.openlibrary.org/b/id/10958309-L.jpg",
    chapters: [
      "Chapter 1: The ancient doors creaked open. ...",
      "Chapter 2: Shadows danced between the stacks. ...",
      "Chapter 3: The secret was hidden in plain sight. ..."
    ]
  },
  {
    id: "book3",
    title: "Tales Beyond the Stars",
    cover: "https://covers.openlibrary.org/b/id/10535849-L.jpg",
    chapters: [
      "Chapter 1: The spaceship hummed to life. ...",
      "Chapter 2: A new world appeared on the horizon. ...",
      "Chapter 3: Not all was as it seemed. ..."
    ]
  }
];

// Add more books by pushing to the books array!

// --- Render Books ---
const booksGrid = document.getElementById('booksGrid');
books.forEach((book, i) => {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.dataset.bookId = book.id;
  card.innerHTML = `
    <img src="${book.cover}" alt="${book.title}" class="book-cover">
    <div class="book-title">${book.title}</div>
  `;
  card.addEventListener('click', () => openReader(book.id));
  booksGrid.appendChild(card);
});

// --- Menu Dropdown ---
const menuBtn = document.getElementById('menuBtn');
const dropdown = document.getElementById('dropdown');
menuBtn.addEventListener('click', () => dropdown.classList.toggle('show'));
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

// --- Reader Modal Logic ---
const readerModal = document.getElementById('readerModal');
const closeReader = document.getElementById('closeReader');
const bookTitle = document.getElementById('bookTitle');
const chapterContent = document.getElementById('chapterContent');
const prevBtn = document.getElementById('prevChapter');
const nextBtn = document.getElementById('nextChapter');
const continueBtn = document.getElementById('continueBtn');

let currentBook = null;
let currentChapter = 0;

function openReader(bookId) {
  currentBook = books.find(b => b.id === bookId);
  const saved = localStorage.getItem('progress_' + bookId);
  if (saved && parseInt(saved) > 0) {
    continueBtn.style.display = '';
    continueBtn.onclick = () => {
      loadChapter(parseInt(saved));
      continueBtn.style.display = 'none';
    };
    loadChapter(0);
  } else {
    continueBtn.style.display = 'none';
    loadChapter(0);
  }
  readerModal.style.display = 'block';
}

function loadChapter(chapterIndex) {
  if (!currentBook) return;
  currentChapter = chapterIndex;
  bookTitle.textContent = currentBook.title + ' — ' + (currentChapter + 1) + '/' + currentBook.chapters.length;
  chapterContent.textContent = currentBook.chapters[currentChapter];
  localStorage.setItem('progress_' + currentBook.id, currentChapter);
  prevBtn.disabled = currentChapter <= 0;
  nextBtn.disabled = currentChapter >= currentBook.chapters.length - 1;
}

closeReader.onclick = () => {
  readerModal.style.display = 'none';
  currentBook = null;
};

prevBtn.onclick = () => loadChapter(currentChapter - 1);
nextBtn.onclick = () => loadChapter(currentChapter + 1);

// --- Mobile Swipe Support ---
let touchStartX = null;
chapterContent.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
chapterContent.addEventListener('touchend', e => {
  if (!touchStartX) return;
  let touchEndX = e.changedTouches[0].clientX;
  if (touchEndX - touchStartX > 60 && currentChapter > 0) {
    loadChapter(currentChapter - 1); // swipe right, prev
  } else if (touchStartX - touchEndX > 60 && currentChapter < currentBook.chapters.length - 1) {
    loadChapter(currentChapter + 1); // swipe left, next
  }
  touchStartX = null;
});

// Close modal on outside click
readerModal.onclick = (e) => {
  if (e.target === readerModal) {
    readerModal.style.display = 'none';
    currentBook = null;
  }
};
