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
import ColorsList from './components/ColorsList/ColorsList';
import AddNewColor from './components/AddNewColor/AddNewColor';
import EditColor from './components/EditColor/EditColor';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function App() {
  const [showError, setShowError] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [success, setSuccess] = React.useState('');

  const triggerSuccess = (msg) => {
    setShowSuccess(true);
    setSuccess(msg);
  }

  const triggerError = (msg) => {
    setShowError(true);
    setError(msg);
  }

  const handleErrorClose = () => {
    setShowError(false);
    setError('');
  }

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSuccess('');
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/color/edit/:id" element={<EditColor showSuccess={triggerSuccess} showError={triggerError} />} />
          <Route path="/color/new" element={<AddNewColor showSuccess={triggerSuccess} showError={triggerError} />} />
          <Route path="/" element={<ColorsList showSuccess={triggerSuccess} showError={triggerError} />} />
        </Routes>
      </Router>
      <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={handleSuccessClose}
          >
          <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
              {success}
          </Alert>
      </Snackbar>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {`An error occurred: ${error}`}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
