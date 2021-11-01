import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';

function Login() {   
    const [shopName, setShopName] = React.useState('');
    const stateToken = uuidv4();
    const redirectPath = `${shopName}admin/oauth/authorize?client_id=${process.env.REACT_APP_SHOPIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SHOPIFY_REDIRECT_URI}&response_type=code&scope=read_customers&stateToken=${stateToken}&grant_options[]=true`;
    const onShopNameChange = (evt) => {
        setShopName(`https://${evt.target.value}.myshopify.com/`);
    }

    React.useEffect(() => {
      localStorage.setItem('state', stateToken);
    });

    return (
      <>
        <Box
        component="form"
        sx={{
            margin: 'auto',
            display: 'flex',
            width: 400,
            height: 400,
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'center',

        }}
        noValidate
        autoComplete="off"
        >
          <Typography variant="body1">Please enter your shopify name below:</Typography>
          <TextField id="outlined-basic" label="Shop name" onChange={onShopNameChange} variant="outlined" sx={{width: '100%'}} />
          <a
            href={redirectPath}>
            <Button variant="contained">Connect</Button>
          </a>
        </Box>
      </>
    );
  }
  
  export default Login;