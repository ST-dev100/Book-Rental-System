import { createSlice } from '@reduxjs/toolkit';
import { Ability, AbilityBuilder } from '@casl/ability';

// Function to define abilities based on user role
const defineAbilitiesFor = (userRole) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (userRole === 'admin') {
    can('manage', 'all'); // Admins can manage everything
  } else if (userRole === 'user') {
    can('read', 'Book'); // Regular users can only read books
    can('create', 'Book'); // Allow creating books
    can('delete', 'Book');
    can('update', 'Book');
  } else {
    cannot('read', 'Book'); // Guests cannot read books
  }

  return build();
};

// Note: Store user role as a string instead of storing Ability instance directly
const storedUserRole = localStorage.getItem('userRole');
const storedEmail = localStorage.getItem('email');

const initialState = {
  userRole: storedUserRole && storedEmail ? storedUserRole : null,
  userEmail: storedUserRole && storedEmail ? storedEmail : null,
  isLoggedIn: storedEmail && (storedUserRole === 'admin' || storedUserRole === 'user') ? true : false,
  // Store role only; we'll create an ability instance when needed
  abilityRole: storedUserRole || null // Or you could just keep it as null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userRole = action.payload.userRole;
      state.userEmail = action.payload.email;
      state.isLoggedIn = true;
      state.abilityRole = action.payload.userRole; // Store role only
      localStorage.setItem('userRole', action.payload.userRole);
      localStorage.setItem('email', action.payload.email);
    },
    logout: (state) => {
      state.userRole = null;
      state.userEmail = null;
      state.isLoggedIn = false;
      state.abilityRole = null; // Reset abilities role on logout
      localStorage.removeItem('userRole');
      localStorage.removeItem('email');
    },
  },
});

// Create the Ability instance when you need it
export const getAbility = (state) => defineAbilitiesFor(state.auth.abilityRole);

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
