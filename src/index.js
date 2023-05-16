//Code here
//Declares global variables
const donationForm = document.querySelector("#new-donation");
const catalog = document.querySelector(".catalog");

//Calls firstBookToCatalog when site loads
firstBookToCatalog();

fetch("http://localhost:3000/books")
.then(resp => resp.json())
.then((books) => searchBooks(books))
//Takes in a search argument and returns books that match the search
function searchBooks(books){
    const searchBar = document.querySelector("#search-text") //grab the searchbar 
    //console.log(searchBar)

    const searchResults = document.querySelector("#search-results")
    console.log(searchResults)

}

//Submit event listener for donation form
donationForm.addEventListener("submit", (event) => {
    event.preventDefault();

})

//Gets data of first book and passes info to catalog
function firstBookToCatalog() {
  fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(data => {
        addBookToCatalog(data[0]);
    })
  }

//Displays book in the catalog
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

//Adds donated book to db.json and book bar
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

