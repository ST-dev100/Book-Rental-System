import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Button, useMediaQuery } from '@mui/material';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useDispatch } from 'react-redux'; // Import useDispatch hook
import { logout } from '../../store/authSlice'; // Import the logout action

const AdminSidebar = () => {
  const dispatch = useDispatch(); // Set up dispatch hook
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    // Optionally, redirect the user after logout
    // history.push('/login');
  };

  return (
    <Box
      p={2}
      flexGrow={1}
      sx={{
        borderRadius: "10px",
        backgroundColor: '#1A1A2E',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px', justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
          <MenuIcon sx={{ minWidth: 'unset', justifyContent: 'center' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: '8px' }}>
            {!isSmallScreen && 'Book Rent'}
          </Typography>
        </Box>
        <List>
          <ListItem button component={NavLink} to="/admin/dashboard"
            sx={{ 
              borderRadius: '4px', 
              marginBottom: '8px', 
              justifyContent: isSmallScreen ? 'center' : 'flex-start',
              '&.active': { backgroundColor: '#007BFF' } 
            }}>
            <ListItemIcon sx={{ minWidth: 'unset', justifyContent: 'center', marginRight: '8px' }}>
              <DashboardIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {!isSmallScreen && <ListItemText primary="Dashboard" />}
          </ListItem>
          <ListItem button component={NavLink} to="/admin/books"
            sx={{ 
              justifyContent: isSmallScreen ? 'center' : 'flex-start', 
              '&.active': { backgroundColor: '#007BFF' } 
            }}>
            <ListItemIcon sx={{ minWidth: 'unset', justifyContent: 'center', marginRight: '8px' }}>
              <UploadFileIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {!isSmallScreen && <ListItemText primary="Books" />}
          </ListItem>

          <ListItem button component={NavLink} to="/admin/owners"
            sx={{ 
              justifyContent: isSmallScreen ? 'center' : 'flex-start', 
              '&.active': { backgroundColor: '#007BFF' } 
            }}>
               <ListItemIcon sx={{ minWidth: 'unset', justifyContent: 'center', marginRight: '8px' }}>
                    <PersonOutlineIcon sx={{ color: 'white' }}/>
               </ListItemIcon>
               {!isSmallScreen && <ListItemText primary="Owners" />}
          </ListItem>
          {/* Repeat similarly for other items */}
        </List>
        <Divider sx={{ backgroundColor: 'white', marginY: '16px' }} />
        <List>
          <ListItem button component={NavLink} to="/admin/notifications"
            sx={{ 
              justifyContent: isSmallScreen ? 'center' : 'flex-start', 
              '&.active': { backgroundColor: '#007BFF' } 
            }}>
            <ListItemIcon sx={{ minWidth: 'unset', justifyContent: 'center', marginRight: '8px' }}>
              <NotificationsIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {!isSmallScreen && <ListItemText primary="Notification" />}
          </ListItem>
          <ListItem button component={NavLink} to="/admin/settings"
            sx={{ 
              justifyContent: isSmallScreen ? 'center' : 'flex-start', 
              '&.active': { backgroundColor: '#007BFF' } 
            }}>
            <ListItemIcon sx={{ minWidth: 'unset', justifyContent: 'center', marginRight: '8px' }}>
              <SettingsIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {!isSmallScreen && <ListItemText primary="Setting" />}
          </ListItem>
          <ListItem button component={NavLink} to="/admin/adminpanel"
            sx={{ 
              justifyContent: isSmallScreen ? 'center' : 'flex-start', 
              '&.active': { backgroundColor: '#007BFF' } 
            }}>
            <ListItemIcon sx={{ minWidth: 'unset', justifyContent: 'center', marginRight: '8px' }}>
              <AdminPanelSettingsIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {!isSmallScreen && <ListItemText primary="Login as Admin" />}
          </ListItem>
        </List>
      </Box>
      <Box sx={{ marginBottom: '0px' }}>
        <Button
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout} // Handle logout on button click
          sx={{
            width: '100%',
            backgroundColor: '#3F4E4F',
            color: 'white',
            '&:hover': { backgroundColor: '#3F4E4F' }
          }}
        >
          {!isSmallScreen && 'Logout'}
        </Button>
      </Box>
    </Box>
  );
}

export default AdminSidebar;
