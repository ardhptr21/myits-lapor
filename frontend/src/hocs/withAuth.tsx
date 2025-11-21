import Loading from '@/components/common/Loading';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  role?: string
) {
  const ComponentWithAuth = (props: P) => {
    const { user, getUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
      const fetchUser = async () => {
        try {
          await getUser();
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <Loading />;

    if (!user) {
      return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    if (role && user.role !== role) {
      return 'Unauthorized';
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
}
