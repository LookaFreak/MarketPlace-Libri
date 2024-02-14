document.addEventListener('DOMContentLoaded', function () {
    const bookList = document.getElementById('bookList');
    const cartItems = document.getElementById('cartItems');
    const searchInput = document.getElementById('searchInput');
    const emptyCartBtn = document.getElementById('emptyCartBtn');
    let cart = [];
    let books = [];

    // Funzione per mostrare gli elementi nel carrello
    function showCartItems() {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.title}`;
            listItem.classList.add('list-group-item');
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'x';
            removeBtn.classList.add('btn', 'btn-danger', 'ml-2');
            removeBtn.addEventListener('click', () => removeFromCart(index));
            listItem.appendChild(removeBtn);
            cartItems.appendChild(listItem);
        });
    }

    // Funzione per aggiornare il conteggio del carrello
    function updateCartCount() {
        document.getElementById('cartTotal').textContent = `Total: ${cart.length}`;
    }

    // Funzione per renderizzare i libri nella lista
    function renderBooks(books) {
        bookList.innerHTML = '';
        books.forEach(book => {
            const card = `
                <div class="col-md-3 mb-3">
                    <div class="card">
                        <img src="${book.img}" class="card-img-top" alt="${book.title}">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-price">${book.price} €</p>
                            <button class="btn btn-success addToCartBtn" data-book='${JSON.stringify(book)}'>Add to Cart</button>
                            <button class="btn btn-secondary skipBtn">Skip</button>
                            <button class="btn btn-info viewDetailsBtn my-1" data-id="${book.asin}">View Details</button>
                        </div>
                    </div>
                </div>
            `;
            bookList.innerHTML += card;
        });
    }

    // Funzione per aggiungere un libro al carrello
    function addToCart(book) {
        const existingBook = cart.find(item => item.id === book.asin);
        if (!existingBook) {
            cart.push({ ...book, id: book.asin });
            updateCartCount();
        }
    }

    // Funzione per rimuovere un libro dal carrello
    function removeFromCart(index) {
        const removedBook = cart.splice(index, 1)[0];
        updateCartCount();
        showCartItems();
        const addToCartBtns = document.querySelectorAll('.addToCartBtn');
        addToCartBtns.forEach(btn => {
            const bookData = JSON.parse(btn.getAttribute('data-book'));
            if (bookData.asin === removedBook.asin && !cart.some(item => item.asin === bookData.asin)) {
                btn.disabled = false;
                btn.textContent = 'Add to Cart';
            }
        });
    }

    // Evento click sul pulsante "Empty Cart"
    emptyCartBtn.addEventListener('click', () => {
        const addToCartBtns = document.querySelectorAll('.addToCartBtn');
        addToCartBtns.forEach(btn => {
            btn.disabled = false;
            btn.textContent = 'Add to Cart';
        });
        cart = [];
        updateCartCount();
        showCartItems();
    });

    // Evento input sulla barra di ricerca
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));
        renderBooks(filteredBooks);
    });

    // Evento click sul pulsante "Add to Cart"
    bookList.addEventListener('click', function (event) {
        if (event.target.classList.contains('addToCartBtn')) {
            const bookData = JSON.parse(event.target.getAttribute('data-book'));
            addToCart(bookData);
            event.target.textContent = 'Added';
            event.target.disabled = true;
            showCartItems();
        }
    });

    // Evento click sul pulsante "Skip"
    bookList.addEventListener('click', function (event) {
        if (event.target.classList.contains('skipBtn')) {
            const card = event.target.closest('.card');
            card.style.display = 'none'; // Nascondi la card
        }
    });

    // Evento click sul pulsante "View Details"
    bookList.addEventListener('click', function (event) {
        if (event.target.classList.contains('viewDetailsBtn')) {
            const bookId = event.target.getAttribute('data-id');
            window.location.href = `dettagli.html?id=${bookId}`; // Reindirizza alla pagina dei dettagli con l'ID del libro
        }
    });

    // Fetch dei libri
    fetch('https://striveschool-api.herokuapp.com/books')
        .then(response => response.json())
        .then(data => {
            books = data;
            renderBooks(data);
        })
        .catch(error => console.error('An error occurred while fetching books:', error));
});