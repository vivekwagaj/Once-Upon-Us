import './App.css';

import React from 'react';
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import CreateMomentForm from "./pages/CreateMomentForm";
import Memories from "./pages/Memories"
import PrivateRoute from "./components/auth/PrivateRoute";
import MemoryPath from "./pages/MemoryPathPage";
import RandomGenerator from "./pages/RandomGenerator";
import WelcomePage from "./pages/WelcomePage"

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
       <Route
           path="/surprise"
           element={
             <PrivateRoute>
               <RandomGenerator />
             </PrivateRoute>
           }
       />
       <Route path="/welcome" element={<WelcomePage />} />
    </Routes>

  );

}

export default App;
