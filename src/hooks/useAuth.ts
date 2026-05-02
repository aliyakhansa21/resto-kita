import { useMutation, useQuery } from '@tanstack/react-query';
import api  from '@/lib/api';
import { LoginResponse, User } from '@/types/api';
import { useRouter } from 'next/navigation';

export function useLogin() {
    const router = useRouter();
    
    return useMutation({
        mutationFn: async (credentials: Record<string, string>) => {
        const { data } = await api.post<LoginResponse>('/login', credentials);
        return data;
        },
        onSuccess: (data) => {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/admin/pesanan');
        },
    });
}

export function useLogout() {
    const router = useRouter();
    
    return useMutation({
        mutationFn: async () => {
        await api.post('/admin/logout');
        },
        onSuccess: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        router.push('/login');
        },
    });
}