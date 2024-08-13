import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Switch, IconButton, Button } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const OwnerListTable = () => {
  const [data, setData] = useState([]); // State to hold the table data
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      try {
        const response = await fetch('https://book-rental-system-qctq.vercel.app/admin/ownerlist', {
          credentials: 'include' // Ensure cookies are sent with the request
        });
        if (!response.ok) {   
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        // console.log(result)
        setData(result); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once after the initial render

  const handleStatusChange = (id) => {
    setData(data.map(item => 
      item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
    ));
  };

  const handleApprovalChange = (id) => {
    setData(data.map(item => 
      item.id === id ? { ...item, approved: item.approved === 'approved' ? 'notapproved' : 'approved' } : item
    ));
  };

  // Define columns based on your data structure
  const columns = [
    {
      accessorKey: 'no',
      header: 'No.',
      size: 50,
      Cell: ({ row }) => (
        <Typography sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{row.index + 1}</Typography>
      ),
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
      accessorKey: 'upload',
      header: 'Upload',
      size: 100,
      Cell: ({ cell }) => (
        <Typography variant="body2">{cell.getValue()}</Typography>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      size: 150,
      Cell: ({ cell }) => (
        <Typography variant="body2">{cell.getValue()}</Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 100,
      Cell: ({ cell }) => {
        const status = cell.getValue();
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
              onChange={() => handleStatusChange(cell.row.original.id)}
            />
          </Box>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 200,
      Cell: ({ cell }) => {
        const approved = cell.row.original.approved;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" color="default">
              <VisibilityIcon />
            </IconButton>
            <IconButton size="small" color="error">
              <DeleteIcon />
            </IconButton>
            <Button
              variant="contained"
              size="small"
              // color={approved === 'approved' ? 'success' : 'default'}
              sx={{
                backgroundColor: approved === 'approved' ? 'green' : 'grey',
                color: approved === 'approved' ? 'white' : 'black'
              }}
              onClick={() => handleApprovalChange(cell.row.original.id)}
            >
              {approved === 'approved' ? 'Approved' : 'Approve'}
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
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
      )}
    </Box>
  );
};

export default OwnerListTable;
