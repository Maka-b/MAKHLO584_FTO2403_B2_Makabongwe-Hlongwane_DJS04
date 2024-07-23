import { authors } from '../data.js';

class BookPreview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set data(book) {
        this.render(book);
    }

    render({ author, id, image, title }) {
        this.shadowRoot.innerHTML = `
            <style>
                .preview {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                }
                .preview__image {
                    width: 100px;
                    height: 150px;
                }
                .preview__info {
                    text-align: center;
                }
                .preview__title {
                    font-size: 1.2em;
                    margin: 0;
                }
                .preview__author {
                    font-size: 1em;
                    color: gray;
                }
            </style>
            <button class="preview" data-preview="${id}">
                <img class="preview__image" src="${image}" />
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            </button>
        `;
    }
}

customElements.define('book-preview', BookPreview);

export default BookPreview;