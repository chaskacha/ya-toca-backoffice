import { StatusValue } from "@/app/_roles/roles-status/RolesStatus";

// api/roles/route.ts
export type Role = {
    id: string;
    name: string;
    status: StatusValue;
    description: string;
};

export type Permission = {
    id: string;
    name: string;
    status: StatusValue;
    description: string;
};

export type GetRolesParams = {
    page: number;            // 1-based
    rowsPerPage: number;
    search?: string;         // optional filter
    sortBy?: "name" | "status";
    sortDir?: "asc" | "desc";
    status?: StatusValue;
};

export type GetRolesResponse = {
    total: number;
    items: Role[];
};

export type Module = {
    id: string;
    name: string;
    actions: string[];
};

export enum ModuleActions {
    create = 'Create',
    view = 'View',
    edit = 'Edit',
    delete = 'Delete',
    no_action = 'No Action'
}

export enum RoleActions {
    delete = 'delete',
    deactivate = 'deactivate',
    activate = 'activate'
}

const ALL_ROLES: Role[] = Array.from({ length: 137 }).map((_, i) => ({
    id: String(i + 1),
    name: i % 3 === 0 ? "HRM Manager" : i % 3 === 1 ? "Sales Manager" : "Support Agent",
    status: i % 9 === 0 ? StatusValue.inactive : StatusValue.active,
    description:
        "Lorem ipsum dolor sit amet consectetur. Sociis egestas commodo ornare faucibus. Feugiat at ut sit enim sociis."
}));

const ALL_PERMISSIONS: Permission[] = Array.from({ length: 137 }).map((_, i) => ({
    id: String(i + 1),
    name: i % 3 === 0 ? "HRM Manager" : i % 3 === 1 ? "Sales Manager" : "Support Agent",
    status: i % 9 === 0 ? StatusValue.inactive : StatusValue.active,
    description:
        "Lorem ipsum dolor sit amet consectetur. Sociis egestas commodo ornare faucibus. Feugiat at ut sit enim sociis."
}));

const ALL_MODULES: Module[] = Array.from({ length: 3 }).map((_, i) => ({
    id: String(i + 1),
    name: i % 3 === 0 ? "Customer" : i % 3 === 1 ? "Departments" : "Positions",
    actions: [ModuleActions.create, ModuleActions.view]
}));

type Result<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

const maybeFail = (p = 0.1) => (Math.random() < p ? "Network error" : null);

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getRoles(params: GetRolesParams): Promise<GetRolesResponse> {
    const { page, rowsPerPage, search, sortBy = "name", sortDir = "asc", status } = params;

    // simulate network + server processing
    await delay(500 + Math.random() * 400);

    // filter
    let data = [...ALL_ROLES];
    if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        data = data.filter(r =>
            r.name.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
        );
    }
    if (status !== StatusValue.all) {
        data = data.filter(r => r.status === status);
    }

    // sort
    data.sort((a, b) => {
        let av: any = a[sortBy];
        let bv: any = b[sortBy];
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    const total = data.length;
    const start = Math.max(0, (page - 1) * rowsPerPage);
    const items = data.slice(start, start + rowsPerPage);

    return { total, items };
}

export async function getRole(id: string): Promise<Result<{ role: Role; permissions: Permission[]; modules: Module[] }>> {
    await delay(500 + Math.random() * 400);
    const err = maybeFail(0.05);
    if (err) return { ok: false, error: err };
    const role = ALL_ROLES.find(r => r.id === id);
    if (!role) return { ok: false, error: "Role not found" };
    return { ok: true, data: { role, permissions: ALL_PERMISSIONS, modules: ALL_MODULES } };
}
// ---- Bulk actions (page selection / all) ----
export async function bulkDelete(ids: string[]): Promise<Result<{ deleted: string[] }>> {
    await delay(800);
    const err = maybeFail(0.05);
    if (err) return { ok: false, error: err };
    return { ok: true, data: { deleted: ids } };
}
export async function bulkDeactivate(ids: string[]): Promise<Result<{ updated: string[]; status: "inactive" }>> {
    await delay(800);
    const err = maybeFail(0.05);
    if (err) return { ok: false, error: err };
    return { ok: true, data: { updated: ids, status: "inactive" } };
}
export async function bulkActivate(ids: string[]): Promise<Result<{ updated: string[]; status: "active" }>> {
    await delay(800);
    const err = maybeFail(0.05);
    if (err) return { ok: false, error: err };
    return { ok: true, data: { updated: ids, status: "active" } };
}
export async function bulkExport(ids: string[]): Promise<Result<{ exported: string[] }>> {
    return { ok: true, data: { exported: ids } };
}

