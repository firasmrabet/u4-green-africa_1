import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';

type Props = {
  children: ReactElement;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null; // or a loader component

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
