import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Switch } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CheckIcon from '@mui/icons-material/Check';

const AdminShowBooks = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/api/books',{credentials:"include"});
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle status change for the specified row
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      // Send a request to the server to update the status
      const response = await fetch(`http://localhost:5000/admin/api/books/${id}`, {
        method: 'PATCH',
        credentials:"include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Update the status in the local state if server response is successful
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const columns = [
    {
      accessorKey: 'no',
      header: 'No.',
      size: 50,
    },
    {
      accessorKey: 'author',
      header: 'Author',
      size: 100,
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      size: 150,
      Cell: ({ cell }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={cell.row.original.avatar} sx={{ width: 24, height: 24, marginRight: 1 }} />
          <Typography variant="body2">{cell.getValue()}</Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 100,
    },
    {
      accessorKey: 'bookName',
      header: 'Book Name',
      size: 150,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 100,
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const rowId = cell.row.original.id;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckIcon sx={{ color: status === 'active' ? 'green' : 'red', marginRight: 1 }} />
            <Typography variant="body2" sx={{ color: status === 'active' ? 'green' : 'red' }}>
              {status}
            </Typography>
            <Switch
              checked={status === 'active'}
              size="small"
              color="success"
              sx={{ marginLeft: 1 }}
              // Call the handleStatusChange with the unique rowId and current status
              onChange={() => handleStatusChange(rowId, status)}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={{ showColumnFilters: true }}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableColumnActions={false}
        enableSorting={false}
        components={{
          TableHead: (props) => (
            <>
              <Box sx={{ padding: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                  List of Owners
                </Typography>
              </Box>
              {props.children}
            </>
          ),
        }}
        sx={{ fontSize: '0.875rem' }}
      />
    </Box>
  );
};

export default AdminShowBooks;
