'use client'

import React from 'react'
import './styles.css';
import { usePathname, useRouter } from 'next/navigation';
import { getRole, Module, Permission } from '@/app/api/_roles/route';
import { Role } from '../roles-table/RolesTable';
import RolePermissionUnit from '@/components/_vl-components/role-permission-unit/RolePermissionUnit';

const back_svg = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7099 15.88L10.8299 12L14.7099 8.11998C15.0999 7.72998 15.0999 7.09998 14.7099 6.70998C14.3199 6.31998 13.6899 6.31998 13.2999 6.70998L8.70994 11.3C8.31994 11.69 8.31994 12.32 8.70994 12.71L13.2999 17.3C13.6899 17.69 14.3199 17.69 14.7099 17.3C15.0899 16.91 15.0999 16.27 14.7099 15.88Z" fill="#2A7959" />
</svg>;

const RoleIdPage = () => {
    const [role, setRole] = React.useState<{ role: Role; permissions: Permission[]; modules: Module[] } | null>(null)
    const [loading, setLoading] = React.useState(false)
    const router = useRouter();
    const pathname = usePathname()
    const id = pathname.split('/').pop();
    const [open, setOpen] = React.useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getRole(id as string);
            if (!res.ok) {
                throw new Error(res.error);
            }
            setRole(res.data);
        } finally {
            setLoading(false);
        }
    }, [id]);

    React.useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <div style={{ padding: 20, backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="role-detail-container">
                    <div style={{ flex: 3 }}>
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2A7959' }} onClick={() => router.back()}>
                            {back_svg}
                            Back
                        </div>
                        <br />
                        <div style={{ fontSize: 24, fontWeight: 600 }}>View Role</div>
                        <br />
                        <div className="role-desc-container">
                            <div style={{ fontWeight: 600 }}>{role?.role.name}</div>
                            <div>{role?.role.description}</div>
                        </div>
                        <br />
                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Permissions for this role</div>
                        <div>
                            {role?.permissions
                                .slice(0, 3)
                                .map((permission) => (
                                    <RolePermissionUnit permission={permission} active={open} setActive={setOpen} />
                                ))}
                        </div>
                    </div>
                    {open && <div className="module-permissions-sidebar">
                        <div style={{ fontWeight: 600, fontSize: 24 }}>{role?.permissions.find((p) => p.id === open)?.name}</div>
                        <div className="module-actions-title">View {role?.modules.length} modules</div>
                        <div className="module-actions-container">
                            <div className="module-action-header">{role?.modules.find((m) => m.id === open)?.name}</div>
                            {role?.modules.map((module: Module) => (
                                <div key={module.id} className="module-action-item">
                                    <div className="module-action-item-name">{module.name}</div>
                                    <div className="module-action-item-actions">{module.actions.join(', ')}</div>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            )}
        </div>
    )
}

export default RoleIdPage