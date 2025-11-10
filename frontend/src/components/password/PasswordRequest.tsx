import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { usePasswordManager } from '../../hooks/usePasswordManager';

interface PasswordRequestProps {
  open: boolean;
  onClose: () => void;
  passwordId: string;
  passwordTitle: string;
}

interface RequestForm {
  reason: string;
}

export const PasswordRequest: React.FC<PasswordRequestProps> = ({
  open,
  onClose,
  passwordId,
  passwordTitle,
}) => {
  const { requestPasswordAccess } = usePasswordManager();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestForm>();

  const onSubmit = async (data: RequestForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await requestPasswordAccess({
        passwordId,
        reason: data.reason,
      });
      setSuccess(true);
      setTimeout(() => {
        reset();
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request Password Access</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            You are requesting access to: <strong>{passwordTitle}</strong>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
              Request submitted successfully! An admin will review it shortly.
            </Alert>
          )}

          <TextField
            fullWidth
            label="Reason for access"
            multiline
            rows={4}
            margin="normal"
            placeholder="Please provide a reason for requesting access to this password..."
            {...register('reason', {
              required: 'Please provide a reason for your request',
              minLength: {
                value: 10,
                message: 'Reason must be at least 10 characters',
              },
            })}
            error={!!errors.reason}
            helperText={errors.reason?.message}
            disabled={isLoading || success}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || success}
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PasswordRequest;
