const pool = require('../db');
const bcrypt = require('bcryptjs');


// Function to assign colors to categories
const getCategoryColor = (category) => {
  switch (category) {
    case 'Fiction':
      return '#1e88e5';
    case 'Self Help':
      return '#43a047';
    case 'Business':
      return '#e53935';
    default:
      return '#8884d8'; // Default color
  }
};

const createUser = async (email, password, location, phoneNumber) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password, location, phone_number) VALUES ($1, $2, $3, $4) RETURNING *',
    [email, hashedPassword, location, phoneNumber]
  );
  return result.rows[0];
};
// const createUser = async (email, password, location, phoneNumber) => {
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const result = await pool.query(
//     'INSERT INTO users (email, password, location, phone_number, approved, status, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
//     [email, hashedPassword, location, phoneNumber, 'approved', 'active', 'admin']
//   );
//   return result.rows[0];
// };

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};
const findUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};
const getAllOwners = async (req) => {
  try {
    // Query to fetch users and calculate the sum of quantities of their books
    const result = await pool.query(
      `SELECT 
         u.id, 
         u.email AS owner, 
         u.role, 
         u.approved,
         u.status,
         COALESCE(SUM(b.quantity), 0) AS upload
       FROM users u
       LEFT JOIN books b ON u.id = b.user_id
       WHERE u.role = $1
       GROUP BY u.id`
      , ['user']
    );
    
    return result.rows;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw new Error('Internal server error');
  }
};


const BookCatagories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM book_catagory WHERE user_id = $1', [req.user.id]);
    // res.json(result.rows);
    res.json(result.rows.map(r=>r.category_name));
  } catch (error) {
    console.error('Error fetching book options:', error);
    res.status(500).send('Server error');
  }
}

