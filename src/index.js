//Code here
//Globally scoped html elements
const donationForm = document.querySelector("#new-donation");
const catalog = document.querySelector(".catalog");
const bookBar = document.querySelector('book-bar')
const checkoutButton = document.querySelector('#checkoutNow-button')
const searchBar = document.querySelector("#search-input-form") //grab the search for the searchBooks function


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



searchBar.addEventListener("submit", (e) => {
  e.preventDefault() 
  searchBooks(e)
})


//SEARCH FUNCTION
//Takes in our book paramater HOPEFULLY returns books that match the search
function searchBooks(e){
//Step 1: create a FETCH to obtain the data located in the db.json
fetch("http://localhost:3000/books")
.then(resp => resp.json())
.then((books) => {
  let searchInquiry = e.target["search-text"].value.toLowerCase()
  console.log(searchInquiry)

  let filteredBooks = books.filter()


  filteredBooks.forEach( book => {

    //Step 2: Grab the div with an id of "search-results", from there we will populate using append.child() and add both our db.json books title and authors.
        const searchResults = document.querySelector("#search-results")
    //console.log(searchResults)
    
    //Step 3: To add the title and authors, we first have to either make a <ul> element in HTML or use document.createElement to make them in JS., because there's no need to number them.
        const titleLines = document.createElement("ul")
        const authorLines = document.createElement("ul")
    //console.log(titleLines)
    //console.log(authorLines)
    
    //Step 4: After making the <ul> elements,  I'd like to populate the list with both the TITLE of the books, and the AUTHOR of the books.
        titleLines.textContent = book.title
        authorLines.textContent = book.author
    
    //Step 4.5 using append.child() attach the titleLines and authorLines to the searchResults and add both our db.json books title and authors.
        searchResults.appendChild(titleLines)
        searchResults.appendChild(authorLines)
    
    //Step 5: So this is where it gets complicated. Previously I had used an addEventListener to the search , listening for a click, after the click I preventDefault() passing an event to the addEventListener function
    
                    /* <form id="search-input-form">
                    <input type="text" id="search-text" name="search-text" placeholder="Search Books...">
                    <button id="search-button">Search</button>
                    </form> */
    
    //Step 6: The logic I think I'll try this time is having the UL list items populated but hidden. Then if the user clicks it'll undhide the property if it matches the a variable?
    })

})}


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

    checkoutButton.addEventListener("click", (event) => checkoutButtonHandler(event, book));
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

//Function to handle checkout button
function checkoutButtonHandler(event, book) {
    console.log(book);
}

//Function to checkout book
function checkoutBook(book) {
    const id = book.id;
    fetch(`http://localhost:3000/books/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    firstBookToCatalog();
    fetchBookBar();
}