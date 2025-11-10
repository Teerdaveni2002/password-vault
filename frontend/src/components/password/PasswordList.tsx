import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePasswordManager } from '../../hooks/usePasswordManager';
import Loading from '../common/Loading';
import AddPassword from './AddPassword';
import { Password } from '../../types';

export const PasswordList: React.FC = () => {
  const navigate = useNavigate();
  const { passwords, isLoading, fetchPasswords, deletePassword } =
    usePasswordManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPasswords(searchTerm);
  }, [fetchPasswords, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = (id: string) => {
    setPasswordToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (passwordToDelete) {
      try {
        await deletePassword(passwordToDelete);
        setDeleteConfirmOpen(false);
        setPasswordToDelete(null);
      } catch (error) {
        console.error('Failed to delete password:', error);
      }
    }
  };

  const handleView = (id: string) => {
    navigate(`/passwords/${id}`);
  };

  if (isLoading && passwords.length === 0) {
    return <Loading message="Loading passwords..." />;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          My Passwords
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Password
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search passwords..."
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
      />

      {passwords.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              No passwords found. Click "Add Password" to create your first entry.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {passwords.map((password: Password) => (
            <Grid item xs={12} sm={6} md={4} key={password.id}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Typography variant="h6" component="h2" noWrap>
                      {password.title}
                    </Typography>
                    {password.isShared && (
                      <Chip label="Shared" size="small" color="primary" />
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Username: {password.username}
                  </Typography>

                  {password.url && (
                    <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                      <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {password.url}
                      </Typography>
                    </Box>
                  )}

                  {password.category && (
                    <Chip
                      label={password.category}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  )}

                  <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleView(password.id)}
                      title="View"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(password.id)}
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <AddPassword onClose={() => setOpenAddDialog(false)} />
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this password? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PasswordList;
