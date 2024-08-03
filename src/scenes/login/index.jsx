import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from '../../utility/axiosConfig';
import { useNavigate, Navigate } from 'react-router-dom';
import { BASEURL } from '../../data/endpoints';
import AuthContext from '../../utility/AuthContext';
import _ from 'lodash'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {/* <Link sx={{textDecoration: "none"}} color="inherit" href=""> */}
        {'Copyright ©  Mahmood Dari House '}
      {/* </Link> */}
      {' '}
      {'2024'}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
    const navigate  = useNavigate();

    const [password, setPassword] = React.useState("")
    const [componentLoading, setComponentLoading] = React.useState(true)
    const [loginUser, setLoginUser] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const {user, loading} = React.useContext(AuthContext)

const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`/login`, { email, password });
      const { token, role, firstName, lastName } = response.data;
      localStorage.setItem("token", token);
      const user = { role, firstName, lastName };
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
      window.location.reload();

    } catch (err) {
      console.error(err.response.data.message);
    }
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
        {
            !user ? <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container> : <Navigate to="/"/>
        }
    </ThemeProvider>
  );
}