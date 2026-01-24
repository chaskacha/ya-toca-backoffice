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
import { Doughnut, Bar } from "react-chartjs-2";
import "./styles.css";
import { colorsFromMap } from "@/utils/chartHelper";
import { CHART_COLORS } from "@/constants/chartColors";
import Filter from "@/components/basic/filter/Filter";
import { useMediaQuery } from "@/hooks/useMediaQuery";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type Breakdown = Record<string, number>;

type FiltersApi = {
    questions: { id: number; text: string; sort_order?: number }[];
    optionsByQuestion: Record<number, { id: number; question_id: number; text: string; sort_order?: number }[]>;
    ageGroups: string[];
    genders: string[];
};

type ApiResponse = {
    totalResponses: number;
    breakdown: {
        age: Breakdown;
        gender: Breakdown;
        byQuestion: Breakdown;
        byOption: Breakdown;
    };
};

function toChartData(obj: Breakdown) {
    const labels = Object.keys(obj);
    const values = Object.values(obj);
    return { labels, values };
}

export default function DarkRoomDashboard() {
    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    const [data, setData] = React.useState<ApiResponse | null>(null);
    const [loading, setLoading] = React.useState(true);

    const [filters, setFilters] = React.useState({
        questionId: "",
        age: "",
        gender: "",
    });

    const isTabletOrLess = useMediaQuery("(max-width: 1024px)");

    // Load questions/options once
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
        if (filters.age) params.set("age", filters.age);
        if (filters.gender) params.set("gender", filters.gender);
        const qs = params.toString();
        return qs ? `/api/darkroom/dashboard?${qs}` : `/api/darkroom/dashboard`;
    }, [filters.questionId, filters.age, filters.gender]);

    // Fetch dashboard when question changes
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

    const byQuestion = React.useMemo(() => (data ? toChartData(data.breakdown.byQuestion) : null), [data]);
    const byOption = React.useMemo(() => (data ? toChartData(data.breakdown.byOption) : null), [data]);

    const questionOptions = React.useMemo(() => {
        const list = filtersApi?.questions ?? [];
        return [
            { label: "Todas", value: "" },
            ...list.map((q) => ({ label: q.text, value: String(q.id) })),
        ];
    }, [filtersApi]);

    const ageOptions = React.useMemo(() => {
        const list = filtersApi?.ageGroups ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((x) => ({ label: x, value: x }))];
    }, [filtersApi]);

    const genderOptions = React.useMemo(() => {
        const list = filtersApi?.genders ?? [];
        return [{ label: "Todos", value: "" }, ...list.map((x) => ({ label: x, value: x }))];
    }, [filtersApi]);

    // Dynamic heights for long category bars
    const byQuestionHeight = React.useMemo(() => {
        const n = byQuestion?.labels?.length ?? 0;
        if (!isTabletOrLess) return 420;
        return Math.max(320, n * 34);
    }, [isTabletOrLess, byQuestion?.labels?.length]);

    const byOptionHeight = React.useMemo(() => {
        const n = byOption?.labels?.length ?? 0;
        if (!isTabletOrLess) return 520;
        return Math.max(360, n * 34);
    }, [isTabletOrLess, byOption?.labels?.length]);

    // stable colors
    const byQuestionColors = React.useMemo(
        () => (byQuestion?.labels ?? []).map((_, i) => CHART_COLORS.cabildos[i % CHART_COLORS.cabildos.length]),
        [byQuestion?.labels]
    );

    const byOptionColors = React.useMemo(
        () => (byOption?.labels ?? []).map((_, i) => CHART_COLORS.cabildos[i % CHART_COLORS.cabildos.length]),
        [byOption?.labels]
    );

    if (loadingFilters) return <div className="dash-loading">Cargando filtros...</div>;
    if (loading) return <div className="dash-loading">Cargando dashboard...</div>;
    if (!data) return <div className="dash-loading">No se pudo cargar la data.</div>;

    return (
        <div className="dash-container">
            <div className="fs18 fw700">
                Total: {data.totalResponses.toLocaleString()} Respuestas
            </div>

            <div style={{ height: 14 }} />

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Filter
                    label="Pregunta"
                    value={filters.questionId}
                    onChange={(v) => setFilters((p) => ({ ...p, questionId: v }))}
                    options={questionOptions}
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
                    onClick={() => setFilters({ questionId: "", age: "", gender: "" })}
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
            </div>

            <div style={{ height: 18 }} />

            <div className="dash-grid">
                <Card title="Edad">
                    {age && (
                        <Doughnut
                            data={{
                                labels: age.labels,
                                datasets: [
                                    {
                                        data: age.values,
                                        backgroundColor: colorsFromMap(age.labels, CHART_COLORS.age),
                                        borderWidth: 0,
                                    },
                                ],
                            }}
                            options={{
                                cutout: "70%",
                                plugins: { legend: { position: "bottom" } },
                            }}
                        />
                    )}
                </Card>

                <Card title="Género">
                    {gender && (
                        <Doughnut
                            data={{
                                labels: gender.labels,
                                datasets: [
                                    {
                                        data: gender.values,
                                        backgroundColor: colorsFromMap(gender.labels, CHART_COLORS.gender),
                                        borderWidth: 0,
                                    },
                                ],
                            }}
                            options={{
                                cutout: "70%",
                                plugins: { legend: { position: "bottom" } },
                            }}
                        />
                    )}
                </Card>
            </div>

            <div className="dash-grid-2">
                <Card title="Respuestas por Opción" scrollY maxBodyHeight={560}>
                    <div style={{ height: byOptionHeight, width: "100%" }}>
                        <Bar
                            data={{
                                labels: byOption?.labels ?? [],
                                datasets: [{ data: byOption?.values ?? [], backgroundColor: byOptionColors }],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                indexAxis: "y",
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { ticks: { precision: 0 } },
                                    y: { ticks: { autoSkip: false, font: { size: 12 } }, grid: { display: false } },
                                },
                            }}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}

function Card({
    title,
    children,
    scrollY = false,
    maxBodyHeight = 520,
}: {
    title: string;
    children: React.ReactNode;
    scrollY?: boolean;
    maxBodyHeight?: number;
}) {
    return (
        <div className="dash-card">
            <div className="dash-card-title">{title}</div>

            <div
                className="dash-card-body"
                style={
                    scrollY
                        ? {
                            maxHeight: maxBodyHeight,
                            overflowY: "auto",
                            overflowX: "hidden",
                        }
                        : undefined
                }
            >
                <div className="dash-chart-wrap">{children}</div>
            </div>
        </div>
    );
}
