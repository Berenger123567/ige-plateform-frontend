'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';

/**
 * HOC pour protéger les pages admin
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!isAuthenticated()) {
        router.push('/admin/login');
      } else {
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-ige-violet border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
