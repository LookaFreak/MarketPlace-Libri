document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(location.search);
    const bookId = params.get("id");

    fetch(`https://striveschool-api.herokuapp.com/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
            const bookDetails = document.getElementById('bookDetails');
            const detailsHtml = `
                <div class="card">
                    <img src="${book.img}" class="card-img-top img-thumbnail w-25" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">Author: ${book.author}</p>
                        <p class="card-text">Price: ${book.price} €</p>
                        <p class="card-text">Category: ${book.category}</p>
                        <p class="card-text">Description: ${book.desc}</p>
                    </div>
                </div>
            `;
            bookDetails.innerHTML = detailsHtml;
        })
        .catch(error => console.error('An error occurred while fetching book details:', error));
});