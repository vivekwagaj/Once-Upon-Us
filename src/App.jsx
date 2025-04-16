import './App.css';



import React from 'react';
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import CreateMomentForm from "./pages/CreateMomentForm";

import PrivateRoute from "./components/auth/PrivateRoute";
import Memories from "./pages/Memories";

function App() {
  return (

    <Routes>
       <Route path="/" element={<AuthPage />} />
       <Route path="/sample" element={<Memories />} />
       <Route
               path="/home"
               element={
                 <PrivateRoute>
                   <Home />
                 </PrivateRoute>
               }
             />
       <Route
                      path="/add-moment"
                      element={
                        <PrivateRoute>
                          <CreateMomentForm />
                        </PrivateRoute>
                      }
                    />
    </Routes>
  );

}

export default App;
