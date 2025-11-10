import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { CheckCircle, Cancel, Person, AccessTime } from '@mui/icons-material';
import { usePasswordManager } from '../../hooks/usePasswordManager';
import { PasswordRequest } from '../../types';

interface RequestApprovalProps {
  requests: PasswordRequest[];
  readOnly?: boolean;
}

interface ReviewDialogState {
  open: boolean;
  request: PasswordRequest | null;
  action: 'approve' | 'reject' | null;
}

export const RequestApproval: React.FC<RequestApprovalProps> = ({
  requests,
  readOnly = false,
}) => {
  const { approveRequest, rejectRequest } = usePasswordManager();
  const [reviewDialog, setReviewDialog] = useState<ReviewDialogState>({
    open: false,
    request: null,
    action: null,
  });
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReviewClick = (
    request: PasswordRequest,
    action: 'approve' | 'reject'
  ) => {
    setReviewDialog({ open: true, request, action });
    setAdminNotes('');
    setError(null);
  };

  const handleCloseDialog = () => {
    setReviewDialog({ open: false, request: null, action: null });
    setAdminNotes('');
    setError(null);
  };

  const handleConfirmReview = async () => {
    if (!reviewDialog.request) return;

    setIsProcessing(true);
    setError(null);

    try {
      if (reviewDialog.action === 'approve') {
        await approveRequest(reviewDialog.request.id, adminNotes);
      } else {
        await rejectRequest(reviewDialog.request.id, adminNotes);
      }
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to process request');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Stack spacing={2}>
        {requests.map((request) => (
          <Card key={request.id} variant="outlined">
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom>
                    {request.passwordTitle}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Requested by: <strong>{request.requesterUsername}</strong>
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(request.createdAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Typography variant="body2" gutterBottom>
                    <strong>Reason:</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {request.reason}
                  </Typography>

                  <Chip
                    label={request.status.toUpperCase()}
                    color={getStatusColor(request.status)}
                    size="small"
                  />

                  {request.reviewedBy && (
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Reviewed by {request.reviewedBy} on{' '}
                      {request.reviewedAt &&
                        new Date(request.reviewedAt).toLocaleString()}
                    </Typography>
                  )}
                </Box>

                {!readOnly && request.status === 'pending' && (
                  <Box display="flex" gap={1} ml={2}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleReviewClick(request, 'approve')}
                      size="small"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleReviewClick(request, 'reject')}
                      size="small"
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog
        open={reviewDialog.open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {reviewDialog.action === 'approve' ? 'Approve' : 'Reject'} Request
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" gutterBottom>
            Password: <strong>{reviewDialog.request?.passwordTitle}</strong>
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
            Requester:{' '}
            <strong>{reviewDialog.request?.requesterUsername}</strong>
          </Typography>

          <TextField
            fullWidth
            label="Admin Notes (optional)"
            multiline
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add any notes about this decision..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmReview}
            variant="contained"
            color={reviewDialog.action === 'approve' ? 'success' : 'error'}
            disabled={isProcessing}
          >
            {isProcessing
              ? 'Processing...'
              : reviewDialog.action === 'approve'
              ? 'Approve'
              : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestApproval;
