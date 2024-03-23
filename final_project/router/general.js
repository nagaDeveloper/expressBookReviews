const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn_book = req.params.isbn;
  let filtered_isbn_book  = books[isbn_book];
  return res.status(300).json(filtered_isbn_book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author;
  let booksByAuthor = [];
    for (let key in books) {
        if (books[key].author === authorName) {
            booksByAuthor.push(books[key]);
        }
    }
  return res.status(300).json({booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const bookTitle = req.params.title;
  let booksByTitle = [];
    for (let key in books) {
        if (books[key].title === bookTitle) {
            booksByTitle.push(books[key]);
        }
    }
  return res.status(300).json({booksByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn_book = req.params.isbn;
  let filtered_isbn_book_review  = books[isbn_book].reviews;
  return res.status(300).json(filtered_isbn_book_review);
});

module.exports.general = public_users;
