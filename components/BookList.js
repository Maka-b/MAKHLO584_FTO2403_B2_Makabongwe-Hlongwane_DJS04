import './BookPreview.js';

class BookList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set books(books) {
        this.render(books);
    }

    render(books) {
        const fragment = document.createDocumentFragment();
        books.forEach(book => {
            const bookPreview = document.createElement('book-preview');
            bookPreview.data = book;
            fragment.appendChild(bookPreview);
        });
        this.shadowRoot.innerHTML = ``;
        this.shadowRoot.appendChild(fragment);
    }
}

customElements.define('book-list', BookList);

export default BookList;

