const express = require('express');
const multer = require("multer");
const path = require("path");
const  protectRoute  = require('../middleware/protectedRoute');
const { BookCatagories, savedBooksAndCategory, getAllBooks, AvailableBooks, deleteBook, updateBook } = require('../models/userModel');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });    

router.post('/books/upload',protectRoute,upload.single("bookCover"),savedBooksAndCategory)
router.get('/book-catagory/list',protectRoute,BookCatagories)
router.get('/api/books',protectRoute,getAllBooks)
router.get('/api/availabooks',protectRoute,AvailableBooks)
router.delete('/api/books/:bookNo',protectRoute,deleteBook)
router.put('/api/books/:bookNo',updateBook)


module.exports = router