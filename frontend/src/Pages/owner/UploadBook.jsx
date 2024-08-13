import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast} from 'react-hot-toast'; // Import toast


const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  bookNumber: z.string().min(1, "Book Number is required"),
  quantity: z.number().min(1).max(100, "Quantity must be between 1 and 100"),
  price: z.string().min(1, "Price is required"),
  bookCover: z.any(),
  category: z.string().min(1, "Category is required"),
});

const UploadBookComponent = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [options, setOptions] = useState(['none']);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("http://localhost:5000/owner/book-catagory/list", {credentials: "include"});
        const data = await response.json();
        console.log("empty", data);
        setOptions(data); // Assuming the server returns an array of book names or categories
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("bookNumber", data.bookNumber);
    formData.append("quantity", data.quantity);
    formData.append("price", data.price);
    formData.append("bookCover", data.bookCover); // Updated: No need to access bookCover[0] here
    formData.append("category", data.category);

    try {
      const response = await fetch("http://localhost:5000/owner/books/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        toast.success(' successfully Added a Book!'); // Success message
      } else {
        toast.error('Book registration error!'); // Success message
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading the book.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("bookCover", file); // Updated: Set the file in the form data
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "10px",
      }}
      gap={6}
      flexGrow={1}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Upload New Book
      </Typography>

      <Autocomplete
  freeSolo
  options={options}
  sx={{ mt: -5 }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Search book by name or Author"
      placeholder="Search..."
      variant="outlined"
      sx={{ width: "300px" }}
      error={!!errors.category}
      helperText={errors.category?.message}
    />
  )}
  onInputChange={(_, value) => setValue("category", value)}
  renderOption={(props, option, { index }) => (
    <li {...props} key={index}>{option}</li>
  )}
  PaperComponent={({ children }) => (
    <Paper elevation={8}>
      {children}
      <Box sx={{ p: 1, borderTop: "1px solid #e0e0e0" }}>
        <Button
          startIcon={<AddIcon />}
          fullWidth
          sx={{ justifyContent: "flex-start", color: "primary.main" }}
        >
          Add
        </Button>
      </Box>
    </Paper>
  )}
/>


      <TextField
        placeholder="Book Title"
        variant="outlined"
        sx={{ width: "50%", mt: 13 }}
        {...register("title")}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        placeholder="Book Number"
        variant="outlined"
        sx={{ width: "50%", mt: 1 }}
        {...register("bookNumber")}
        error={!!errors.bookNumber}
        helperText={errors.bookNumber?.message}
      />

      <Box
        sx={{ display: "flex", justifyContent: "center", width: "100%", mb: 3 }}
      >
        <TextField
          type="number"
          placeholder="Book Quantity"
          variant="outlined"
          sx={{ width: "150px", mr: 1 }}
          {...register("quantity", { valueAsNumber: true })}
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
        />

        <TextField
          placeholder="Rent price for 2 weeks"
          variant="outlined"
          sx={{ width: "250px" }}
          {...register("price")}
          error={!!errors.price}
          helperText={errors.price?.message}
        />
      </Box>

      <Button
        variant="text"
        startIcon={<CloudUpload />}
        component="label"
        sx={{ mb: 4 }}
      >
        Upload Book Cover
        <input
          type="file"
          hidden
          accept="image/*"
          {...register("bookCover")}
          onChange={handleImageUpload}
        />
      </Button>

      {imagePreview && (
        <Box
          component="img"
          src={imagePreview}
          alt="Image preview"
          sx={{ mb: 4, maxHeight: "200px" }}
        />
      )}

      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#00aaff",
          width: "200px",
          height: "50px",
          fontSize: "16px",
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default UploadBookComponent;
