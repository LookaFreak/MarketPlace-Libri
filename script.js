document.addEventListener('DOMContentLoaded', function () {
    const bookList = document.getElementById('bookList');
    const cartItems = document.getElementById('cartItems');
    const searchInput = document.getElementById('searchInput');
    const emptyCartBtn = document.getElementById('emptyCartBtn');
    let cart = [];
    let books = [];

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

    function updateCartCount() {
        document.getElementById('cartTotal').textContent = `Total: ${cart.length}`;
    }

    function renderBooks(books) {
        bookList.innerHTML = '';
        books.forEach(book => {
            const card = `
                <div class="col-md-3 mb-3">
                    <div class="card">
                        <img src="${book.img}" class="card-img-top" alt="${book.title}">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <hr class="my-1"> <!-- Aggiunta della riga per separare il titolo e il prezzo -->
                            <p class="card-price">${book.price} €</p>
                            <button class="btn btn-primary addToCartBtn" data-book='${JSON.stringify(book)}'>Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            bookList.innerHTML += card;
        });
    }

    function addToCart(book) {
        const existingBook = cart.find(item => item.id === book.asin);
        if (!existingBook) {
            cart.push({ ...book, id: book.asin });
            updateCartCount();
        }
    }

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

    emptyCartBtn.addEventListener('click', () => {
        cart = [];
        updateCartCount();
        showCartItems();
    });

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));
        renderBooks(filteredBooks);
    });

    bookList.addEventListener('click', function (event) {
        if (event.target.classList.contains('addToCartBtn')) {
            const bookData = JSON.parse(event.target.getAttribute('data-book'));
            addToCart(bookData);
            event.target.textContent = 'Added';
            event.target.disabled = true;
            showCartItems();
        }
    });

    fetch('https://striveschool-api.herokuapp.com/books')
        .then(response => response.json())
        .then(data => {
            books = data;
            renderBooks(data);
        })
        .catch(error => console.error('An error occurred while fetching books:', error));
});