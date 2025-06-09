import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      // Redirect admin to admin dashboard, regular users to home
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/';
      navigate(redirectPath, { replace: true });
    }
  }, [user, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if (!result) {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(typeof err === 'string' ? err : 'Login failed. Please try again.');
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: 1000,
          overflow: 'hidden',
          borderRadius: 4,
        }}
      >
        {/* Left side - Image */}
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              background: `linear-gradient(rgba(37, 99, 235, 0.8), rgba(37, 99, 235, 0.8)), url(https://source.unsplash.com/random?smartphone)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              p: 6,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Welcome Back!
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{ maxWidth: 400 }}>
              Log in to access your account and explore our latest collection of premium smartphones.
            </Typography>
          </Box>
        )}

        {/* Right side - Login form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, textAlign: { xs: 'center', sm: 'left' } }}
          >
            Login
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 4, textAlign: { xs: 'center', sm: 'left' } }}
          >
            Please enter your credentials to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" color="primary">
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage; 