//Code here
const donationForm = document.querySelector("#new-donation");
const catalog = document.querySelector(".catalog");

donationForm.addEventListener("submit", (event) => {
    event.preventDefault();

})
fetch("http://localhost:3000/books")
.then(resp => resp.json())
.then((books) => searchBooks(books))

function searchBooks(books){
    const searchBar = document.querySelector("#search-text") //grab the searchbar 
    //console.log(searchBar)

    const searchResults = document.querySelector("#search-results")
    console.log(searchResults)

}


