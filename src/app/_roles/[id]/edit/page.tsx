'use client';
import React from 'react';
import './styles.css'
import RolePermissionUnit from '@/components/_vl-components/role-permission-unit/RolePermissionUnit';
import FeedbackModal from '@/components/_vl-components/modals/FeedbackModal';

const back_svg = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7099 15.88L10.8299 12L14.7099 8.11998C15.0999 7.72998 15.0999 7.09998 14.7099 6.70998C14.3199 6.31998 13.6899 6.31998 13.2999 6.70998L8.70994 11.3C8.31994 11.69 8.31994 12.32 8.70994 12.71L13.2999 17.3C13.6899 17.69 14.3199 17.69 14.7099 17.3C15.0899 16.91 15.0999 16.27 14.7099 15.88Z" fill="#2A7959" />
</svg>;

type Action = 'View' | 'Create' | 'Update' | 'Delete' | 'Assign' | 'Export' | 'Manage';
const ALL_ACTIONS: Action[] = ['View', 'Create', 'Update', 'Delete', 'Assign', 'Export', 'Manage'];

type Permission = {
    key: string;
    name: string;
    blurb?: string;
};

const PERMISSIONS: Permission[] = [
    { key: 'home', name: 'Home', blurb: 'Panel de inicio y widgets.' },
    { key: 'hrm', name: 'HRM Module', blurb: 'Gestión de personal.' },
    { key: 'ats', name: 'ATS Module', blurb: 'Reclutamiento y vacantes.' },
    { key: 'callcenter', name: 'Callcenter Module', blurb: 'Gestión de llamadas.' },
    { key: 'payroll', name: 'Payroll Module', blurb: 'Nóminas y pagos.' },
    { key: 'crm', name: 'CRM Module', blurb: 'Relación con clientes.' },
];

type RoleForm = {
    name: string;
    description: string;
    // per-permission config
    perms: Record<string, { enabled: boolean; actions: Action[] }>;
};

const initForm: RoleForm = {
    name: 'Role Name',
    description: 'Role Description',
    perms: Object.fromEntries(PERMISSIONS.map(p => [p.key, { enabled: false, actions: [] }]))
};

const EditRolePage: React.FC = () => {
    const [form, setForm] = React.useState<RoleForm>(initForm);
    const [activePermKey, setActivePermKey] = React.useState<string | null>(null);
    const activePerm = PERMISSIONS.find(p => p.key === activePermKey) || null;
    const [successAlert, setSuccessAlert] = React.useState<null | { title: string; message: string }>(null);

    const togglePermission = (key: string) => {
        setForm((prev: any) => {
            const curr = prev.perms[key];
            const nextEnabled = !curr.enabled;
            const nextActions = nextEnabled ? (curr.actions.length ? curr.actions : ['View']) : [];
            return {
                ...prev,
                perms: { ...prev.perms, [key]: { enabled: nextEnabled, actions: nextActions } }
            };
        });
        setActivePermKey(k => (k === key ? null : key)); // open side panel on enable and close on disable the toggle
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulated payload
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            permissions: Object.fromEntries(
                PERMISSIONS.map(p => [p.key, form.perms[p.key]])
            )
        };
        console.log('EDITTED ROLE', payload);
        setSuccessAlert({ title: 'Success', message: `The role ${payload.name} has been successfully edited.` });
    };

    const clearPanel = () => setActivePermKey(null);

    // React.useEffect(() => {
    //     if (activePermKey && form.perms[activePermKey].actions.length === 0) {
    //         togglePermission(activePermKey);
    //         clearPanel();
    //     }
    // }, [form.perms]);

    return (
        <div className="new-role-page">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2A7959' }} onClick={() => history.back()}>
                {back_svg}
                Back
            </div>
            <br />
            <div style={{ fontSize: 24, fontWeight: 600 }}>Edit Role</div>
            <br />

            <form onSubmit={handleSubmit} className="layout">
                {/* LEFT: form + permissions */}
                <div className="leftCol">
                    <div className="new-role-card cardForm">
                        <label className="label">Role Name *</label>
                        <input
                            className="input"
                            placeholder="Enter role name"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            required
                        />

                        <label className="label">Description</label>
                        <textarea
                            className="input textarea"
                            placeholder="Enter a description"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            rows={4}
                        />
                    </div>

                    <div className="new-role-card">
                        <div className="sectionTitle">Manage Permission for this role</div>
                        <div>
                            {PERMISSIONS.map(p => {
                                const state = form.perms[p.key];
                                const active = activePermKey === p.key && state.enabled;
                                return (
                                    <RolePermissionUnit
                                        permission={{ id: p.key, name: p.name, description: p.blurb || '' }}
                                        active={activePermKey}
                                        setActive={setActivePermKey}
                                        state={state}
                                        togglePermission={togglePermission}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="new-role-actionsrow">
                        <button type="submit" className="btnPrimary">Save Changes</button>
                    </div>
                </div>

                {/* RIGHT: actions side panel */}
                {/* {activePerm && (
                    <aside className={`rightCol ${activePerm ? 'rightColOpen' : ''}`}>
                        <div className="sideCard">
                            <div className="sideHeader">
                                <div>
                                    <div className="sideTitle">{activePerm.name}</div>
                                    <div className="sideSub">
                                        View {form.perms[activePerm.key].actions.length} permissions
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                )} */}
            </form>
            <FeedbackModal
                open={!!successAlert}
                title={successAlert?.title}
                message={successAlert?.message}
                autoCloseMs={2000}
                onClose={() => setSuccessAlert(null)}
            />
        </div>
    );
};

export default EditRolePage;
