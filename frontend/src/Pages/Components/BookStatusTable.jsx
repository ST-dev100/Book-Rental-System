import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BookStatusTable = () => {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);

  const columns = [
    {
      accessorKey: 'no',
      header: 'No.',
      Cell: ({ row }) => (
        <Typography sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{row.index + 1}</Typography>
      ),
      size: 50
    },
    {
      accessorKey: 'bookNo',
      header: 'Book no.',
      Cell: ({ cell }) => (
        <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: 1, padding: '2px 4px' }}>
          <Typography variant="body2">{cell.getValue()}</Typography>
        </Box>
      ),
      size: 70
    },
    {
      accessorKey: 'bookName',
      header: 'Book Name',
      size: 150
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ cell }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: cell.getValue() === 'Rented' ? 'red' : 'blue',
              marginRight: 0.5,
            }}
          />
          <Typography variant="body2">{cell.getValue()}</Typography>
        </Box>
      ),
      size: 80
    },
    {
      accessorKey: 'price',
      header: 'Price',
      size: 70
    },
    {
      accessorKey: 'action',
      header: 'Action',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" sx={{ color: 'black', padding: '4px' }} onClick={() => handleEdit(row.original)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: 'red', padding: '4px' }} onClick={() => handleDelete(row.original.bookNo)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
      size: 50
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://book-rental-system-qctq.vercel.app/owner/api/books', { credentials: "include" });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (book) => {
    setEditData(book);
    setOpen(true);
  };

  const handleDelete = async (bookNo) => {
    try {
      await fetch(`https://book-rental-system-qctq.vercel.app/owner/api/books/${bookNo}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setData(data.filter(book => book.bookNo !== bookNo));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleSave = async () => {
    try {
      await fetch(`https://book-rental-system-qctq.vercel.app/owner/api/books/${editData.bookNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(editData)
      });
      setData(data.map(book => (book.bookNo === editData.bookNo ? editData : book)));
      handleClose();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
    <Box sx={{ padding: 1 }} flexGrow={2}>
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
          <Typography variant="h6" sx={{ marginBottom: 1, fontSize: '1rem' }}>
            Live Book Status
          </Typography>
        )}
      />

      {editData && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Book No."
              fullWidth
              value={editData.bookNo}
              disabled
            />
            <TextField
              margin="dense"
              label="Book Name"
              fullWidth
              value={editData.bookName}
              onChange={(e) => setEditData({ ...editData, bookName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Category Name"
              fullWidth
              value={editData.categoryName}
              onChange={(e) => setEditData({ ...editData, categoryName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Price"
              fullWidth
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default BookStatusTable;
