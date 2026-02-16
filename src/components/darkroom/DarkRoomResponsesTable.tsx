'use client';

import React from "react";
import DarkRoomCompareModal from "@/components/darkroom/DarkRoomCompareModal";
import { useRouter } from "next/navigation";
import type { DarkRoomFiltersState } from "@/app/darkroom/page";

type FiltersApi = {
    questions: { id: number; text: string }[];
    optionsByQuestion: Record<number, { id: number; question_id: number; text: string }[]>;
    ageGroups: string[];
    genders: string[];
};

type Row = {
    created_at: string;
    question_id: number;
    question_text: string;
    option_id: number;
    option_text: string;
    age_group: string;
    gender: string;
};

export default function DarkRoomResponsesTable({
    filters,
    loadingFilters,
}: {
    filters: DarkRoomFiltersState;
    loadingFilters?: boolean;
}) {
    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const router = useRouter();
    const [compareOpen, setCompareOpen] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [rows, setRows] = React.useState<Row[]>([]);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const pageSize = 20;

    // (Optional but needed) CompareModal needs filtersApi; keep this fetch here.
    React.useEffect(() => {
        const run = async () => {
            try {
                const res = await fetch("/api/darkroom/filters");
                const json = (await res.json()) as FiltersApi;
                setFiltersApi(json);
            } catch (e) {
                console.error(e);
                setFiltersApi(null);
            }
        };
        run();
    }, []);

    const buildUrl = React.useCallback(() => {
        const params = new URLSearchParams();
        if (filters.questionId) params.set("questionId", filters.questionId);
        if (filters.optionId) params.set("optionId", filters.optionId);
        if (filters.age) params.set("age", filters.age);
        if (filters.gender) params.set("gender", filters.gender);
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        return `/api/darkroom/responses/list?${params.toString()}`;
    }, [filters.questionId, filters.optionId, filters.age, filters.gender, page]);

    // Reset page when shared filters change
    React.useEffect(() => {
        setPage(1);
    }, [filters.questionId, filters.optionId, filters.age, filters.gender]);

    // Load rows
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

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div style={{ marginTop: 28 }}>
            <div className="fs18 fw700">Respuestas (Dark Room)</div>
            <div style={{ height: 10 }} />

            {/* Filters removed from here */}

            <div style={{ height: 14 }} />

            {loadingFilters ? <div className="dash-loading">Cargando filtros...</div> : null}

            {loading ? (
                <div className="dash-loading">Cargando respuestas...</div>
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
                                <th style={{ padding: 12 }}>Pregunta</th>
                                <th style={{ padding: 12 }}>Opción</th>
                                <th style={{ padding: 12 }}>Edad</th>
                                <th style={{ padding: 12 }}>Género</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((r, idx) => (
                                <tr key={idx} style={{ borderBottom: "1px solid #000" }}>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{String(r.created_at).slice(0, 10)}</td>
                                    <td style={{ padding: 12, minWidth: 340, whiteSpace: "wrap", maxWidth: 340 }}>{r.question_text}</td>
                                    <td style={{ padding: 12, minWidth: 280, maxWidth: 280 }}>{r.option_text}</td>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{r.age_group}</td>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{r.gender}</td>
                                </tr>
                            ))}

                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: 16, color: "#777" }}>
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
                        Página {page} / {totalPages}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        style={{ height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
                    >
                        Siguiente
                    </button>
                </div>

                <button
                    onClick={() => setCompareOpen(true)}
                    style={{
                        height: 40,
                        padding: "0 12px",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        background: "#000",
                        color: "#fff",
                    }}
                >
                    Comparar
                </button>
            </div>

            <DarkRoomCompareModal
                open={compareOpen}
                onClose={() => setCompareOpen(false)}
                filtersApi={filtersApi}
                onApply={(val) => {
                    setCompareOpen(false);

                    const params = new URLSearchParams();
                    params.set("dimension", val.dimension);
                    val.aValues.forEach((x) => params.append("a", x));
                    val.bValues.forEach((x) => params.append("b", x));

                    router.push(`/darkroom/compare?${params.toString()}`);
                }}
            />
        </div>
    );
}
