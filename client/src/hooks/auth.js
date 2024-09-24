import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const useAuth = (requiredRole = null) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get('http://localhost:8080/dashboard', { withCredentials: true })
      .then(res => {
        if (res.data.user) {
          setIsAuthenticated(true);
          setUser(res.data.user);

          // If a role is required and the user role doesn't match, redirect
          if (requiredRole && res.data.user.accountType !== requiredRole) {
            router.push('/not-authorized');
            return; // Prevent setting isLoading to false when redirecting
          }
        } else {
          router.push('/login');
          return; // Prevent setting isLoading to false when redirecting
        }

        // Only set loading to false if everything is validated and no redirects are necessary
        setIsLoading(false);
      })
      .catch(err => {
        console.log('Error during authentication check:', err);
        router.push('/login');
        setIsLoading(false);
      });
  }, [router, requiredRole]);

  return { isAuthenticated, user, isLoading };
};
