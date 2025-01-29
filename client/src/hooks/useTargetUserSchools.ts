import { useAuth } from '../context/authContext';
import { get_user_schools } from '../services/api';
import { useQuery } from '@tanstack/react-query';

export const useTargetUserSchools = (userId: number) => {
  const { authenticated } = useAuth();
  const { data: schools } = useQuery({
    enabled: authenticated,
    queryKey: ['userSchools', userId],
    queryFn: () => get_user_schools(userId),
  });
  return schools;
};
