'use client';

import React from "react";
import { useRouter } from "next/navigation";
import CompareModal from "./CompareModal";
import { get_substring } from "@/constants/functions";

type Row = {
    created_at: string;

    event_id: number | null;
    event_name: string | null;

    id_region: number | null;
    region_name: string | null;

    activity_id: number;
    name_event: string | null;
    date_event: string | null;

    phrase: string;
    question: string | null;
    photo_url?: string | null;
};

export default function MuralsPhrasesTable({
    filters,
}: {
    filters: { regionId: string[]; eventId: string[]; activityId: string[] };
}) {
    const router = useRouter();
    const [compareOpen, setCompareOpen] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [rows, setRows] = React.useState<Row[]>([]);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const pageSize = 100;

    const buildUrl = React.useCallback(() => {
        const params = new URLSearchParams();

        (filters.regionId ?? []).forEach((v) => params.append("regionId", v));
        (filters.eventId ?? []).forEach((v) => params.append("eventId", v));
        (filters.activityId ?? []).forEach((v) => params.append("activityId", v));

        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        return `/api/murals/phrases/list?${params.toString()}`;
    }, [filters.regionId, filters.eventId, filters.activityId, page]);

    React.useEffect(() => {
        setPage(1);
    }, [filters.regionId, filters.eventId, filters.activityId]);

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
            <div className="fs18 fw700">Frases extraídas</div>
            <div style={{ height: 10 }} />

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

                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                        <thead>
                            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                                <th style={{ padding: 12 }}>Región</th>
                                <th style={{ padding: 12 }}>Actividad</th>
                                <th style={{ padding: 12 }}>Frase</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((r, idx) => (
                                <tr key={idx} style={{ borderBottom: "1px solid #000" }}>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                                        {get_substring(r.region_name?.toUpperCase() || "", 3, "") || "Sin región"}
                                    </td>

                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                                        <div style={{ fontWeight: 600 }}>
                                            {r.name_event?.split(" - ")[0] ?? "Sin actividad"}
                                        </div>

                                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                                            {r.event_name || "Sin evento"}
                                        </div>
                                    </td>

                                    <td style={{ padding: 12, minWidth: 520, maxWidth: 720 }}>
                                        <div
                                            style={{
                                                whiteSpace: "normal",
                                                wordBreak: "break-word",
                                                overflowWrap: "anywhere",
                                                lineHeight: 1.35,
                                            }}
                                        >
                                            {r.phrase}
                                        </div>

                                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                                            {r.question || "Sin pregunta"}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ padding: 16, color: "#777" }}>
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

            <CompareModal
                open={compareOpen}
                onClose={() => setCompareOpen(false)}
                filtersApi={null}
                onApply={(val) => {
                    setCompareOpen(false);

                    const params = new URLSearchParams();
                    params.set("dimension", "eventId"); // unchanged for now

                    val.aValues.forEach((x) => params.append("a", x));
                    val.bValues.forEach((x) => params.append("b", x));

                    router.push(`/murals/compare?${params.toString()}`);
                }}
            />
        </div>
    );
}