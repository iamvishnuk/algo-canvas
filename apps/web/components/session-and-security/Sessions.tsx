'use client';
import {
  deleteSessionMutationFn,
  getAllSessionsMutationFn
} from '@/lib/apis/session';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import SessionItem from './SessionItem';

const Sessions = () => {
  const { data, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: getAllSessionsMutationFn,
    staleTime: Infinity
  });

  const { mutate } = useMutation({
    mutationFn: deleteSessionMutationFn
  });

  const sessions = data?.data || [];
  const currentSession = sessions.find((session) => session.isCurrent);
  const otherSessions = sessions.filter((session) => !session.isCurrent);

  const handleDeleteSession = async (sessionid: string) => {
    mutate(sessionid, {
      onSuccess: () => {
        refetch();
        toast.success('Success', { description: 'Session deleted' });
      },
      onError: (error) => {
        toast.error('error', { description: error.message });
      }
    });
  };

  return (
    <div className='via-root to-root rounded-xl bg-gradient-to-r p-0.5'>
      <div className='rounded-[10px] p-6'>
        <h3 className='text-brand-text mb-1 text-xl font-bold tracking-[-0.16px]'>
          Sessions
        </h3>
        <p className='mb-6 max-w-xl text-sm font-normal dark:text-gray-100'>
          Sessions are the devices you are using or that have used your Algo
          Canvas These are the sessions where your account is currently logged
          in. You can log out of each session.
        </p>

        <div className='max-w-xl rounded-t-xl'>
          <div>
            <h5 className='text-base font-semibold'>Current active session</h5>
            <p className='mb-6 text-sm text-[#0007149f] dark:text-gray-100'>
              You’re logged into this Algo Canvas account on this device and are
              currently using it.
            </p>
          </div>

          <div className='w-full'>
            <div className='w-full border-b py-2 pb-5'>
              {currentSession && (
                <SessionItem
                  userAgent={currentSession.userAgent}
                  date={currentSession.createdAt}
                  expireAt={currentSession.expiredAt}
                  isCurrent={currentSession.isCurrent}
                />
              )}
            </div>
            <div className='mt-4'>
              <h5 className='text-base font-semibold'>Other sessions</h5>
              <ul className='mt-4 max-h-[300px] w-full space-y-3 overflow-y-auto'>
                {otherSessions.map((session) => (
                  <SessionItem
                    key={session._id}
                    userAgent={session.userAgent}
                    date={session.createdAt}
                    expireAt={session.expiredAt}
                    isCurrent={session.isCurrent}
                    onRemove={() => handleDeleteSession(session._id)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
