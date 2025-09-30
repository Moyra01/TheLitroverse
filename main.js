import chapter1 from './chapter1.js';
import chapter2 from './chapter2.js';

const books = [
  {
    id: "book1",
    title: "A Legacy of Damage",
    cover: "MJOHANNES.png",
    chapters: [...chapter1, ...chapter2],
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

const booksGrid = document.getElementById('booksGrid');
booksGrid.innerHTML = "";

books.forEach((book, i) => {
  const card = document.createElement('div');
  card.className = 'book-card' + (book.published ? '' : ' disabled');
  card.id = book.id;
  card.innerHTML = `
    ${!book.published ? '<div class="not-published">Not Published Yet</div>' : ''}
    <img src="${book.cover}" alt="${book.title}" class="book-image" />
    <h3>${book.title}</h3>
    <p>${book.published ? "A powerful tale of struggle and hope." : "Stay tuned for " + (i === 1 ? "the next release." : "future stories.")}</p>
  `;
  if (book.published) {
    card.addEventListener('click', () => openReader(book.id));
  }
  booksGrid.appendChild(card);
});

function adjustGridColumns() {
  if (window.innerWidth <= 600) {
    booksGrid.style.gridTemplateColumns = "1fr";
  } else {
    booksGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
  }
}

window.addEventListener('resize', adjustGridColumns);
adjustGridColumns();

const menuBtn = document.getElementById('menuBtn');
const dropdown = document.getElementById('dropdown');

menuBtn.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

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

function openReader(bookId) {
  currentBook = books.find(b => b.id === bookId);
  if (!currentBook || !currentBook.chapters.length) {
    alert("This book has no chapters yet.");
    return;
  }
  currentChapter = 0;
  readerModal.style.display = 'flex';
  readerModal.setAttribute('aria-hidden', 'false');
  showChapter(currentChapter);

  const saved = localStorage.getItem('progress_' + bookId);
  if (saved && +saved > 0) {
    continueBtn.style.display = '';
    continueBtn.onclick = () => {
      showChapter(+saved);
      continueBtn.style.display = 'none';
    };
  } else {
    continueBtn.style.display = 'none';
  }
}

function showChapter(chapterIndex) {
  if (!currentBook || !currentBook.chapters.length) return;
  if (chapterIndex < 0 || chapterIndex >= currentBook.chapters.length) return;
  currentChapter = chapterIndex;
  bookTitle.textContent = `${currentBook.title} — Page ${currentChapter + 1} of ${currentBook.chapters.length}`;
  chapterContent.innerHTML = currentBook.chapters[currentChapter];
  chapterContent.focus();
  localStorage.setItem('progress_' + currentBook.id, currentChapter);

  // Ad logic: show ad every 3rd chapter (page 3, 6, 9, etc.)
  if ((currentChapter + 1) % 3 === 0) {
    adContainer.style.display = 'block';
    adContainer.innerHTML = `<ins class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-6271585432301209"
      data-ad-slot="6155779302"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>`;
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      adContainer.innerHTML += '<div style="padding:20px;color:#888;font-size:1.1em;">Ad would appear here in production.</div>';
    }
  } else {
    adContainer.style.display = 'none';
    adContainer.innerHTML = '';
  }

  // Enable/disable buttons visually and functionally
  if (currentChapter === 0) {
    prevChapter.disabled = true;
    prevChapter.style.opacity = '0.5';
    prevChapter.style.pointerEvents = 'none';
  } else {
    prevChapter.disabled = false;
    prevChapter.style.opacity = '1';
    prevChapter.style.pointerEvents = 'auto';
  }
  if (currentChapter === currentBook.chapters.length - 1) {
    nextChapter.disabled = true;
    nextChapter.style.opacity = '0.5';
    nextChapter.style.pointerEvents = 'none';
  } else {
    nextChapter.disabled = false;
    nextChapter.style.opacity = '1';
    nextChapter.style.pointerEvents = 'auto';
  }
}

prevChapter.addEventListener('click', () => {
  if (currentBook && currentChapter > 0) {
    showChapter(currentChapter - 1);
  }
});

nextChapter.addEventListener('click', () => {
  if (currentBook && currentChapter < currentBook.chapters.length - 1) {
    showChapter(currentChapter + 1);
  }
});

closeReader.addEventListener('click', () => {
  readerModal.style.display = 'none';
  readerModal.setAttribute('aria-hidden', 'true');
  currentBook = null;
  currentChapter = 0;
});

window.addEventListener('click', e => {
  if (e.target === readerModal) {
    readerModal.style.display = 'none';
    readerModal.setAttribute('aria-hidden', 'true');
    currentBook = null;
    currentChapter = 0;
  }
});

let touchStartX = null;
chapterContent.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
chapterContent.addEventListener('touchend', e => {
  if (!touchStartX) return;
  let touchEndX = e.changedTouches[0].clientX;
  if (touchEndX - touchStartX > 60 && currentChapter > 0) showChapter(currentChapter - 1);
  else if (touchStartX - touchEndX > 60 && currentChapter < currentBook.chapters.length - 1) showChapter(currentChapter + 1);
  touchStartX = null;
});
