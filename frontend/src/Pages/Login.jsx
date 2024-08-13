import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography, Container, Grid, Paper } from '@mui/material';
import { z } from 'zod';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Import toast
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean(),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate(); // Hook to navigate programmatically
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://book-rental-system-qctq.vercel.app/api/users/login', data, { withCredentials: true });
      console.log(response.data);
      
      toast.success('Login successful!');
      // Assuming the response contains userRole, and it’s either "admin" or "user"
      const userRole = response.data.userRole;
          // Dispatch the loginSuccess action to save userRole and token in Redux
      dispatch(loginSuccess(response.data));

      if (userRole === 'admin') {
        navigate('/admin/dashboard'); // Navigate to admin dashboard
      } else if (userRole === 'user') {
        navigate('/owner/dashboard'); // Navigate to user dashboard
      }
      
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please check your credentials and try again.'); // Show error message
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundColor: '#111E3E',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Box
            component="svg"
            viewBox="0 0 24 24"
            sx={{ width: 150, height: 150, fill: 'white' }}
          >
            <path d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65 c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5 c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5 c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z" />
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Login into Book Rent
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Email address"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <FormControlLabel
              control={<Checkbox {...register('remember')} />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              LOGIN
            </Button>
            <Grid container>
              <Grid item>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Haven't an account? <Link to="/signup">Sign up</Link> {/* Using Link here */}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
