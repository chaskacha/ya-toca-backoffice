import React from 'react'
import './styles.css'

type Props = {
    permission: {
        id: string;
        name: string;
        description: string;
    };
    active: string | null;
    setActive: (id: string | null) => void;
    state?: {
        enabled: boolean;
        actions: string[];
    };
    togglePermission?: (key: string) => void;
}
const RolePermissionUnit: React.FC<Props> = ({ permission, active, setActive, state, togglePermission }) => {
    return (
        <div
            key={permission.id}
            className={active === permission.id ? 'role-permission-container active' : 'role-permission-container'}
            onClick={() => {
                setActive(active === permission.id ? null : permission.id);
                togglePermission?.(permission.id);
            }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{permission.name}</div>
                <div style={{ fontSize: 12, fontWeight: 400 }}>{permission.description}</div>
            </div>
            {togglePermission && <label className="switch" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={state?.enabled}
                    onChange={() => togglePermission?.(permission.id)}
                />
                <span className="slider"></span>
            </label>}
        </div>
    )
}
export default RolePermissionUnit