import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the Zod schema for validation
const bookSchema = z.object({
  book_no: z.number().min(1, 'Book No. is required'),
  owner: z.string().nonempty('Owner is required'),
  status: z.string().nonempty('Status is required'),
  quantity: z.number().min(0,'Quantity is required'),
  book_name: z.string().nonempty('Book Name is required'),
  category_name: z.string().nonempty('Category Name is required'),
  status2: z.string().nonempty('Status2 is required'),
  price: z.string().nonempty('Price is required').regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number'),
});

const LiveBookStatus = () => {
  const [data, setData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: selectedBook || {}
  });

  const columns = [
    {
      accessorKey: 'no',
      header: 'No.',
      size: 50,
      Cell: ({ row }) => (
        <Typography sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
          {row.index + 1}
        </Typography>
      ),
    },
    {
      accessorKey: 'book_no',
      header: 'Book no.',
      size: 70,
      Cell: ({ cell }) => (
        <Box
          sx={{ backgroundColor: '#F5F5F5', borderRadius: 1, padding: '2px 4px' }}
        >
          <Typography variant="body2">{cell.getValue()}</Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      size: 150,
      Cell: ({ cell }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={cell.row.original.avatar}
            sx={{ width: 24, height: 24, marginRight: 1 }}
          />
          <Typography variant="body2">{cell.getValue()}</Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 80,
      Cell: ({ cell }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: cell.getValue() === 'Rented' ? 'red' : 'blue',
              marginRight: 1,
            }}
          />
          <Typography variant="body2">{cell.getValue()}</Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      size: 70,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 50,
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            sx={{ color: 'black', padding: '4px' }}
            onClick={() => handleEditClick(row.original)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: 'red', padding: '4px' }}
            onClick={() => handleDeleteClick(row.original.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/admin/api/getAllbooks');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setValue('book_no', book.book_no);
    setValue('owner', book.owner);
    setValue('status', book.status);
    setValue('quantity', book.quantity);
    setValue('book_name', book.book_name);
    setValue('category_name', book.category_name);
    setValue('status2', book.status2);
    setValue('price', book.price);
    setOpen(true);
  };

  const handleDeleteClick = async (bookId) => {
    try {
      await fetch(`http://localhost:5000/admin/api/deleteBook/${bookId}`, {
        method: 'DELETE',
      });
      setData(data.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBook(null);
  };

  const onSubmit = async (formData) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/api/updateBook/${selectedBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedBook = await response.json();
      setData(
        data.map((book) => (book.id === updatedBook.id ? updatedBook : book))
      );
      handleClose();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
    <Box sx={{ padding: 1 }} flexGrow={2}>
      {loading ? (
        <CircularProgress />
      ) : (
        <MaterialReactTable
          columns={columns}
          data={data}
          initialState={{ showColumnFilters: false }}
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          enableColumnActions={false}
          enableSorting={false}
          sx={{ fontSize: '0.875rem' }}
          renderTopToolbarCustomActions={() => (
            <Typography variant="h1" sx={{ marginBottom: 1, fontSize: '1rem' }}>
              Live Book Status
            </Typography>
          )}
        />
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="book_no"
            label="Book No."
            fullWidth
            variant="outlined"
            {...register('book_no')}
            error={!!errors.book_no}
            helperText={errors.book_no?.message}
          />
          <TextField
            margin="dense"
            name="owner"
            label="Owner"
            fullWidth
            variant="outlined"
            {...register('owner')}
            error={!!errors.owner}
            helperText={errors.owner?.message}
          />
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              {...register('status')}
              error={!!errors.status}
              helperText={errors.status?.message}
              label="Status"
            >
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="active">Active</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="quantity"
            label="Book Quantity"
            fullWidth
            variant="outlined"
            {...register('quantity')}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
          />
          <TextField
            margin="dense"
            name="book_name"
            label="Book Name"
            fullWidth
            variant="outlined"
            {...register('book_name')}
            error={!!errors.book_name}
            helperText={errors.book_name?.message}
          />
             <TextField
               margin="dense"
               name="category_name"
               label="Book Category"
               fullWidth
               variant="outlined"
               {...register('category_name')}
               error={!!errors.category_name}
               helperText={errors.category_name?.message}
             />
             <FormControl fullWidth margin="dense" variant="outlined">
               <InputLabel>Status2</InputLabel>
               <Select
                 name="status2"
                 {...register('status2')}
                 error={!!errors.status2}
                 helperText={errors.status2?.message}
                 label="Status2"
               >
                 <MenuItem value="Rented">Rented</MenuItem>
                 <MenuItem value="Free">Free</MenuItem>
               </Select>
             </FormControl>
             <TextField
               margin="dense"
               name="price"
               label="Price"
               fullWidth
               variant="outlined"
               {...register('price')}
               error={!!errors.price}
               helperText={errors.price?.message}
             />
           </DialogContent>
           <DialogActions>
             <Button onClick={handleClose}>Cancel</Button>
             <Button onClick={handleSubmit(onSubmit)} color="primary">
               Save
             </Button>
           </DialogActions>
         </Dialog>
       </Box>
     );
   };

   export default LiveBookStatus;

