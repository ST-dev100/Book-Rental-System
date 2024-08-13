import React from 'react';
import { Box, Typography } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './Components/AdminSidebar';
import { useSelector } from 'react-redux';
import { Can } from '@casl/react';
import { getAbility } from '../store/authSlice'; // Import the getAbility function

const AdminDashboard = () => {
  const location = useLocation();
  const userRole = useSelector((state) => state.auth.userRole); // Get the user role from Redux
  const ability = getAbility({ auth: { abilityRole: userRole } }); // Generate the ability object

  // Extract the last part of the URL path for the title
  const path = location.pathname.split('/').filter(Boolean);
  const pageTitle = path.length > 1 ? path[path.length - 1] : 'Dashboard';

  return (
    <Box display={'flex'} gap={1}>
      <Can I="manage" a="all" ability={ability}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 14, p: 1, backgroundColor: '#F5F5F5' }} display={'flex'} rowGap={2} flexDirection={'column'}>
          <Box flexGrow={1} sx={{ borderRadius: "10px", maxHeight: '10vh', backgroundColor: 'white' }}>
            <Typography variant="h5" p={2} sx={{ marginBottom: 3 }}>
              Admin/{pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)}
            </Typography>
          </Box>
          <Outlet />
        </Box>
      </Can>
      <Can not I="manage" a="all" ability={ability}>
        <Typography variant="h6" color="error">
          You do not have access to this section.
        </Typography>
      </Can>
    </Box>
  );
};

export default AdminDashboard;
