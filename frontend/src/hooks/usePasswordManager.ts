import { useState, useCallback } from 'react';
import { passwordService } from '../services/password.service';
import {
  Password,
  PasswordInput,
  PasswordRequest,
  PasswordRequestInput,
} from '../types';

export const usePasswordManager = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [requests, setRequests] = useState<PasswordRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPasswords = useCallback(async (search?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await passwordService.getPasswords(1, search);
      setPasswords(response.results);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch passwords');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async (status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await passwordService.getPasswordRequests(status);
      setRequests(response.results);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch requests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPassword = useCallback(async (data: PasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPassword = await passwordService.createPassword(data);
      setPasswords((prev) => [newPassword, ...prev]);
      return newPassword;
    } catch (err: any) {
      setError(err.message || 'Failed to create password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePassword = useCallback(
    async (id: string, data: Partial<PasswordInput>) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedPassword = await passwordService.updatePassword(id, data);
        setPasswords((prev) =>
          prev.map((p) => (p.id === id ? updatedPassword : p))
        );
        return updatedPassword;
      } catch (err: any) {
        setError(err.message || 'Failed to update password');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deletePassword = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await passwordService.deletePassword(id);
      setPasswords((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPasswordAccess = useCallback(
    async (data: PasswordRequestInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const newRequest = await passwordService.requestPassword(data);
        setRequests((prev) => [newRequest, ...prev]);
        return newRequest;
      } catch (err: any) {
        setError(err.message || 'Failed to request password access');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const approveRequest = useCallback(
    async (requestId: string, adminNotes?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedRequest = await passwordService.approvePasswordRequest({
          requestId,
          approved: true,
          adminNotes,
        });
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? updatedRequest : r))
        );
        return updatedRequest;
      } catch (err: any) {
        setError(err.message || 'Failed to approve request');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const rejectRequest = useCallback(
    async (requestId: string, adminNotes?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedRequest = await passwordService.rejectPasswordRequest(
          requestId,
          adminNotes
        );
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? updatedRequest : r))
        );
        return updatedRequest;
      } catch (err: any) {
        setError(err.message || 'Failed to reject request');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    passwords,
    requests,
    isLoading,
    error,
    fetchPasswords,
    fetchRequests,
    createPassword,
    updatePassword,
    deletePassword,
    requestPasswordAccess,
    approveRequest,
    rejectRequest,
  };
};

export default usePasswordManager;
