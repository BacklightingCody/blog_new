// components/UserSync.tsx
'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useClerkInfo } from '@/hooks/useClerkInfo';

export default function UserSync() {
  const { isLoaded, user } = useUser();

  const res = useClerkInfo();
  // console.log('useClerkInfo', res);
  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      const payload = {
        externalId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        imageUrl: user.imageUrl,
      };
      console.log(payload, 'payload')

      // await fetch('http://localhost:3001/api/sync-user', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload),
      // });
    };

    syncUser();
  }, [isLoaded, user]);

  return null;
}
