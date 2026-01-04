'use client';

import { getCurrentSessionMutationFn } from '@/lib/apis/session';
import { useQuery } from '@tanstack/react-query';

const useAuth = () => {
  const query = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentSessionMutationFn,
    staleTime: Infinity
  });
  return query;
};

export default useAuth;
