//Code here
const donationForm = document.querySelector("#new-donation");
const catalog = document.querySelector(".catalog");

donationForm.addEventListener("submit", (event) => {
    event.preventDefault();

})
fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(data => {
        data.forEach((book) => addBookToCatalog(book))
    })

function addBookToCatalog(book) {
    const newBook = document.createElement("span");
    book.className = "book";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("h4");
    author.textContent = `By: ${book.author}`;
    
    const copies = document.createElement("p");
    copies.textContent = `Copies Available: ${book.copies}`;

    const cover = document.createElement("img");
    cover.src = book.img_front;

    newBook.appendChild(title);
    newBook.appendChild(author);
    newBook.appendChild(copies);
    newBook.appendChild(cover);

    catalog.appendChild(newBook);
}

function donatedBook(event) {
    fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "title": event.target.title.value,
        "author": event.target.author.value,
        "pages": event.target.pages.value,
        "copies": event.target.copies.value,
        "img_front": event.target.frontImage.value,
        "img_back": event.taget.backImage.value,
        "genre": event.target.genre.value,
        "series": event.target.series.value,
      })
    })
      .then(resp => resp.json())
      .then(data => {
        addBookToCatalog(data);
      })
  }
