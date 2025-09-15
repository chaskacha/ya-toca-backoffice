'use client';

import React from "react";
import "./styles.css";
import { StatusValue } from "../roles-status/RolesStatus";


const svgs = {
    activate: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_168_1614)">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.88 8.29L10 14.17L8.12 12.29C7.73 11.9 7.1 11.9 6.71 12.29C6.32 12.68 6.32 13.31 6.71 13.7L9.3 16.29C9.69 16.68 10.32 16.68 10.71 16.29L17.3 9.7C17.69 9.31 17.69 8.68 17.3 8.29C16.91 7.9 16.27 7.9 15.88 8.29Z" fill="#36976E" />
        </g>
        <defs>
            <clipPath id="clip0_168_1614">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>
    ,
    deactivate: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_168_6210)">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 7.58 7.58 4 12 4C13.85 4 15.55 4.63 16.9 5.69L5.69 16.9C4.63 15.55 4 13.85 4 12ZM12 20C10.15 20 8.45 19.37 7.1 18.31L18.31 7.1C19.37 8.45 20 10.15 20 12C20 16.42 16.42 20 12 20Z" fill="#36976E" />
        </g>
        <defs>
            <clipPath id="clip0_168_6210">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>
    ,
    edit: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_168_5996)">
            <path d="M3 17.46V20.5C3 20.78 3.22 21 3.5 21H6.54C6.67 21 6.8 20.95 6.89 20.85L17.81 9.94L14.06 6.19L3.15 17.1C3.05 17.2 3 17.32 3 17.46ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#36976E" />
        </g>
        <defs>
            <clipPath id="clip0_168_5996">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>
    ,
    delete: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_168_7316)">
            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V9C18 7.9 17.1 7 16 7H8C6.9 7 6 7.9 6 9V19ZM18 4H15.5L14.79 3.29C14.61 3.11 14.35 3 14.09 3H9.91C9.65 3 9.39 3.11 9.21 3.29L8.5 4H6C5.45 4 5 4.45 5 5C5 5.55 5.45 6 6 6H18C18.55 6 19 5.55 19 5C19 4.45 18.55 4 18 4Z" fill="#C80C0C" />
        </g>
        <defs>
            <clipPath id="clip0_168_7316">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>
    ,
    view_detail: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_168_3592)">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#36976E" />
        </g>
        <defs>
            <clipPath id="clip0_168_3592">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>

}
export type Role = {
    id: string;
    name: string;
    status: StatusValue;
    description: string;
};

type ActionHandlers = {
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onActivate?: (id: string) => void;
    onDeactivate?: (id: string) => void;
    onDelete?: (id: string) => void;
    onBulkDelete?: (ids: string[]) => void;
    onBulkExport?: (ids: string[]) => void;
};

type Props = ActionHandlers & {
    rows: Role[];                 // current page data
    totalCount: number;           // total rows (all pages)
    page: number;                 // 1-based
    rowsPerPage: number;
    rowsPerPageOptions?: number[];
    loading?: boolean;
    selectedPageIds: Set<string>;
    setSelectedPageIds: (ids: Set<string>) => void;

    onPageChange: (page: number) => void;
    onRowsPerPageChange: (n: number) => void;
};

/** Small helper checkbox with indeterminate */
function IndeterminateCheckbox({
    checked,
    indeterminate,
    onChange,
    title
}: {
    checked: boolean;
    indeterminate?: boolean;
    onChange: (v: boolean) => void;
    title?: string;
}) {
    const ref = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
    }, [indeterminate]);
    return (
        <input
            ref={ref}
            type="checkbox"
            aria-label={title || "Select"}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
    );
}

