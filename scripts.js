import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import './components/BookList.js'
import './components/BookPreview.js'

const library = {
    books,
    authors,
    genres,
};

let page = 1;
let matches = library.books;

function createDropdownOptions(options, firstOptionText) {
    const fragment = document.createDocumentFragment();
    const firstElement = document.createElement('option');
    firstElement.value = 'any';
    firstElement.innerText = firstOptionText;
    fragment.appendChild(firstElement);

    for (const [id, name] of Object.entries(options)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        fragment.appendChild(element);
    }
    return fragment;
}

function setupTheme() {
    const prefersDarkScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDarkScheme ? 'night' : 'day';
    document.querySelector('[data-settings-theme]').value = theme;
    const darkColor = prefersDarkScheme ? '255, 255, 255' : '10, 10, 20';
    const lightColor = prefersDarkScheme ? '10, 10, 20' : '255, 255, 255';
    document.documentElement.style.setProperty('--color-dark', darkColor);
    document.documentElement.style.setProperty('--color-light', lightColor);
}

function updateShowMoreButton() {
    const showMoreButton = document.querySelector('[data-list-button]');
    const remainingBooks = matches.length - (page * BOOKS_PER_PAGE);
    showMoreButton.innerText = `Show more (${remainingBooks})`;
    showMoreButton.disabled = remainingBooks <= 0;

    showMoreButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remainingBooks > 0 ? remainingBooks : 0})</span>
    `;
}

function addEventListeners() {
    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = false;
    });

    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = false;
    });

    document.querySelector('[data-header-search]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = true;
        document.querySelector('[data-search-title]').focus();
    });

    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = true;
    });

    document.querySelector('[data-list-close]').addEventListener('click', () => {
        document.querySelector('[data-list-active]').open = false;
    });

    document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);

        if (theme === 'night') {
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }

        document.querySelector('[data-settings-overlay]').open = false;
    });

    document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
        const result = [];

        for (const book of library.books) {
            let genreMatch = filters.genre === 'any';
            for (const singleGenre of book.genres) {
                if (genreMatch) break;
                if (singleGenre === filters.genre) { genreMatch = true; }
            }

            if (
                (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                (filters.author === 'any' || book.author === filters.author) &&
                genreMatch
            ) {
                result.push(book);
            }
        }

        page = 1;
        matches = result;

        if (result.length < 1) {
            document.querySelector('[data-list-message]').classList.add('list__message_show');
        } else {
            document.querySelector('[data-list-message]').classList.remove('list__message_show');
        }

        const bookList = document.querySelector('book-list');
        bookList.books = result.slice(0, BOOKS_PER_PAGE);
        updateShowMoreButton();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelector('[data-search-overlay]').open = false;
    });

    document.querySelector('[data-list-button]').addEventListener('click', () => {
        const fragment = document.createDocumentFragment();
        const bookList = document.querySelector('book-list');
        bookList.books = matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE);
        page += 1;
        updateShowMoreButton();
    });

    document.querySelector('[data-list-items]').addEventListener('click', (event) => {
        const pathArray = Array.from(event.path || event.composedPath());
        let active = null;

        for (const node of pathArray) {
            if (active) break;

            if (node?.dataset?.preview) {
                let result = null;

                for (const singleBook of library.books) {
                    if (result) break;
                    if (singleBook.id === node?.dataset?.preview) result = singleBook;
                }

                active = result;
            }
        }

        if (active) {
            document.querySelector('[data-list-active]').open = true;
            document.querySelector('[data-list-blur]').src = active.image;
            document.querySelector('[data-list-image]').src = active.image;
            document.querySelector('[data-list-title]').innerText = active.title;
            document.querySelector('[data-list-subtitle]').innerText = `${library.authors[active.author]} (${new Date(active.published).getFullYear()})`;
            document.querySelector('[data-list-description]').innerText = active.description;
        }
    });
}

// Initial Render
function initialize() {
    const starting = document.createDocumentFragment();
    const bookList = document.createElement('book-list');
    bookList.books = matches.slice(0, BOOKS_PER_PAGE);
    starting.appendChild(bookList);
    document.querySelector('[data-list-items]').appendChild(starting);

    const genreHtml = createDropdownOptions(library.genres, 'All Genres');
    document.querySelector('[data-search-genres]').appendChild(genreHtml);

    const authorsHtml = createDropdownOptions(library.authors, 'All Authors');
    document.querySelector('[data-search-authors]').appendChild(authorsHtml);

    setupTheme();
    updateShowMoreButton();
    addEventListeners();
}

initialize();
