'use client';

import React from "react";
import Filter from "@/components/basic/filter/Filter";

type Option = { label: string; value: string };

type FiltersApi = {
    regions: { id: number; nombreregion: string }[];
    events: { id: number; name_event: string; date_event: string; region_name?: string | null }[];
};

type Row = {
    created_at: string;
    event_id: number;
    region_name: string;
    name_event: string;
    phrase: string;
    question: string | null;
    video_url?: string | null;
    start_sec?: number | null;
};

export default function VideosPhrasesTable() {
    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    const [filters, setFilters] = React.useState({ regionId: "", eventId: "" });

    const [loading, setLoading] = React.useState(true);
    const [rows, setRows] = React.useState<Row[]>([]);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const pageSize = 20;

    React.useEffect(() => {
        const run = async () => {
            try {
                setLoadingFilters(true);
                const res = await fetch("/api/videos/phrases/filters");
                const json = (await res.json()) as FiltersApi;
                setFiltersApi(json);
            } catch (e) {
                console.error(e);
                setFiltersApi(null);
            } finally {
                setLoadingFilters(false);
            }
        };
        run();
    }, []);

    const buildUrl = React.useCallback(() => {
        const params = new URLSearchParams();
        if (filters.regionId) params.set("regionId", filters.regionId);
        if (filters.eventId) params.set("eventId", filters.eventId);
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        return `/api/videos/phrases/list?${params.toString()}`;
    }, [filters, page]);

    React.useEffect(() => {
        setPage(1);
    }, [filters.regionId, filters.eventId]);

    React.useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const res = await fetch(buildUrl());
                const json = await res.json();
                setRows(json?.rows ?? []);
                setTotal(json?.total ?? 0);
            } catch (e) {
                console.error(e);
                setRows([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [buildUrl]);

    const regionOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.regions ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((r) => ({ label: r.nombreregion, value: String(r.id) }))];
    }, [filtersApi]);

    const eventOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.events ?? [];
        return [{ label: "Todos", value: "" }, ...list.map((e) => ({ label: e.name_event, value: String(e.id) }))];
    }, [filtersApi]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div style={{ marginTop: 28 }}>
            <div className="fs18 fw700">Frases extraídas (videos)</div>
            <div style={{ height: 10 }} />

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Filter
                    label="Región"
                    value={filters.regionId}
                    onChange={(v) => setFilters((p) => ({ ...p, regionId: v, eventId: "" }))}
                    options={regionOptions}
                />

                <Filter
                    label="Evento"
                    value={filters.eventId}
                    onChange={(v) => setFilters((p) => ({ ...p, eventId: v }))}
                    options={eventOptions}
                />

                <button
                    onClick={() => setFilters({ regionId: "", eventId: "" })}
                    style={{ height: 40, padding: "0 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
                >
                    Limpiar
                </button>
            </div>

            <div style={{ height: 14 }} />

            {loadingFilters ? <div className="dash-loading">Cargando filtros...</div> : null}

            {loading ? (
                <div className="dash-loading">Cargando frases...</div>
            ) : (
                <div
                    style={{
                        width: "calc(100vw - 56px - 134px)",
                        overflowX: "auto",
                        border: "1px solid #000",
                        borderRadius: 12,
                        background: "#fff",
                    }}
                >
                    <div style={{ color: "#666", padding: 12 }}>{total.toLocaleString()} resultados</div>

                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
                        <thead>
                            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                                <th style={{ padding: 12 }}>Fecha</th>
                                <th style={{ padding: 12 }}>Región</th>
                                <th style={{ padding: 12 }}>Evento</th>
                                <th style={{ padding: 12 }}>Pregunta</th>
                                <th style={{ padding: 12 }}>Frase</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((r, idx) => (
                                <tr key={idx} style={{ borderBottom: "1px solid #000" }}>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{String(r.created_at).slice(0, 10)}</td>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{r.region_name}</td>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{r.name_event}</td>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{r.question || "Sin pregunta"}</td>
                                    <td style={{ padding: 12, minWidth: 520, maxWidth: 720 }}>
                                        <div style={{ whiteSpace: "normal", wordBreak: "break-word", overflowWrap: "anywhere", lineHeight: 1.35 }}>
                                            {r.phrase}
                                        </div>
                                        {r.video_url ? (
                                            <div style={{ marginTop: 6, fontSize: 12 }}>
                                                <a href={r.video_url} target="_blank" rel="noreferrer" style={{ color: "#000", textDecoration: "underline" }}>
                                                    Abrir video
                                                </a>
                                            </div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}

                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: 16, color: "#777" }}>
                                        No hay resultados con los filtros seleccionados.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        style={{ height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
                    >
                        Anterior
                    </button>

                    <div style={{ minWidth: 120, textAlign: "center" }}>
                        Página {page} / {Math.max(1, Math.ceil(total / pageSize))}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        style={{ height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
