import React from 'react';
import { Autocomplete, TextField, Button, Paper, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const options = ['Book 1', 'Book 2'];

const SearchDropdown = () => {
  return (
    <Autocomplete
      freeSolo
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search book by name or Author"
          placeholder="Search..."
          variant="outlined"
          sx={{ width: '300px' }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          {option}
        </li>
      )}
      PaperComponent={({ children }) => (
        <Paper elevation={8}>
          {children}
          <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0' }}>
            <Button
              startIcon={<AddIcon />}
              fullWidth
              sx={{ justifyContent: 'flex-start', color: 'primary.main' }}
            >
              Add
            </Button>
          </Box>
        </Paper>
      )}
    />
  );
};

export default SearchDropdown;