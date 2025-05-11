import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/use-toast';
import * as authService from '@/services/authService';

export function useAuthManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async (
    action: () => Promise<any>,
    successMessage: string
  ) => {
    setLoading(true);
    try {
      await action();
      toast({
        title: "Success",
        description: successMessage,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: {
    firstName?: string;
    lastName?: string;
    photoURL?: string;
  }) => {
    if (!user) throw new Error('No user logged in');
    await handleAuthAction(
      () => authService.updateUserProfile(user, data),
      "Profile updated successfully"
    );
  };

  const updateEmail = async (newEmail: string, password: string) => {
    if (!user) throw new Error('No user logged in');
    await handleAuthAction(
      () => authService.updateUserEmail(user, newEmail, password),
      "Email updated successfully. Please verify your new email."
    );
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');
    await handleAuthAction(
      () => authService.updateUserPassword(user, currentPassword, newPassword),
      "Password updated successfully"
    );
  };

  const deleteAccount = async (password: string) => {
    if (!user) throw new Error('No user logged in');
    await handleAuthAction(
      () => authService.deleteUserAccount(user, password),
      "Account deleted successfully"
    );
  };

  return {
    loading,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteAccount,
    isAuthenticated: !!user,
    user
  };
}