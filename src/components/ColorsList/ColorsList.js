import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './ColorsList.css';
import '../../../src/global.css';

function ColorsList({showError, showSuccess}) {   
    const [colors, setColors] = React.useState([]);
    const [colorsVisible, setColorsVisible] = React.useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = React.useState(false);
    const [colorToBeDeleted, setColorToBeDeleted] = React.useState();
    const [deletingColor, setDeletingColor] = React.useState(false);
    const navigate = useNavigate();
    
    const getColors = async() => {
      await fetch(`${process.env.REACT_APP_API_URI}/colors`)
      .then((res) => res.json())
      .then(async(res) => {
         if (res && !res.error && res.data) {
            setColors(res.data);
            setColorsVisible(true);
         } else {
            if (res && res.error) {
              showError(res.error);
            } else {
              showError('Please contact the site owner at conejoplata@gmail.com');
            }
         }
      }).catch((error) => {
        showError(error);
      });
    }

    const handleDeleteConfirmationClose = () => {
      setDeleteConfirmationOpen(false);
      setColorToBeDeleted(null);
    }

    const editColor = (color) => {
      navigate(`/color/edit/${color._id}?name=${color.name}&hex=${color.hex.replace('#','')}`);
    }

    const askToConfirmDeleteColor = (color) => {
      setColorToBeDeleted(color._id);
      setDeleteConfirmationOpen(true);
    }

    const addColor = () => {
     navigate(`/color/new`); 
    }

    const confirmDelete = async() => {
      setDeletingColor(true);

      await fetch(`${process.env.REACT_APP_API_URI}/color`, {   
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'DELETE', 
        body: JSON.stringify({id: colorToBeDeleted }) 
      })
      .then((res) => res.json())
      .then(async(res) => {
         if (res && !res.error && res.data) {
            setColorsVisible(false);
            showSuccess('Color deleted successfully');
            getColors();
         } else {
            if (res && res.error) {
              showError(res.error);
            } else {
              showError('Please contact the site owner at conejoplata@gmail.com');
            }
         }
         setDeleteConfirmationOpen(false);
         setColorToBeDeleted(null);
         setDeletingColor(false);
      }).catch((error) => {
        setDeleteConfirmationOpen(false);
        setColorToBeDeleted(null);
        showError(error);
        setDeletingColor(false);
      });
    }

    React.useEffect(() => {
      if (!colors.length) {
        getColors();
      }
    });

    return (
      <Container>
        <Paper variant="outlined" className="content-wrapper">
          <Typography variant="h1" className="title">Colors</Typography>

          {colorsVisible ? 
            (
              <div className="content-box">
                <Button variant="contained" className="add-color-button" onClick={addColor}>Add new color</Button>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>Hex</strong></TableCell>
                        <TableCell align="right"><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {colors.map((color) => (
                        <TableRow
                          key={color.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {color.name}
                          </TableCell>
                          <TableCell>
                            <span className="color-square" style={{backgroundColor:`${color.hex}`}}></span>
                            {` `}
                            <span>{color.hex}</span>
                          </TableCell>
                          <TableCell align="right">
                            <Button variant="contained" color="error" className="actionButton" onClick={() => askToConfirmDeleteColor(color)}>Delete</Button>
                            <Button variant="contained" className="actionButton" onClick={() => editColor(color)}>Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <span className="loading-text">Loading...</span>
            )}
        </Paper>
        <Dialog
          open={deleteConfirmationOpen}
          onClose={handleDeleteConfirmationClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this color?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={deletingColor} variant="text" color="info" onClick={handleDeleteConfirmationClose} autoFocus>Cancel</Button>
            <Button disabled={deletingColor} variant="contained" color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
  
  export default ColorsList;