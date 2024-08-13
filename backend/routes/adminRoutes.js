const express = require('express');
const  protectRoute  = require('../middleware/protectedRoute');
const { getAllOwners, getAllBooksWithTheirOwners, updateUserStatus, updateUserApproval, deleteUsers, updateBookStatus, getBooksanAdmin, AdminUpdatetheBook, AdminDeleteBook } = require('../models/userModel');
const router = express.Router();

router.get('/ownerlist', protectRoute, async (req, res) => {
    try {
      // Fetch all owners
      let all = await getAllOwners(req);
  
    
  
    
      // Send the transformed result
      res.json(all);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
router.get('/api/books',protectRoute,getAllBooksWithTheirOwners)
router.put('/update-status/:id',protectRoute,updateUserStatus)
router.put('/update-approval/:id',protectRoute,updateUserApproval)
router.delete('/delete-user/:id',protectRoute,deleteUsers)
router.patch('/api/books/:id',protectRoute,updateBookStatus)
router.get('/api/getAllbooks',getBooksanAdmin);
router.put('/api/updateBook/:id',AdminUpdatetheBook);
router.delete('/api/deleteBook/:id',AdminDeleteBook);
module.exports = router