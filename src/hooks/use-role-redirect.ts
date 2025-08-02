
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useRoleRedirect(allowedRoles: string[]) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        
        if (!role || !allowedRoles.includes(role)) {
            if (role === 'student') {
                router.replace('/dashboard/student');
            } else {
                router.replace('/'); 
            }
        } else {
            setLoading(false);
        }
    }, [router, allowedRoles]);

    return loading;
}
