import React from 'react'
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography,  Card, CardContent, Divider, Button  } from '@mui/material';import LiveBookStatus from './Components/LiveBookStatus';
import { Outlet, useLocation } from 'react-router-dom';
import OwnerSidebar from './Components/OwnerSidebar';

const OwnerDashboard = () => {
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean);
  const pageTitle = path.length > 1 ? path[path.length - 1] : 'Dashboard';
  return (
  <Box display={'flex'} gap={1}>  
    <OwnerSidebar/>
    <Box sx={{ flexGrow: 14, p: 1, backgroundColor: '#F5F5F5' }} display={'flex'} rowGap={2} flexDirection={'column'}>
      <Box flexGrow={1} sx={{borderRadius:"10px",maxHeight:'10vh',backgroundColor:'white'}}>
        <Typography variant="h5" p={2} sx={{ marginBottom: 3 }}>Owner/{pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)}</Typography>
      </Box>
      <Outlet/>
   </Box>
  </Box>  
  )
}

export default OwnerDashboard