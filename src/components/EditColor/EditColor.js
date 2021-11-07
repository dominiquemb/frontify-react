import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ChromePicker } from 'react-color';
import '../../../src/global.css';

function EditColor({showSuccess, showError}) {   
    const [errors, setErrors] = React.useState({});
    const [saving, setSaving] = React.useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const queryParamsRaw = useLocation().search;
    const queryParams = new URLSearchParams(queryParamsRaw);
    const oldColorName = queryParams.get('name') ? queryParams.get('name') : null;
    const oldHex = queryParams.get('hex') ? '#' + queryParams.get('hex') : null;
    const [colorName, setColorName] = React.useState(oldColorName ? oldColorName : '');
    const [hex, setHex] = React.useState(oldHex ? oldHex : '');
    const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

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
        method: 'PUT', 
        body: JSON.stringify({id: id, name: colorName, hex: hex}) 
      })
      .then((res) => res.json())
      .then(async(res) => {
         if (res && !res.error && res.data) {
            showSuccess(`Color ${colorName} was edited successfully!`);
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

    const changeColor = (color) => {
        setHex(color.hex);
    }

    const updateColorName = (evt) => {
        setColorName(evt.target.value);
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
                    <Typography variant="h1" className="title">Edit color</Typography>
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
                                        <ChromePicker color={hex} onChangeComplete={changeColor} />
                                        <Button variant="contained" style={{marginTop: '10px'}} onClick={() => setDisplayColorPicker(false)}>Close</Button>
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
  
  export default EditColor;