import { useAuthStore } from '../AuthStore';
import { useMemo } from 'react';
/**
 * Simplified auth hook for demo
 */
export const useAuth = () => {
    const store = useAuthStore();

    const permissions = useMemo(() => ({
        canRead: store.hasPermission('read'),
        canWrite: store.hasPermission('write'),
        canDelete: store.hasPermission('delete'),
        canAdmin: store.hasRole("admin"),
    }), [store]);

    const roles = useMemo(() => ({
        isAdmin: store.hasRole('admin'),
        isManager: store.hasRole("user"),
        isAgent: store.hasRole("operator"),
    }), [store]);

    return {
        ...store,
        permissions,
        roles,
    };
};