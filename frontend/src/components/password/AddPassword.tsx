import React, { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { usePasswordManager } from '../../hooks/usePasswordManager';
import { PasswordInput } from '../../types';

interface AddPasswordProps {
  onClose: () => void;
}

const CATEGORIES = [
  'Social Media',
  'Email',
  'Banking',
  'Work',
  'Shopping',
  'Entertainment',
  'Other',
];

export const AddPassword: React.FC<AddPasswordProps> = ({ onClose }) => {
  const { createPassword } = usePasswordManager();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordInput>();

  const onSubmit = async (data: PasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await createPassword(data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>Add New Password</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Title"
            margin="normal"
            autoFocus
            {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters',
              },
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            fullWidth
            label="Username/Email"
            margin="normal"
            {...register('username', {
              required: 'Username is required',
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="URL (optional)"
            margin="normal"
            {...register('url')}
            error={!!errors.url}
            helperText={errors.url?.message}
          />

          <TextField
            fullWidth
            select
            label="Category (optional)"
            margin="normal"
            defaultValue=""
            {...register('category')}
          >
            <MenuItem value="">None</MenuItem>
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Notes (optional)"
            margin="normal"
            multiline
            rows={3}
            {...register('notes')}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Password'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default AddPassword;
