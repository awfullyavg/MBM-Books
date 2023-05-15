//Code here
fetch("http://localhost:3000/books")
.then(resp => resp.json())
.then(books => console.log(books))
