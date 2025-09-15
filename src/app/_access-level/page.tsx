'use client';
import React from 'react'
import './styles.css'
import { getAccessLevel, GetAccessLevelResponse } from '../api/_access-level/route';

const AccessLevelPage = () => {
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState<GetAccessLevelResponse['items']>([]);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAccessLevel();
            setRows(res.items);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <div style={{ padding: 20, backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <h1>Access Level</h1>
            <br />
            <div className="access-level-card">
                <div className="table" role="table" aria-label="Access Level">
                    {/* Header */}
                    <div className="tr th" role="row">
                        <div className="td name">Action Value</div>
                        <div className="td desc">Description</div>
                        <div className="td access-level">Access Level</div>
                    </div>
                    {/* Body */}
                    {loading ? (
                        <div className="tr">
                            <div className="td loading" col-span={5}>Loading…</div>
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="tr">
                            <div className="td empty">No access level.</div>
                        </div>
                    ) : (
                        rows.map((r) => (
                            <div key={r.id} className="tr" role="row">
                                <div className="td name">{r.value}</div>
                                <div className="td desc">{r.description}</div>
                                <div className="td access-level">{r.access_level}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default AccessLevelPage