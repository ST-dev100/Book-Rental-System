import React, { lazy, Suspense } from "react";
import { Box, Container } from "@mui/material";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from 'react-redux';

const OwnerDashboard = lazy(() => import("./Pages/OwnerDashboard"));
const OwnerFront = lazy(() => import("./Pages/owner/OwnerFrontPage"));
const OwnerUpload = lazy(() =>
  import("./Pages/owner/UploadBook")
);
const Signup = lazy(() => import("./Pages/Signup"));
const Login = lazy(() => import("./Pages/Login"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"));
const AdminFront = lazy(() => import("./Pages/Admin/AdminFrontPage"));
const AdminShowBooks = lazy(() => import("./Pages/Admin/AdminShowBooks"));
const OwnerListTable = lazy(() => import("./Pages/Admin/OwnersListTable"));
const App = () => {
  const A = true; // Replace with your condition
  const { userRole,userEmail , isLoggedIn } = useSelector((state) => state.auth);
  console.log(userRole,userEmail,isLoggedIn)
  return (
    <Container
      maxWidth={false}
      sx={{ backgroundColor: "#F5F5F5" }}
      disableGutters={true}
    >
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
             {/* Redirect the root path to /login */}
             <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={isLoggedIn && (userRole === 'admin') ? <AdminDashboard/> : <Navigate to = '/login'/>}>
              <Route path="dashboard" element={<AdminFront/>}/>
              <Route path="books" element={<AdminShowBooks />} />
              <Route path="owners" element={<OwnerListTable />} />
            </Route>
            <Route path="/owner" element={isLoggedIn ? <OwnerDashboard/>: <Navigate to = '/login'/>}>
              <Route path="dashboard" element={<OwnerFront/>} />  
              <Route path="upload" element={<OwnerUpload/>} />  
            </Route>
          </Routes>
        </Suspense>
        <Toaster/>
      </BrowserRouter>
      {/* <Dashboard /> */}
      {/* <OwnerBookUpload/> */}
      {/* <AdminBooks/> */}
      {/* <Signup/> */}
      {/* <Login/> */}
    </Container>
  );
};

export default App;
