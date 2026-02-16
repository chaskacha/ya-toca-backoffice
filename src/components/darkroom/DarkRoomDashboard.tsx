'use client';

import React from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./styles.css";
import { colorsFromMap } from "@/utils/chartHelper";
import { CHART_COLORS } from "@/constants/chartColors";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { buildPercentRows } from "@/constants/functions";
import Card from "../commons/common/Card";
import type { DarkRoomFiltersState } from "@/app/darkroom/page";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type Breakdown = Record<string, number>;

type PivotRow = {
    questionId: number;
    questionText: string;
    optionId: number;
    optionText: string;
    cells: Record<string, Record<string, { count: number; pct: number }>>;
    total: number;
    totalPct: number;
};

type PivotTotals = {
    colTotals: Record<string, Record<string, number>>;
    grandTotal: number;
};

type ApiResponse = {
    totalResponses: number;
    breakdown: {
        age: Breakdown;
        gender: Breakdown;
        byQuestion: Breakdown;
        byOption: Breakdown;
        pivot: {
            genders: string[];     // ["Masculino","Femenino","Otro"]
            ageGroups: string[];   // ["16-29","30-45","46+"]
            rows: PivotRow[];
            totals: PivotTotals;
        };
    };
};

function toChartData(obj: Breakdown) {
    const labels = Object.keys(obj);
    const values = Object.values(obj);
    return { labels, values };
}