const savedBooksAndCategory = async (req, res) => {
  const { title, bookNumber, quantity, price, category } = req.body;

  try {
    // Check if the category already exists for this user
    const existingCategoryResult = await pool.query(
      `SELECT id FROM book_catagory WHERE category_name = $1 AND user_id = $2`, 
      [category, req.user.id]
    );

    let categoryId;

    if (existingCategoryResult.rows.length > 0) {
      // If the category exists, get the existing category ID
      categoryId = existingCategoryResult.rows[0].id;
    } else { 
      // If the category doesn't exist, insert the category into the book_category table
      const categoryResult = await pool.query(
        `INSERT INTO book_catagory (category_name, user_id) VALUES ($1, $2) RETURNING id`,
        [category, req.user.id]
      );
      categoryId = categoryResult.rows[0].id;
    }

    // Insert the book data into the books table using the category ID
    await pool.query(
      `INSERT INTO books (book_name, book_no, quantity, price, user_id, category_id, imagepath) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [title, bookNumber, quantity, price, req.user.id, categoryId, req.file.filename]
    );

    console.log("book upload", req.file);
    console.log("book upload", title);

    res.status(200).json({ message: 'Book uploaded successfully' });
  } catch (error) {
    console.error('Error uploading book:', error);
    res.status(500).json({ message: 'Error uploading book' });
  }
};

const getAllBooks = async (req, res) => {
  try {
    // Query to get active books for the specific user along with category name
    const result = await pool.query(`
      SELECT 
        b.book_no AS "bookNo", 
        b.book_name AS "bookName", 
        b.status2 AS "status", 
        b.price,
        bc.category_name AS "categoryName"
      FROM books b
      JOIN book_catagory bc ON b.category_id = bc.id
      WHERE b.status = $1 AND b.user_id = $2
    `, ['active', req.user.id]);

    // Send the result as JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
};



const AvailableBooks =  async (req, res) => {
  const userId = parseInt(req.user.id, 10); // Get user ID from query parameters

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await pool.query(`
      SELECT category_name AS name, COUNT(*) AS value
      FROM books
      JOIN book_catagory ON books.category_id = book_catagory.id
      WHERE books.user_id = $1
      GROUP BY category_name
    `, [userId]);

    // Map result rows to include color
    const categories = result.rows.map(row => ({
      ...row,
      color: getCategoryColor(row.name), // Assign a color based on the category name
    }));

    res.json(categories);
  } catch (error) {
    console.error('Error fetching category data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
}

const deleteBook = async (req, res) => {
  const { bookNo } = req.params;

  try {
    await pool.query('DELETE FROM books WHERE book_no = $1', [bookNo]);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

const updateBook = async (req, res) => {
  const { bookNo } = req.params;
  const { bookName, categoryName, price, status } = req.body;

  try {
    // Check if the category exists and belongs to the user
    let category = await pool.query(
      'SELECT id FROM book_category WHERE category_name = $1 AND user_id = $2',
      [categoryName, req.user.id]
    );

    let categoryId;

    if (category.rows.length === 0) {
      // If the category doesn't exist, insert it and get the category_id
      const newCategory = await pool.query(
        'INSERT INTO book_category (category_name, user_id) VALUES ($1, $2) RETURNING id',
        [categoryName, req.user.id]
      );
      categoryId = newCategory.rows[0].id;
    } else {
      // If the category exists, get the category_id
      categoryId = category.rows[0].id;
    }

    // Update the book
    await pool.query(
      'UPDATE books SET book_name = $1, status = $2, category_id = $3, price = $4 WHERE book_no = $5 AND user_id = $6',
      [bookName, status, categoryId, price, bookNo, req.user.id]
    );

    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getAllBooksWithTheirOwners = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        books.id AS "id",
        books.book_no AS "no",
        books.book_name AS "bookName",
        books.status AS "status",
        books.price AS "price",
        books.quantity AS "quantity",
        books.status2 AS "status2",
        books.author AS "author",
        books.imagepath AS "imagepath",
        users.email AS "owner",
        book_catagory.category_name AS "category"
      FROM 
        books 
      JOIN 
        users ON books.user_id = users.id
      JOIN 
        book_catagory ON books.category_id = book_catagory.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query('UPDATE users SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating status.' });
  }
};

const updateUserApproval = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;

  try {
    const result = await pool.query('UPDATE users SET approved = $1 WHERE id = $2 RETURNING *', [approved, id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating approval.' });
  }
}

const deleteUsers =  async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.json({ message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting user.' });
  }
}

const updateBookStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query('UPDATE books SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error('Error updating book status:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const getBooksanAdmin = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.book_no,
        b.book_name,
        b.status2 AS "status",
        b.price,
        b.created_at,
        b.imagepath,
        b.quantity,
        b.status2,
        b.author,
        u.email AS owner,
        u.phone_number AS owner_phone,
        u.location AS owner_location,
        c.category_name
      FROM 
        books b
      LEFT JOIN 
        users u ON b.user_id = u.id
      LEFT JOIN 
        book_catagory c ON b.category_id = c.id
      ORDER BY 
        b.created_at DESC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
} 
const AdminUpdatetheBook = async (req, res) => {
  const { id } = req.params; // Book ID
  const {
    owner,           // Owner's email
    book_no,
    status,
    quantity,
    book_name,
    category_name,
    status2,
    price,
  } = req.body;

  try {
    // 1. Get the user ID by the owner's email
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [owner]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user_id = userResult.rows[0].id;

    // 2. Get the category ID by the category name and user ID
    const categoryResult = await pool.query(
      'SELECT id FROM book_catagory WHERE category_name = $1 AND user_id = $2',
      [category_name, user_id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category_id = categoryResult.rows[0].id;

    // 3. Update the book record with the retrieved user_id and category_id
    const updateBook = await pool.query(
      `UPDATE books 
       SET book_no = $1, status = $2, quantity = $3, book_name = $4, status2 = $5, price = $6, user_id = $7, category_id = $8 
       WHERE id = $9 
       RETURNING *`,
      [book_no, status, quantity, book_name, status2, price, user_id, category_id, id]
    );

    // Check if the book was updated successfully
    if (updateBook.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found or update failed' });
    }

    // Include the owner's email in the response and rename status2 to status
    const updatedBook = updateBook.rows[0];
    const response = {
      ...updatedBook,
      owner: owner,          // Include the owner's email
      status: updatedBook.status2,  // Rename status2 to status
    };

    // Exclude the original status2 from the response if necessary
    delete response.status2;

    // Return the updated book data with owner's email and status2 renamed
    console.log(response);
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const AdminDeleteBook =  async (req, res) => {
  const { id } = req.params;
    try {
      const deleteBook = await pool.query(
        'DELETE FROM books WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (deleteBook.rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      res.json({ message: 'Book deleted successfully', deletedBook: deleteBook.rows[0] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllOwners,
  BookCatagories,
  savedBooksAndCategory,
  getAllBooks,
  AvailableBooks,
  deleteBook,
  updateBook,
  getAllBooksWithTheirOwners,
  updateUserStatus,
  updateUserApproval,
  deleteUsers,
  updateBookStatus,
  getBooksanAdmin,
  AdminUpdatetheBook,
  AdminDeleteBook
};