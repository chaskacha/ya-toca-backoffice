'use client'

import React from "react";
import RolesTable, { Role } from "./roles-table/RolesTable";
import { bulkActivate, bulkDeactivate, bulkDelete, getRoles, RoleActions } from "../api/_roles/route";
import ConfirmModal from "@/components/_vl-components/modals/ConfirmModal";
import FeedbackModal from "@/components/_vl-components/modals/FeedbackModal";
import StatusFilter, { StatusValue } from "./roles-status/RolesStatus";
import { useRouter } from 'next/navigation';

export default function RolesPage() {
    const router = useRouter();
    const [rows, setRows] = React.useState<Role[]>([]);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [rpp, setRpp] = React.useState(10);
    const [selectedPageIds, setSelectedPageIds] = React.useState<Set<string>>(new Set());
    ///
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState<StatusValue>(StatusValue.all);
    const [confirm, setConfirm] = React.useState<null | {
        action: RoleActions;
        description: string;
        successMessage: string;
        ids: string[];
        actionLabel: string;
        actionColor: '#C80C0C' | '#36976E';
    }>(null);

    const [successAlert, setSuccessAlert] = React.useState<null | { title: string; message: string }>(null);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getRoles({ page, rowsPerPage: rpp, search, status });
            setRows(res.items);
            setTotal(res.total);
        } finally {
            setLoading(false);
        }
    }, [page, rpp, search, status]);

    React.useEffect(() => { fetchData(); }, [fetchData]);

    const onConfirm = async () => {
        if (!confirm) return;
        const { action, ids } = confirm;

        let res;
        if (action === RoleActions.delete) res = await bulkDelete(ids);
        if (action === RoleActions.deactivate) res = await bulkDeactivate(ids);
        if (action === RoleActions.activate) res = await bulkActivate(ids);

        if (!res?.ok) {
            setConfirm(null);
            setSuccessAlert({ title: "Error", message: res?.error || "Something went wrong." });
            return;
        }

        // Update UI list locally
        setRows(prev => {
            if (action === RoleActions.delete) return prev.filter(r => !ids.includes(r.id));
            if (action === RoleActions.deactivate) return prev.map(r => ids.includes(r.id) ? { ...r, status: StatusValue.inactive } : r);
            if (action === RoleActions.activate) return prev.map(r => ids.includes(r.id) ? { ...r, status: StatusValue.active } : r);
            return prev;
        });

        setConfirm(null);
        setSuccessAlert({
            title: "Success",
            message:
                action === RoleActions.delete
                    ? `The role has been successfully removed from the list.`
                    : action === RoleActions.deactivate
                        ? `The role has been successfully deactivated.`
                        : `The role has been successfully activated.`,
        });
    };

    const DEFAULT_OPTIONS = [
        { label: "All", value: StatusValue.all },
        { label: "Active", value: StatusValue.active },
        { label: "Inactive", value: StatusValue.inactive }
    ];

    return (
        <div style={{ padding: 20, backgroundColor: '#FFFFFF' }}>
            <button style={{ cursor: 'pointer', padding: 8, border: "1px solid #D6D6D6", borderRadius: 5, fontSize: 16 }} onClick={() => router.push('/roles/new')}>Add Role</button>
            <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                        style={{ padding: 8, border: "1px solid #D6D6D6", borderRadius: 5, fontSize: 16 }}
                    />
                </div>
                {/* <button onClick={fetchData}>Refresh</button> */}
                <StatusFilter
                    value={status}
                    onApply={setStatus}
                    onClear={() => setStatus(StatusValue.all)}
                    options={DEFAULT_OPTIONS}
                />
            </div>
            <RolesTable
                rows={rows}
                totalCount={total}
                page={page}
                rowsPerPage={rpp}
                loading={loading}
                selectedPageIds={selectedPageIds}
                setSelectedPageIds={setSelectedPageIds}
                onPageChange={setPage}
                onBulkExport={(ids: string[]) => {}}
                onRowsPerPageChange={(n) => { setPage(1); setRpp(n); }}
                onBulkDelete={(ids: string[]) => {
                    setConfirm({
                        action: RoleActions.delete,
                        ids,
                        actionLabel: "Delete roles",
                        actionColor: "#C80C0C",
                        description: "This action cannot be undone. Users assigned to these roles may lose access to certain modules or actions.",
                        successMessage: "The roles have been successfully deleted."
                    });
                }}
                onView={(id) => router.push(`/roles/${id}`)}
                onEdit={(id) => router.push(`/roles/${id}/edit`)}
                onActivate={(id) => {
                    setConfirm({
                        action: RoleActions.activate,
                        ids: [id],
                        actionLabel: "Activate role",
                        actionColor: "#36976E",
                        description: "Activating this role will restore its assigned permissions. Users linked to this role will regain access accordingly.",
                        successMessage: "The role has been successfully activated."
                    });
                }}
                onDeactivate={(id) => {
                    setConfirm({
                        action: RoleActions.deactivate,
                        ids: [id],
                        actionLabel: "Deactivate role",
                        actionColor: "#C80C0C",
                        description: "Deactivating this role will temporarily remove access to its assigned permissions. Users linked to this role will be affected.",
                        successMessage: "The role has been successfully deactivated."
                    });
                }}
                onDelete={(id) => {
                    setConfirm({
                        action: RoleActions.delete,
                        ids: [id],
                        actionLabel: "Delete role",
                        actionColor: "#C80C0C",
                        description: "This action cannot be undone. Users assigned to this role may lose access to certain modules or actions.",
                        successMessage: "The role has been successfully deleted."
                    });
                }}
            />
            <ConfirmModal
                open={!!confirm}
                title={`Are you sure you want to ${confirm?.action} this role(s)?`}
                description={confirm?.description}
                confirmLabel={`${confirm?.actionLabel}`}
                cancelLabel="Cancel"
                variant={confirm?.actionColor === "#C80C0C" ? "danger" : "success"}
                onConfirm={async () => {
                    await onConfirm();
                    setConfirm(null);
                    setSelectedPageIds(new Set());
                    confirm?.action === RoleActions.delete ? fetchData() : null;
                }}
                onClose={() => setConfirm(null)}
            />
            <FeedbackModal
                open={!!successAlert}
                title={successAlert?.title}
                message={successAlert?.message}
                autoCloseMs={2000}
                onClose={() => setSuccessAlert(null)}
            />
        </div>
    );
}