const RolesTable: React.FC<Props> = ({
    rows,
    totalCount,
    page,
    rowsPerPage,
    rowsPerPageOptions = [10, 25, 50, 100],
    loading = false,
    selectedPageIds,
    setSelectedPageIds,
    onPageChange,
    onRowsPerPageChange,
    onView,
    onEdit,
    onActivate,
    onDeactivate,
    onBulkExport,
    onDelete
}) => {
    // Selection state
    const [selectAllAcross, setSelectAllAcross] = React.useState<boolean>(false);

    const [deselected, setDeselected] = React.useState<Set<string>>(new Set()); // only used when selectAllAcross=true

    // Reset page selections whenever page/rows change
    React.useEffect(() => {
        setSelectedPageIds(new Set());
        setDeselected(new Set());
        setSelectAllAcross(false);
    }, [page, rowsPerPage]);

    const pageAllIds = React.useMemo(() => rows.map(r => r.id), [rows]);

    // Computed selection info
    const pageSelectedCount = selectAllAcross
        ? pageAllIds.filter(id => !deselected.has(id)).length
        : selectedPageIds.size;

    const pageAllSelected = pageSelectedCount === pageAllIds.length && pageAllIds.length > 0;
    const pageNoneSelected = pageSelectedCount === 0;

    const headerChecked = pageAllSelected;
    const headerIndeterminate = !pageNoneSelected && !pageAllSelected;

    // Handlers
    const toggleHeader = (checked: boolean) => {
        if (selectAllAcross) {
            // when selecting header on this page in "across" mode, simply clear or add all from deselected
            if (checked) {
                const next = new Set(deselected);
                pageAllIds.forEach(id => next.delete(id));
                setDeselected(next);
            } else {
                const next = new Set(deselected);
                pageAllIds.forEach(id => next.add(id));
                setDeselected(next);
            }
        } else {
            // page mode
            if (checked) {
                setSelectedPageIds(new Set(pageAllIds));
            } else {
                setSelectedPageIds(new Set());
            }
        }
    };

    const toggleRow = (id: string, checked: boolean) => {
        if (selectAllAcross) {
            const next = new Set(deselected);
            if (checked) next.delete(id);
            else next.add(id);
            setDeselected(next);
        } else {
            const next = new Set(selectedPageIds);
            if (checked) next.add(id);
            else next.delete(id);
            setSelectedPageIds(next);
        }
    };

    const selectAllAcrossDataset = () => {
        setSelectAllAcross(true);
        setSelectedPageIds(new Set());
        setDeselected(new Set()); // everything selected unless explicit exceptions
    };

    const clearSelection = () => {
        setSelectAllAcross(false);
        setSelectedPageIds(new Set());
        setDeselected(new Set());
    };

    // Pagination helpers
    const pageStart = (page - 1) * rowsPerPage + 1;
    const pageEnd = Math.min(page * rowsPerPage, totalCount);
    const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));

    // Row actions menu state (controlled per-row)
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const toggleMenu = (id: string) => setOpenMenuId(m => (m === id ? null : id));
    const closeMenu = () => setOpenMenuId(null);

    return (
        <div className="roles-card">
            {/* “Select all across” banner */}
            {!pageNoneSelected && !selectAllAcross && totalCount > rows.length && (
                <>
                    <div className="select-banner">
                        Selected {pageSelectedCount} in this page.{" "}
                        <button className="link" onClick={selectAllAcrossDataset}>
                            Select all {totalCount} roles
                        </button>
                        {" · "}
                        <button className="link" onClick={clearSelection}>Clear selection</button>
                        {" · "}
                        <button
                            className="danger"
                            onClick={() => onBulkExport?.(Array.from(selectedPageIds))}
                        >
                            Export ({pageSelectedCount})
                        </button>
                    </div>
                </>
            )}
            {selectAllAcross && (
                <div className="select-banner">
                    Selected all {totalCount} roles.{" "}
                    <button className="link" onClick={clearSelection}>Clear selection</button>
                    {" · "}
                    <button
                        className="danger"
                        onClick={() => onBulkExport?.(Array.from(selectedPageIds))}
                    >
                        Export ({totalCount})
                    </button>
                </div>
            )}

            <div className="table" role="table" aria-label="Roles">
                {/* Header */}
                <div className="tr th" role="row">
                    <div className="td checkbox">
                        <IndeterminateCheckbox
                            title="Select all"
                            checked={headerChecked}
                            indeterminate={headerIndeterminate}
                            onChange={toggleHeader}
                        />
                    </div>
                    <div className="td name">Role Name</div>
                    <div className="td status">Status</div>
                    <div className="td desc">Description</div>
                    <div className="td actions" aria-hidden />
                </div>

                {/* Body */}
                {loading ? (
                    <div className="tr">
                        <div className="td loading" col-span={5}>Loading…</div>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="tr">
                        <div className="td empty">No roles.</div>
                    </div>
                ) : (
                    rows.map((r) => {
                        const rowChecked = selectAllAcross ? !deselected.has(r.id) : selectedPageIds.has(r.id);
                        return (
                            <div key={r.id} className="tr" role="row">
                                <div className="td checkbox">
                                    <input
                                        type="checkbox"
                                        aria-label={`Select ${r.name}`}
                                        checked={rowChecked}
                                        onChange={(e) => toggleRow(r.id, e.target.checked)}
                                    />
                                </div>

                                <div className="td name">{r.name}</div>

                                <div className="td status">
                                    <span className={`badge ${r.status === "active" ? "ok" : "muted"}`}>
                                        {r.status === "active" ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="td desc">{r.description}</div>

                                <div className="td actions">
                                    <button
                                        className="icon-btn"
                                        aria-haspopup="menu"
                                        aria-expanded={openMenuId === r.id}
                                        onClick={() => toggleMenu(r.id)}
                                    >
                                        ⋮
                                    </button>
                                    {openMenuId === r.id && (
                                        <div className="menu" role="menu" onMouseLeave={closeMenu}>
                                            <button className="menuitem" role="menuitem" onClick={() => { closeMenu(); onView?.(r.id); }}>
                                                {svgs.view_detail}
                                                View Role
                                            </button>
                                            <button className="menuitem" role="menuitem" onClick={() => { closeMenu(); onEdit?.(r.id); }}>
                                                {svgs.edit}
                                                Edit Role
                                            </button>
                                            {r.status === "active" && <button className="menuitem" role="menuitem" onClick={() => { closeMenu(); onDeactivate?.(r.id); }}>
                                                {svgs.deactivate}
                                                Deactivate Role
                                            </button>}
                                            {r.status === "inactive" && <button className="menuitem" role="menuitem" onClick={() => { closeMenu(); onActivate?.(r.id); }}>
                                                {svgs.activate}
                                                Activate Role
                                            </button>}
                                            <button className="menuitem" role="menuitem" onClick={() => { closeMenu(); onDelete?.(r.id); }}>
                                                {svgs.delete}
                                                Delete Role
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer / Pagination */}
            <div className="table-footer">
                <div className="rows-per-page">
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    >
                        {rowsPerPageOptions.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                <div className="range">
                    {totalCount === 0 ? "0–0" : `${pageStart}–${pageEnd}`} of {totalCount}
                </div>

                <div className="pager">
                    <button
                        className="nav"
                        disabled={page <= 1}
                        onClick={() => onPageChange(1)}
                        aria-label="First page"
                    >«</button>
                    <button
                        className="nav"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        aria-label="Previous page"
                    >‹</button>
                    <span className="pageno">{page} / {pageCount}</span>
                    <button
                        className="nav"
                        disabled={page >= pageCount}
                        onClick={() => onPageChange(page + 1)}
                        aria-label="Next page"
                    >›</button>
                    <button
                        className="nav"
                        disabled={page >= pageCount}
                        onClick={() => onPageChange(pageCount)}
                        aria-label="Last page"
                    >»</button>
                </div>
            </div>
        </div>
    );
};

export default RolesTable;
