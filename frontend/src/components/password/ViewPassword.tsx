import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ContentCopy,
  ArrowBack,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { passwordService } from '../../services/password.service';
import Loading from '../common/Loading';
import PasswordRequest from './PasswordRequest';
import { Password } from '../../types';

export const ViewPassword: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState<Password | null>(null);
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);

  useEffect(() => {
    const fetchPassword = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const data = await passwordService.getPasswordById(id);
        setPassword(data);

        // Try to get decrypted password if user has access
        try {
          const viewData = await passwordService.viewPassword(id);
          setDecryptedPassword(viewData.password);
        } catch (viewError) {
          // User doesn't have access yet
          setDecryptedPassword(null);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load password');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPassword();
  }, [id]);

  const handleCopyPassword = () => {
    if (decryptedPassword) {
      navigator.clipboard.writeText(decryptedPassword);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleCopyUsername = () => {
    if (password?.username) {
      navigator.clipboard.writeText(password.username);
    }
  };

  if (isLoading) {
    return <Loading message="Loading password details..." />;
  }

  if (error || !password) {
    return (
      <Box>
        <Alert severity="error">{error || 'Password not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/passwords')}>
          Back to Passwords
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/passwords')}
        sx={{ mb: 2 }}
      >
        Back to Passwords
      </Button>

      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Typography variant="h4" component="h1">
              {password.title}
            </Typography>
            {password.isShared && (
              <Chip label="Shared" color="primary" />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {copySuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password copied to clipboard!
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Username/Email"
              value={password.username}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopyUsername} edge="end">
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {decryptedPassword ? (
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={decryptedPassword}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                      <IconButton onClick={handleCopyPassword} edge="end">
                        <ContentCopy />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 1 }}>
                  You don't have access to view this password yet. Please request
                  access.
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => setOpenRequestDialog(true)}
                >
                  Request Access
                </Button>
              </Box>
            )}

            {password.url && (
              <Box display="flex" alignItems="center" gap={1}>
                <LinkIcon color="action" />
                <Typography
                  component="a"
                  href={password.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  {password.url}
                </Typography>
              </Box>
            )}

            {password.category && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category
                </Typography>
                <Chip label={password.category} variant="outlined" />
              </Box>
            )}

            {password.notes && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body1">{password.notes}</Typography>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(password.createdAt).toLocaleString()}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                Last Updated: {new Date(password.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {id && (
        <PasswordRequest
          open={openRequestDialog}
          onClose={() => setOpenRequestDialog(false)}
          passwordId={id}
          passwordTitle={password.title}
        />
      )}
    </Box>
  );
};

export default ViewPassword;
