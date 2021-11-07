import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import { ChromePicker } from 'react-color';
import '../../../src/global.css';

function AddNewColor({showSuccess, showError}) {   
    const [colorName, setColorName] = React.useState('');
    const [hex, setHex] = React.useState('');
    const [errors, setErrors] = React.useState({});
    const [saving, setSaving] = React.useState(false);
    const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
    const navigate = useNavigate();

    const handleValidation = () => {
        let errs = {};
        if (!hex) {
            errs['hex'] = "A hex color code is required.";
        }
        if (!colorName) {
            errs['colorName'] = "A color name is required.";
        }
        setErrors(errs);

        if (!hex || !colorName) {
            return false;
        }

        return true;
    }
    
    const saveColor = async() => {
      if (!handleValidation()) {
        return false;
      }

      setSaving(true);

      await fetch(`${process.env.REACT_APP_API_URI}/color`, {   
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'POST', 
        body: JSON.stringify({name: colorName, hex: hex}) 
      })
      .then((res) => res.json())
      .then(async(res) => {
         if (res && !res.error && res.data) {
            showSuccess(`Color ${colorName} was added successfully!`);
            setSaving(false);
            navigate(`/`);
         } else {
            if (res && res.error) {
                showError(res.error);
            } else {
                showError('Please contact the site owner at conejoplata@gmail.com');
            }
            setSaving(false);
         }
       }).catch((error) => {
            showError(error);
            setSaving(false);
       });
    }

    const updateColorName = (evt) => {
        setColorName(evt.target.value);
    }

    const changeColor = (color) => {
        setHex(color.hex);
        setDisplayColorPicker(false);
    }

    const updateHex = (evt) => {
        setHex(evt.target.value);
    }

    const goBack = () => {
        navigate(`/`);
    }

    return (
        <>
            <Container sx={{marginTop: '30px'}}>
                <Button variant="text" onClick={saveColor} onClick={goBack} className="back-button">← Back</Button>
                <Paper variant="outlined" className="content-wrapper with-back">
                    <Typography variant="h1" className="title">Add new color</Typography>
                    <Box
                        component="form"
                        sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div>
                            <TextField
                                required
                                label="Color name"
                                placeholder="Example: 'gray-dark'"
                                aria-placeholder="Example: 'gray-dark'"
                                onChange={updateColorName}
                                value={colorName}
                                error={errors['colorName'] ? true : false}
                                helperText={errors['colorName'] ? errors['colorName'] : ''}
                            />
                            <TextField
                                required
                                label="Hex code"
                                placeholder="Example: #ffffff"
                                aria-placeholder="Example: #ffffff"
                                value={hex}
                                error={errors['hex'] ? true : false}
                                helperText={errors['hex'] ? errors['hex'] : ''}
                                onChange={updateHex}
                            />
                            <div className="color-picker-container">
                                <Button onClick={() => setDisplayColorPicker(true)} className="color-picker-button" style={{backgroundColor:`${hex}`}}></Button>
                                { displayColorPicker ? 
                                    (<div className="color-picker">
                                        <ChromePicker onChangeComplete={changeColor} />
                                    </div>) : null
                                }  
                            </div>
                        </div>
                        <Button disabled={saving} variant="contained" className="save-button" onClick={saveColor}>Save</Button>
                    </Box>
                </Paper>       
            </Container>
        </>
    );
  }
  
  export default AddNewColor;