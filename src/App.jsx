import './App.css';

import React from 'react';
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import CreateMomentForm from "./pages/CreateMomentForm";
import Memories from "./pages/Memories"
import PrivateRoute from "./components/auth/PrivateRoute";
import MemoryPath from "./pages/MemoryPathPage";

function App() {
  return (
    <Routes>
       <Route path="/" element={<AuthPage />} />
       <Route path="/memory-path" element={<MemoryPath />} />
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
       <Route
          path="/memories/:id"
          element={
            <PrivateRoute>
              <Memories />
            </PrivateRoute>
          }
       />
    </Routes>

  );

}

export default App;
