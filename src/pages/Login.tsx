import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Lock, Info, Building2 } from 'lucide-react';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (password === import.meta.env.VITE_PORTAL_PASSWORD) {
        if (rememberMe) {
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          sessionStorage.setItem('isAuthenticated', 'true');
        }
        navigate('/agent-portal');
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue/5 to-brand-gold/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue/10 mb-4">
              <Building2 className="w-8 h-8 text-brand-blue" />
            </div>
            <Typography 
              component="h1" 
              variant="h4" 
              className="text-gray-900 font-bold"
              gutterBottom
            >
              Agent Portal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access your transaction tools and resources
            </Typography>
          </div>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: 'error.main'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ mt: 1 }}
            className="space-y-4"
          >
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'brand.blue',
                  },
                },
                '& .Mui-focused fieldset': {
                  borderColor: 'brand.blue !important',
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  sx={{ 
                    color: 'brand.blue',
                    '&.Mui-checked': {
                      color: 'brand.blue',
                    },
                  }}
                />
              }
              label="Remember me on this device"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3,
                py: 1.5,
                bgcolor: 'brand.blue',
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'brand.darkBlue',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Access Portal'}
            </Button>

            <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-start space-x-3">
              <Info className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" />
              <Typography variant="body2" color="text.secondary">
                Need access to the portal? Contact Debbie at{' '}
                <a 
                  href="mailto:debbie@parealestatesupport.com" 
                  className="text-brand-blue hover:text-brand-darkBlue font-medium"
                >
                  debbie@parealestatesupport.com
                </a>
              </Typography>
            </div>
          </Box>
        </Paper>
      </motion.div>
    </div>
  );
};

export default Login; 