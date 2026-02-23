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
import { Bar, Doughnut } from "react-chartjs-2";
import "./styles.css";
import { colorsFromMap } from "@/utils/chartHelper";
import { CHART_COLORS } from "@/constants/chartColors";
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

type TwoOptionsMeta = {
    aOptionId: number;
    bOptionId: number;
    aLabel: string;
    bLabel: string;
};

type SegmentRow = { label: string; a: number; b: number };

type TwoOptionsSegments = {
    gender?: SegmentRow[];
    age?: SegmentRow[];
    region?: SegmentRow[];
    gender_age?: SegmentRow[];
    gender_region?: SegmentRow[];
    age_region?: SegmentRow[];
    gender_age_region?: SegmentRow[];
};

type ApiResponse = {
    totalResponses: number;
    twoOptionsMeta?: TwoOptionsMeta | null;
    twoOptionsSegments?: TwoOptionsSegments | null;
    breakdown: {
        age: Breakdown;
        gender: Breakdown;
        byQuestion: Breakdown;
        byOption: Breakdown;
        pivot: {
            genders: string[];
            ageGroups: string[];
            rows: PivotRow[];
            totals: PivotTotals;
        };
    };
};

type SegmentBy =
    | "gender"
    | "age"
    | "region"
    | "gender_age"
    | "gender_region"
    | "age_region"
    | "gender_age_region";

function toChartData(obj: Breakdown) {
    const labels = Object.keys(obj ?? {});
    const values = Object.values(obj ?? {}).map((x) => Number(x || 0));
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
    const [segmentBy, setSegmentBy] = React.useState<SegmentBy>("gender");

    const buildUrl = React.useCallback(() => {
        const params = new URLSearchParams();
        if (filters.regionId) params.set("regionId", filters.regionId);
        if (filters.questionId) params.set("questionId", filters.questionId);
        if (filters.optionId) params.set("optionId", filters.optionId);
        if (filters.age) params.set("age", filters.age);
        if (filters.gender) params.set("gender", filters.gender);

        const qs = params.toString();
        return qs ? `/api/darkroom/dashboard?${qs}` : `/api/darkroom/dashboard`;
    }, [filters.regionId, filters.questionId, filters.optionId, filters.age, filters.gender]);

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

    const twoOptionsSegmentChart = React.useMemo(() => {
        const meta = data?.twoOptionsMeta ?? null;
        const segs = data?.twoOptionsSegments ?? null;

        if (!meta || !segs) {
            return {
                ok: false,
                reason: "Selecciona una pregunta (y no una opción) para ver la comparación A vs B.",
                labels: [] as string[],
                aValues: [] as number[],
                bValues: [] as number[],
                aLabel: "",
                bLabel: "",
            };
        }

        const seg = (segs as any)?.[segmentBy] as SegmentRow[] | undefined;
        if (!seg?.length) {
            return {
                ok: false,
                reason: "No hay data para este segmento.",
                labels: [] as string[],
                aValues: [] as number[],
                bValues: [] as number[],
                aLabel: meta.aLabel,
                bLabel: meta.bLabel,
            };
        }

        return {
            ok: true,
            reason: "",
            labels: seg.map((x) => x.label),
            aValues: seg.map((x) => Number(x.a || 0)),
            bValues: seg.map((x) => Number(x.b || 0)),
            aLabel: meta.aLabel,
            bLabel: meta.bLabel,
        };
    }, [data, segmentBy]);

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

            {/* <div className="dash-grid-2">
                <Card title="Respuestas por Opción" scrollY maxBodyHeight={560}>
                    {(() => {
                        const pivot = data?.breakdown?.pivot;

                        if (!pivot?.rows?.length) {
                            return <div style={{ padding: 12, color: "#777" }}>No hay data para mostrar.</div>;
                        }

                        const genders = pivot.genders?.length ? pivot.genders : ["Masculino", "Femenino", "Otro"];
                        const ageGroups = pivot.ageGroups?.length ? pivot.ageGroups : ["15-", "16-29", "30-45", "46+"];

                        const rows = [...pivot.rows];
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
                        const headerBg1 = "rgba(0,0,0,0.04)";
                        const headerBg2 = "rgba(0,0,0,0.02)";

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
                            left: 320,
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

                                        <tr style={{ ...stickyHeader }}>
                                            {genders.flatMap((g) =>
                                                ageGroups.map((age) => (
                                                    <th key={`${g}-${age}`} colSpan={2} style={{ ...thSub, ...stickyHeader }}>
                                                        {age}
                                                    </th>
                                                ))
                                            )}
                                        </tr>

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
                                                                <td key={`${r.questionId}-${r.optionId}-${g}-${age}-count`} style={tdNum}>{count || ""}</td>,
                                                                <td key={`${r.questionId}-${r.optionId}-${g}-${age}-pct`} style={{ ...tdNum, opacity: 0.85 }}>{count ? `${pct.toFixed(2)}%` : ""}</td>,
                                                            ];
                                                        })
                                                    )}

                                                    <td style={{ ...tdNum, fontWeight: 800 }}>{r.total}</td>
                                                    <td style={{ ...tdNum, fontWeight: 700, opacity: 0.9 }}>{totalPct.toFixed(2)}%</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

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
            </div> */}
            <br />
            <div className="dash-grid-2" style={{ marginTop: 16 }}>
                <div>
                    <div className="dash-card-title">Comparación de opciones (A vs B) por segmento</div>

                    {!twoOptionsSegmentChart.ok ? (
                        <div style={{ color: "red", fontWeight: 700 }}>{twoOptionsSegmentChart.reason}</div>
                    ) : (
                        <div style={{ width: "100%", height: Math.max(320, twoOptionsSegmentChart.labels.length * 34) }}>
                            <Bar
                                data={{
                                    labels: twoOptionsSegmentChart.labels,
                                    datasets: [
                                        {
                                            label: twoOptionsSegmentChart.aLabel,
                                            data: twoOptionsSegmentChart.aValues,
                                            backgroundColor: "#E53935",
                                            borderWidth: 0,
                                            stack: "stack1",
                                        },
                                        {
                                            label: twoOptionsSegmentChart.bLabel,
                                            data: twoOptionsSegmentChart.bValues,
                                            backgroundColor: "#1E88E5",
                                            borderWidth: 0,
                                            stack: "stack1",
                                        },
                                    ],
                                }}
                                options={{
                                    indexAxis: "y",
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: "top" },
                                        tooltip: {
                                            callbacks: {
                                                label: (ctx) => {
                                                    const v = Number((ctx.parsed as any)?.x ?? 0);
                                                    return ` ${ctx.dataset.label}: ${v}`;
                                                },
                                            },
                                        },
                                    },
                                    scales: {
                                        x: { beginAtZero: true, stacked: true, ticks: { precision: 0 } },
                                        y: { stacked: true, ticks: { autoSkip: false } },
                                    },
                                }}
                            />
                        </div>
                    )}

                    <br />

                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                        <div style={{ fontSize: 13, opacity: 0.8 }}>Segmentar por:</div>

                        {(
                            [
                                ["gender", "Género"],
                                ["age", "Edad"],
                                ["region", "Región"],
                                ["gender_age", "Género × Edad"],
                                ["gender_region", "Género × Región"],
                                ["age_region", "Edad × Región"],
                                ["gender_age_region", "G × E × R"],
                            ] as const
                        ).map(([val, label]) => (
                            <button
                                key={val}
                                onClick={() => setSegmentBy(val)}
                                style={{
                                    height: 34,
                                    padding: "0 10px",
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                    background: segmentBy === val ? "rgba(0,0,0,0.06)" : "#fff",
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
