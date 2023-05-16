//Code here
//Globally scoped html elements
const donationForm = document.querySelector("#new-donation");
const catalog = document.querySelector(".catalog");
const bookBar = document.querySelector('book-bar')
const checkoutButton = document.querySelector('#checkoutNow-button')

//Globally scoped catalog html elements
const catalogBook = document.createElement("span");
const catalogCopies = document.createElement("p");
catalogBook.appendChild(catalogCopies);
const catalogCover = document.createElement("img");
catalogCover.className = "cover-img";
catalogBook.appendChild(catalogCover);
catalog.appendChild(catalogBook);

//Calls fetch functions
firstBookToCatalog();
fetchBookBar();

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
    catalogCopies.textContent = `Copies Available: ${book.copies}`;
    catalogCover.src = book.img_front;

    checkoutButton.addEventListener("click", checkoutBook(book));
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
        renderBookBar(data);
      })
}


//Book Bar code
function fetchBookBar() {
  fetch("http://localhost:3000/books")
      .then(resp => resp.json())
      .then(data => data.forEach(element => renderBookBar(element)))
}

//Function to render books in the book-bar div
function renderBookBar(data) {
    const span = document.createElement('span')
    const images = document.createElement('img')
    images.src = data.img_front
    images.className = 'bookbar-images'
    span.appendChild(images)
    document.getElementById('book-bar').appendChild(span)
}

//Function to checkout book
function checkoutBook(book) {

}
 