export default function DarkRoomDashboard({
    filters,
    loadingFilters,
}: {
    filters: DarkRoomFiltersState;
    loadingFilters?: boolean;
}) {
    const [data, setData] = React.useState<ApiResponse | null>(null);
    const [loading, setLoading] = React.useState(true);

    const isTabletOrLess = useMediaQuery("(max-width: 1024px)");

    const buildUrl = React.useCallback(() => {
        const params = new URLSearchParams();
        if (filters.questionId) params.set("questionId", filters.questionId);
        if (filters.optionId) params.set("optionId", filters.optionId);
        if (filters.age) params.set("age", filters.age);
        if (filters.gender) params.set("gender", filters.gender);

        const qs = params.toString();
        return qs ? `/api/darkroom/dashboard?${qs}` : `/api/darkroom/dashboard`;
    }, [filters.questionId, filters.optionId, filters.age, filters.gender]);

    React.useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const res = await fetch(buildUrl());
                const json = (await res.json()) as ApiResponse;
                setData(json);
            } catch (e) {
                console.error(e);
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [buildUrl]);

    const age = React.useMemo(() => (data ? toChartData(data.breakdown.age) : null), [data]);
    const gender = React.useMemo(() => (data ? toChartData(data.breakdown.gender) : null), [data]);

    // (kept, even if not rendered in your snippet)
    const byQuestion = React.useMemo(() => (data ? toChartData(data.breakdown.byQuestion) : null), [data]);
    const byOption = React.useMemo(() => (data ? toChartData(data.breakdown.byOption) : null), [data]);

    const byOptionColors = React.useMemo(
        () => (byOption?.labels ?? []).map((_, i) => CHART_COLORS.cabildos[i % CHART_COLORS.cabildos.length]),
        [byOption?.labels]
    );

    // heights kept (even if not used)
    React.useMemo(() => {
        const n = byQuestion?.labels?.length ?? 0;
        if (!isTabletOrLess) return 420;
        return Math.max(320, n * 34);
    }, [isTabletOrLess, byQuestion?.labels?.length]);

    React.useMemo(() => {
        const n = byOption?.labels?.length ?? 0;
        if (!isTabletOrLess) return 520;
        return Math.max(360, n * 34);
    }, [isTabletOrLess, byOption?.labels?.length]);

    if (loadingFilters) return <div className="dash-loading">Cargando filtros...</div>;
    if (loading) return <div className="dash-loading">Cargando dashboard...</div>;
    if (!data) return <div className="dash-loading">No se pudo cargar la data.</div>;

    return (
        <div className="dash-container">
            <div className="fs18 fw700">Total: {data.totalResponses.toLocaleString()} Respuestas</div>

            <div style={{ height: 18 }} />

            <div className="dash-grid">
                {!filters.age && <Card title="Edad" scrollY maxBodyHeight={600} minHeight={400}>
                    {age && (() => {
                        const rows = buildPercentRows(age.labels, age.values);

                        return (
                            <div style={{ width: "100%", maxWidth: 420, minHeight: 200, maxHeight: 200, margin: "0 auto" }}>
                                <Doughnut
                                    data={{
                                        labels: age.labels,
                                        datasets: [{
                                            data: age.values,
                                            backgroundColor: colorsFromMap(age.labels, CHART_COLORS.age),
                                            borderWidth: 0,
                                        }],
                                    }}
                                    options={{
                                        cutout: "70%",
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                callbacks: {
                                                    label: (ctx) => {
                                                        const label = ctx.label || "";
                                                        const value = Number(ctx.parsed || 0);
                                                        const total = (ctx.dataset.data as number[]).reduce((a, b) => a + Number(b || 0), 0) || 1;
                                                        const pct = ((value / total) * 100).toFixed(1);
                                                        return `${label}: ${value} (${pct}%)`;
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />

                                <div style={{ marginTop: 12, fontSize: 13 }}>
                                    {rows.map((r) => (
                                        <div
                                            key={r.label}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: 12,
                                                padding: "6px 0",
                                                borderBottom: "1px solid rgba(0,0,0,0.06)",
                                            }}
                                        >
                                            <span>{r.label}</span>
                                            <span style={{ opacity: 0.85 }}>{r.value} · {r.pct.toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </Card>}

                {!filters.gender && <Card title="Género" scrollY maxBodyHeight={600} minHeight={400}>
                    {gender && (() => {
                        const rows = buildPercentRows(gender.labels, gender.values);

                        return (
                            <div style={{ width: "100%", maxWidth: 420, minHeight: 200, maxHeight: 200, margin: "0 auto" }}>
                                <Doughnut
                                    data={{
                                        labels: gender.labels,
                                        datasets: [{
                                            data: gender.values,
                                            backgroundColor: colorsFromMap(gender.labels, CHART_COLORS.gender),
                                            borderWidth: 0,
                                        }],
                                    }}
                                    options={{
                                        cutout: "70%",
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                callbacks: {
                                                    label: (ctx) => {
                                                        const label = ctx.label || "";
                                                        const value = Number(ctx.parsed || 0);
                                                        const total = (ctx.dataset.data as number[]).reduce((a, b) => a + Number(b || 0), 0) || 1;
                                                        const pct = ((value / total) * 100).toFixed(1);
                                                        return `${label}: ${value} (${pct}%)`;
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />

                                <div style={{ marginTop: 12, fontSize: 13 }}>
                                    {rows.map((r) => (
                                        <div
                                            key={r.label}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: 12,
                                                padding: "6px 0",
                                                borderBottom: "1px solid rgba(0,0,0,0.06)",
                                            }}
                                        >
                                            <span>{r.label}</span>
                                            <span style={{ opacity: 0.85 }}>{r.value} · {r.pct.toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </Card>}
            </div>

            {/* Keep your table card below as-is; it will now react to shared filters.optionId/questionId */}
            <div className="dash-grid-2">
                <Card title="Respuestas por Opción" scrollY maxBodyHeight={560}>
                    {(() => {
                        const pivot = data?.breakdown?.pivot;

                        if (!pivot?.rows?.length) {
                            return <div style={{ padding: 12, color: "#777" }}>No hay data para mostrar.</div>;
                        }

                        const genders = pivot.genders?.length ? pivot.genders : ["Masculino", "Femenino", "Otro"];
                        const ageGroups = pivot.ageGroups?.length ? pivot.ageGroups : ["16-29", "30-45", "46+"];

                        const rows = [...pivot.rows];

                        // opcional: ordena por pregunta y luego por total desc
                        rows.sort((a, b) => {
                            if (a.questionId !== b.questionId) return a.questionId - b.questionId;
                            return (b.total ?? 0) - (a.total ?? 0);
                        });

                        const grandTotal = pivot.totals?.grandTotal ?? rows.reduce((acc, r) => acc + (r.total || 0), 0);

                        const genderLabel: Record<string, string> = {
                            Masculino: "Masculino",
                            Femenino: "Femenino",
                            Otro: "Otro",
                        };

                        const border = "1px solid rgba(0,0,0,0.12)";
                        const headerBg1 = "rgba(0,0,0,0.04)";  // top header
                        const headerBg2 = "rgba(0,0,0,0.02)";  // sub headers

                        const thBase: React.CSSProperties = {
                            border,
                            padding: "10px 8px",
                            verticalAlign: "middle",
                        };

                        const thGroup: React.CSSProperties = {
                            ...thBase,
                            background: headerBg1,
                            fontWeight: 800,
                            textAlign: "center",
                        };

                        const thSub: React.CSSProperties = {
                            ...thBase,
                            background: headerBg2,
                            fontWeight: 700,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                        };

                        const thMini: React.CSSProperties = {
                            ...thBase,
                            background: headerBg2,
                            fontWeight: 700,
                            textAlign: "right",
                            whiteSpace: "nowrap",
                        };

                        const tdBase: React.CSSProperties = {
                            border,
                            padding: "8px",
                            verticalAlign: "top",
                        };

                        const tdNum: React.CSSProperties = {
                            ...tdBase,
                            textAlign: "right",
                            fontVariantNumeric: "tabular-nums",
                            whiteSpace: "nowrap",
                        };

                        const tdText: React.CSSProperties = {
                            ...tdBase,
                        };

                        const stickyLeft: React.CSSProperties = {
                            position: "sticky",
                            left: 0,
                            background: "#fff",
                            zIndex: 2,
                        };

                        const stickyLeft2: React.CSSProperties = {
                            position: "sticky",
                            left: 320, // match minWidth of Pregunta column
                            background: "#fff",
                            zIndex: 2,
                        };

                        const stickyHeader: React.CSSProperties = {
                            position: "sticky",
                            top: 0,
                            zIndex: 5,
                        };


                        return (
                            <div style={{ width: "100%", overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1200 }}>
                                    <thead>
                                        {/* Row 1: grupos por Género */}
                                        <tr style={{ textAlign: "left", ...stickyHeader }}>
                                            <th style={{ ...thBase, ...stickyHeader, ...stickyLeft, minWidth: 320, maxWidth: 420, background: headerBg1 }} rowSpan={3}>
                                                Pregunta
                                            </th>
                                            <th style={{ ...thBase, ...stickyHeader, ...stickyLeft2, minWidth: 260, maxWidth: 340, background: headerBg1 }} rowSpan={3}>
                                                Opción
                                            </th>

                                            {genders.map((g) => (
                                                <th key={g} colSpan={ageGroups.length * 2} style={{ ...thGroup, ...stickyHeader }}>
                                                    {genderLabel[g] ?? g}
                                                </th>
                                            ))}

                                            <th style={{ ...thBase, ...stickyHeader, background: headerBg1, textAlign: "right", whiteSpace: "nowrap" }} rowSpan={3}>
                                                Total
                                            </th>
                                            <th style={{ ...thBase, ...stickyHeader, background: headerBg1, textAlign: "right", whiteSpace: "nowrap" }} rowSpan={3}>
                                                %
                                            </th>
                                        </tr>


                                        {/* Row 2: Edad */}
                                        <tr style={{ ...stickyHeader }}>
                                            {genders.flatMap((g) =>
                                                ageGroups.map((age) => (
                                                    <th key={`${g}-${age}`} colSpan={2} style={{ ...thSub, ...stickyHeader }}>
                                                        {age}
                                                    </th>
                                                ))
                                            )}
                                        </tr>


                                        {/* Row 3: Count / % */}
                                        <tr style={{ ...stickyHeader }}>
                                            {genders.flatMap((g) =>
                                                ageGroups.flatMap((age) => [
                                                    <th key={`${g}-${age}-count`} style={{ ...thMini, ...stickyHeader }}>#</th>,
                                                    <th key={`${g}-${age}-pct`} style={{ ...thMini, ...stickyHeader }}>%</th>,
                                                ])
                                            )}
                                        </tr>

                                    </thead>

                                    <tbody>
                                        {rows.map((r, idx) => {
                                            const totalPct = grandTotal ? ((r.total || 0) / grandTotal) * 100 : 0;
                                            const isNewQuestion = idx === 0 || rows[idx - 1]?.questionId !== r.questionId;
                                            const rowBg = idx % 2 === 0 ? "#fff" : "rgba(0,0,0,0.015)";

                                            return (
                                                <tr key={`${r.questionId}-${r.optionId}`}
                                                    style={{
                                                        background: rowBg,
                                                        borderTop: isNewQuestion ? "2px solid rgba(0,0,0,0.25)" : undefined,
                                                    }}>
                                                    <td style={{ ...tdText, ...stickyLeft, minWidth: 320, maxWidth: 420, fontWeight: isNewQuestion ? 700 : 500 }}>
                                                        {r.questionText}
                                                    </td>

                                                    <td style={{ ...tdText, ...stickyLeft2, minWidth: 260, maxWidth: 340 }}>
                                                        {r.optionText}
                                                    </td>

                                                    {genders.flatMap((g) =>
                                                        ageGroups.flatMap((age) => {
                                                            const cell = r.cells?.[g]?.[age];
                                                            const count = Number(cell?.count ?? 0);
                                                            const pct = Number(cell?.pct ?? 0); // % dentro de la columna (género+edad)

                                                            return [
                                                                <td style={tdNum}>{count || ""}</td>,
                                                                <td style={{ ...tdNum, opacity: 0.85 }}>{count ? `${pct.toFixed(2)}%` : ""}</td>,
                                                            ];
                                                        })
                                                    )}

                                                    <td style={{ ...tdNum, fontWeight: 800 }}>{r.total}</td>
                                                    <td style={{ ...tdNum, fontWeight: 700, opacity: 0.9 }}>{totalPct.toFixed(2)}%</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                    {/* Footer: totales por columna */}
                                    <tfoot>
                                        <tr style={{ background: "rgba(0,0,0,0.04)" }}>
                                            <td style={{ ...tdText, ...stickyLeft, fontWeight: 800 }} colSpan={2}>
                                                Total
                                            </td>

                                            {genders.flatMap((g) =>
                                                ageGroups.flatMap((age) => {
                                                    const colTotal = pivot.totals?.colTotals?.[g]?.[age] ?? 0;

                                                    return [
                                                        <td
                                                            key={`tot-${g}-${age}-count`}
                                                            style={{
                                                                padding: "10px 8px",
                                                                textAlign: "right",
                                                                fontWeight: 700,
                                                                fontVariantNumeric: "tabular-nums",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {colTotal || ""}
                                                        </td>,
                                                        <td
                                                            key={`tot-${g}-${age}-pct`}
                                                            style={{
                                                                padding: "10px 8px",
                                                                textAlign: "right",
                                                                fontWeight: 700,
                                                                whiteSpace: "nowrap",
                                                                opacity: 0.85,
                                                            }}
                                                        >
                                                            {/* en el total de columna normalmente no se pone % (en tu Excel está vacío) */}
                                                            {""}
                                                        </td>,
                                                    ];
                                                })
                                            )}

                                            <td style={{ ...tdNum, fontWeight: 800 }}>
                                                {grandTotal}
                                            </td>
                                            <td style={{ ...tdNum, fontWeight: 800 }}>
                                                {grandTotal ? "100%" : "0%"}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        );
                    })()}
                </Card>
            </div>
        </div>
    );
}
