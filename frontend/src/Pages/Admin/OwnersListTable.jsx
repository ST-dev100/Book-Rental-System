import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Switch, IconButton, Button } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';

const OwnerListTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenRows, setHiddenRows] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/ownerlist', {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch(`http://localhost:5000/admin/update-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setData(data.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleApprovalChange = async (id, currentApproval) => {
    const newApproval = currentApproval === 'approved' ? 'notapproved' : 'approved';
    try {
      const response = await fetch(`http://localhost:5000/admin/update-approval/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ approved: newApproval })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setData(data.map(item =>
        item.id === id ? { ...item, approved: newApproval } : item
      ));
    } catch (error) {
      console.error('Error updating approval:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/delete-user/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleVisibility = (id) => {
    setHiddenRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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
      Cell: ({ cell, row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={cell.row.original.avatar} sx={{ width: 24, height: 24, marginRight: 1 }} />
          <Typography variant="body2">{hiddenRows[row.id] ? '.....' : cell.getValue()}</Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'upload',
      header: 'Upload',
      size: 100,
      Cell: ({ cell, row }) => (
        <Typography variant="body2">{hiddenRows[row.id] ? '.....' : cell.getValue()}</Typography>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      size: 150,
      Cell: ({ cell, row }) => (
        <Typography variant="body2">{hiddenRows[row.id] ? '.....' : cell.getValue()}</Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 100,
      Cell: ({ cell, row }) => {
        const status = cell.getValue();
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {hiddenRows[row.id] ? '.....' : (
              <>
                <CheckIcon sx={{ color: status === 'active' ? 'green' : 'red', marginRight: 1 }} />
                <Typography variant="body2" sx={{ color: status === 'active' ? 'green' : 'red' }}>
                  {status}
                </Typography>
                <Switch
                  checked={status === 'active'}
                  size="small"
                  color="success"
                  sx={{ marginLeft: 1 }}
                  onChange={() => handleStatusChange(cell.row.original.id, status)}
                />
              </>
            )}
          </Box>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 200,
      Cell: ({ row }) => {
        const approved = row.original.approved;
        const isHidden = hiddenRows[row.id];
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" color="default" onClick={() => toggleVisibility(row.id)}>
              {isHidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            <IconButton size="small" color="error" onClick={() => handleDelete(row.original.id)}>
              <DeleteIcon />
            </IconButton>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: approved === 'approved' ? 'green' : 'grey',
                color: approved === 'approved' ? 'white' : 'black'
              }}
              onClick={() => handleApprovalChange(row.original.id, approved)}
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
