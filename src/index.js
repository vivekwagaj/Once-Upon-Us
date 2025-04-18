import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext.jsx";
import "./index.css";
import { MomentsProvider } from './context/MomentsContext';


ReactDOM.createRoot(document.getElementById("root")).render(

    <BrowserRouter>
      <AuthProvider>
              <MomentsProvider>

        <App />
        </MomentsProvider>
      </AuthProvider>
    </BrowserRouter>

);
