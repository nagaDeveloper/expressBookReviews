const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 }); 

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const reviews = {};
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.session.authorization;

    console.log(username);

    if (!isbn || !review) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

    if (!reviews[isbn]) {
        reviews[isbn] = [];
    }

    const existingReviewIndex = reviews[isbn].findIndex(
        (entry) => entry.username === username
    );
    
    if (existingReviewIndex !== -1) {
        reviews[isbn][existingReviewIndex].review = review;
      } else {
        reviews[isbn].push({ username, review });
      }

  //Write your code here
  return res.status(300).json({message: `The review of the book with ISBN ${isbn} is added or updated successsfully`});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const { username } = req.session.authorization;
    console.log(username)

    const reviews = books[isbn].reviews;
    // review {username: review}
    delete reviews[username];

    return res.status(200).json(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
