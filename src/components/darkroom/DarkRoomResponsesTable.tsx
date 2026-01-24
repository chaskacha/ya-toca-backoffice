'use client';

import React from "react";
import Filter from "@/components/basic/filter/Filter";
import DarkRoomCompareModal from "@/components/darkroom/DarkRoomCompareModal";
import { useRouter } from "next/navigation";

type Option = { label: string; value: string };

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

export default function DarkRoomResponsesTable() {
    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    const router = useRouter();
    const [compareOpen, setCompareOpen] = React.useState(false);

    const [filters, setFilters] = React.useState({
        questionId: "",
        optionId: "",
        age: "",
        gender: "",
    });

    const [loading, setLoading] = React.useState(true);
    const [rows, setRows] = React.useState<Row[]>([]);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const pageSize = 20;

    // Load filters once
    React.useEffect(() => {
        const run = async () => {
            try {
                setLoadingFilters(true);
                const res = await fetch("/api/darkroom/filters");
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
        if (filters.questionId) params.set("questionId", filters.questionId);
        if (filters.optionId) params.set("optionId", filters.optionId);
        if (filters.age) params.set("age", filters.age);
        if (filters.gender) params.set("gender", filters.gender);
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        return `/api/darkroom/responses/list?${params.toString()}`;
    }, [filters, page]);

    // Reset to page 1 when filters change
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

    const questionOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.questions ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((q) => ({ label: q.text, value: String(q.id) }))];
    }, [filtersApi]);

    const optionOptions: Option[] = React.useMemo(() => {
        const qid = filters.questionId && /^\d+$/.test(filters.questionId) ? Number(filters.questionId) : null;
        if (!qid || !filtersApi?.optionsByQuestion?.[qid]) return [{ label: "Todas", value: "" }];
        const list = filtersApi.optionsByQuestion[qid] ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((o) => ({ label: o.text, value: String(o.id) }))];
    }, [filtersApi, filters.questionId]);

    const ageOptions: Option[] = React.useMemo(
        () => [
            { label: "Todas", value: "" },
            { label: "16-29", value: "16-29" },
            { label: "30-45", value: "30-45" },
            { label: "46+", value: "46+" },
            { label: "No especifica", value: "No especifica" },
        ],
        []
    );

    const genderOptions: Option[] = React.useMemo(
        () => [
            { label: "Todos", value: "" },
            { label: "Femenino", value: "Femenino" },
            { label: "Masculino", value: "Masculino" },
            { label: "Prefiero no indicar", value: "Prefiero no indicar" },
            { label: "No especifica", value: "No especifica" },
        ],
        []
    );

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div style={{ marginTop: 28 }}>
            <div className="fs18 fw700">Respuestas (Dark Room)</div>
            <div style={{ height: 10 }} />

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Filter
                    label="Pregunta"
                    value={filters.questionId}
                    onChange={(v) =>
                        setFilters((p) => ({
                            ...p,
                            questionId: v,
                            optionId: "",
                        }))
                    }
                    options={questionOptions}
                />

                <Filter
                    label="Opción"
                    value={filters.optionId}
                    onChange={(v) => setFilters((p) => ({ ...p, optionId: v }))}
                    options={optionOptions}
                />

                <Filter
                    label="Edad"
                    value={filters.age}
                    onChange={(v) => setFilters((p) => ({ ...p, age: v }))}
                    options={ageOptions}
                />

                <Filter
                    label="Género"
                    value={filters.gender}
                    onChange={(v) => setFilters((p) => ({ ...p, gender: v }))}
                    options={genderOptions}
                />

                <button
                    onClick={() => setFilters({ questionId: "", optionId: "", age: "", gender: "" })}
                    style={{
                        height: 40,
                        padding: "0 12px",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        background: "#fff",
                    }}
                >
                    Limpiar
                </button>

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

            <div style={{ height: 14 }} />

            {loadingFilters ? <div className="dash-loading">Cargando filtros...</div> : null}

            {loading ? (
                <div className="dash-loading">Cargando respuestas...</div>
            ) : (
                <div style={{
                    width: "calc(100vw - 56px - 134px)",
                    overflowX: "auto",
                    border: "1px solid #000",
                    borderRadius: 12,
                    background: "#fff"
                }}>
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
