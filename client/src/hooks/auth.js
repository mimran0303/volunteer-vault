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

          // Check if the role is required and matches
          if (requiredRole && res.data.user.accountType !== requiredRole) {
            router.push('/not-authorized');
          }
        } else {
          router.push('/login');
        }
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
