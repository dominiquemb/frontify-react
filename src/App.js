import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
  Link,
  useLocation
} from "react-router-dom";
import ShopifyRedirect from './components/ShopifyRedirect/ShopifyRedirect';
import Login from './components/Login/Login';

function App() {
  return (
    <Router>
       <Routes>
        <Route path="/auth/shopify/callback" element={<ShopifyRedirect />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
