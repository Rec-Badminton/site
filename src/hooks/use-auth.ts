import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { isAdmin, signIn, signOut } from '@/core/admin/auth';
import { auth } from '@/core/admin/firebase';

// Current Firebase user; undefined while the session is being restored.
const useAuthUser = (): User | null | undefined => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  return user;
};

const useIsAdmin = (user: User | null | undefined) =>
  useQuery({
    queryKey: ['isAdmin', user?.uid],
    queryFn: () => (user ? isAdmin(user.uid) : false),
    enabled: !!user,
    staleTime: Infinity
  });

const useSignIn = () => useMutation({ mutationFn: signIn });

const useSignOut = () => useMutation({ mutationFn: signOut });

export { useAuthUser, useIsAdmin, useSignIn, useSignOut };
