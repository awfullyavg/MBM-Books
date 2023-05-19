//Code here
//Globally scoped html elements
const donationForm = document.querySelector("#new-donation");
const catalog = document.querySelector(".catalog");
const bookBar = document.querySelector('#book-bar')
const thankyouMessage = document.querySelector('#thankyou')
const checkoutForm = document.querySelector('#new-checkout');
const searchBar = document.querySelector("#search-input-form") //grab the search for the searchBooks function
const donatorList = document.querySelector(".donor-list")

let donorNameH4= document.createElement("h4")
let donorCopyCount = document.createElement("ul")   // this is creating new elements that we will populate when we submit our donator form
let donorImage = document.createElement("img")

//Keeps track of current book in the catalog
let currentCataloggedBook;

//Globally scoped catalog html elements
const catalogBook = document.createElement("span");
catalogBook.className = 'catalog-span'
const catalogCopies = document.createElement("p");
const catalogCover = document.createElement("img");
catalogCover.className = "cover-img";
catalogBook.appendChild(catalogCover);
catalogBook.appendChild(catalogCopies)
catalog.appendChild(catalogBook);

//Calls fetch functions
firstBookToCatalog();
fetchBookBar();

//Changed the html form to have a submit function instead of a button, this way I can call addEventListener to the "searchBar", pass in event, prevent default, and pass the event to my searchBooks function. (that same search books function holds the fetch and the data).
searchBar.addEventListener("submit", (e) => {
  e.preventDefault() 
  searchBooks(e)
})

//SEARCH FUNCTION
//Takes in our book paramater HOPEFULLY returns books that match the search
function searchBooks(e){
//create a FETCH to obtain the data located in the db.json
fetch("http://localhost:3000/books")
  .then(resp => resp.json())
  .then((books) => {
    let searchInquiry = e.target["search-text"].value.toLowerCase()

    // console.log(searchInquiry)
//The logic is taking a book, filtering and seeing if it matches.
    let filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchInquiry) || book.author.toLowerCase().includes(searchInquiry))
    if (filteredBooks.length === 0){
      alert("Sorry, but we currently do not have this book available.")
    } else {
      filteredBooks.forEach(book => {
//After filtering through the books and matching what is inputted into the searchInquiry, we then pass the book that is found to our addBookToCatalog function.
      addBookToCatalog(book)
      })    
  }
    searchBar.reset()
})}

//Submit event listener for donation form
donationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let numberOfCopies = event.target.copies.value // get number of copies from form

    donorCopyCount.setAttribute("class", "donorClass")

    donorNameH4.textContent = "⭐" + event.target.name.value //add name to donor form
    donorImage.src = event.target.donorImage.value //adds img to donor form

    donorCopyCount.textContent = `This donor has donated ${numberOfCopies} books`

    donorNameH4.className = "h4Donor"
    donorCopyCount.className = "copiesDonated" //this area attaches classes to the respected variables
    donorImage.className = "donorImages"

    donorCopyCount.setAttribute("id", "newDonorCopies") // set ID to copies so we can reach copies

    donorImage.setAttribute("id", "newDonorImage") //set an ID to target the image of the new donor


    donatorList.appendChild(donorNameH4)
    donatorList.appendChild(donorCopyCount)
    donatorList.appendChild(donorImage)

    donatedBook(event)
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
  if (bookBar.innerHTML === '') {
    catalogCopies.textContent = "No books remaining in catalog"
    catalogCover.src = "https://t3.ftcdn.net/jpg/00/49/82/62/360_F_49826222_9f2rGQlghv0jOYhAN7CCW73OxFu53Q62.jpg"
  } else {
    catalogCopies.textContent = `Copies Available: ${book.copies}`;
    catalogCover.src = book.img_front;
    currentCataloggedBook = book;
  }
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
        "copies": event.target.copies.value,
        "img_front": event.target.frontImage.value,
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
    
    images.addEventListener('click', function(){
      // console.log(images)
      catalogCover.src = images.src
      catalogCopies.textContent = `Copies Available: ${data.copies}`
      currentCataloggedBook = data;
    })
}

//Listens for submit on checkout form and sends current catalogged book to checkout function
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkoutName = e.target.name.value;
    thankyouMessage.textContent = `${checkoutName}, thank you for checking out a book!`;
    if (bookBar.innerHTML === '') {
      catalogCopies.textContent = "No books remaining in catalog"
      catalogCover.src = "https://t3.ftcdn.net/jpg/00/49/82/62/360_F_49826222_9f2rGQlghv0jOYhAN7CCW73OxFu53Q62.jpg"
    } else {
    checkoutBook(currentCataloggedBook);
    }
})

//Function to checkout book
function checkoutBook(book) {
  let id = book.id;
  // console.log(book)
    if (parseInt(book.copies) > 1) {
      fetch(`http://localhost:3000/books/${id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "copies": `${parseInt(book.copies) - 1}`
      })
    })
        .then(resp => resp.json())
        .then(data => {
          firstBookToCatalog();
          catalogCopies.textContent = `Copies Available: ${parseInt(book.copies) - 1}`
        })
    } else {
    fetch(`http://localhost:3000/books/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(resp => resp.json())
      .then(data => {
        bookBar.innerHTML = "";
        fetchBookBar();
        firstBookToCatalog();
      })
    } 
}

document.querySelector('#randy').addEventListener("mouseover", mouseOverRandy)
document.querySelector('#randy').addEventListener("mouseout", mouseOutRandy)

function mouseOverRandy () {
  document.getElementById('randy-copies').style.display = 'block';
}
function mouseOutRandy () {
  document.getElementById('randy-copies').style.display = 'none';
}

document.querySelector('#ted').addEventListener("mouseover", mouseOverTed)
document.querySelector('#ted').addEventListener("mouseout", mouseOutTed)

function mouseOverTed () {
  document.getElementById('ted-copies').style.display = 'block';
}
function mouseOutTed () {
  document.getElementById('ted-copies').style.display = 'none';
}

document.querySelector('#mclovin').addEventListener("mouseover", mouseOverMclovin)
document.querySelector('#mclovin').addEventListener("mouseout", mouseOutMclovin)

function mouseOverMclovin () {
  document.getElementById('mclovin-copies').style.display = 'block';
}
function mouseOutMclovin () {
  document.getElementById('mclovin-copies').style.display = 'none';
}

donorImage.addEventListener("mouseover", mouseOverNewDonor) //select donorImage variable (it's already the SRC) + addEvent to it 
donorImage.addEventListener("mouseout", mouseOutNewDonor)

function mouseOverNewDonor () {
  document.getElementById('newDonorCopies').style.display = 'block';
}
function mouseOutNewDonor () {
  document.getElementById('newDonorCopies').style.display = 'none';
}