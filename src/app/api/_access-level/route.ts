
type AccessLevel = {
    id: string;
    value: string;
    description: string;
    access_level: string;
};
export type GetAccessLevelResponse = {
    total: number;
    items: AccessLevel[];
};

const ALL_ACCESS_LEVEL: AccessLevel[] = [
    { id: '1', value: 'View', description: 'Read-only access to the resource.', access_level: '1' },
    { id: '2', value: 'Create', description: 'Create new instances of a resource.', access_level: '2' },
    { id: '3', value: 'Update', description: 'Modify existing resource data.', access_level: '2' },
    { id: '4', value: 'Delete', description: 'Remove a resource.', access_level: '3' },
    { id: '5', value: 'Assign', description: 'Link or associate entities (e.g., assign an agent).', access_level: '2' },
    { id: '6', value: 'Export', description: 'Extract or download resource data (reports, logs, etc.).', access_level: '2' },
    { id: '7', value: 'Manage', description: 'Full administrative control; encompasses all actions.', access_level: '99' },
]

export async function getAccessLevel(): Promise<GetAccessLevelResponse> {

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // simulate network + server processing
    await delay(500 + Math.random() * 400);

    const total = ALL_ACCESS_LEVEL.length;
    const items = ALL_ACCESS_LEVEL;

    return { total, items };
}