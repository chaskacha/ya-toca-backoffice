"use client";

import React from "react";
import Filter from "@/components/basic/filter/Filter";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { CHART_COLORS } from "@/constants/chartColors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

type Breakdown = Record<string, number>;

type DashboardResponse = {
    totalEpisodes: number;
    breakdown: {
        programs: Breakdown;
        topics: Breakdown;     // include "Sin tema"
        status: Breakdown;     // pending|processing|done|error (optional)
    };
};

type FiltersResponse = {
    programs: { id: number; name_program: string }[];
    topics: { id: number; topic_name: string }[];
};

function toChartData(obj: Breakdown) {
    const labels = Object.keys(obj || {});
    const values = Object.values(obj || {});
    return { labels, values };
}

function clampStr(x: any) {
    return String(x ?? "").trim();
}

export default function RadioDashboard() {
    const [filtersApi, setFiltersApi] = React.useState<FiltersResponse | null>(null);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    const [filters, setFilters] = React.useState({ programId: "", topicId: "" });

    const [data, setData] = React.useState<DashboardResponse | null>(null);
    const [loading, setLoading] = React.useState(true);

    const isTabletOrLess = useMediaQuery("(max-width: 1024px)");

    // load filters once
    React.useEffect(() => {
        const run = async () => {
            try {
                setLoadingFilters(true);
                const res = await fetch("/api/radio/filters");
                const json = (await res.json()) as FiltersResponse;
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
        if (filters.programId) params.set("programId", filters.programId);
        if (filters.topicId) params.set("topicId", filters.topicId);
        const qs = params.toString();
        return qs ? `/api/radio/dashboard?${qs}` : `/api/radio/dashboard`;
    }, [filters.programId, filters.topicId]);

    React.useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const res = await fetch(buildUrl());
                const json = (await res.json()) as DashboardResponse;
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

    const programOptions = React.useMemo(() => {
        const list = filtersApi?.programs ?? [];
        return [{ label: "Todos", value: "" }, ...list.map((p) => ({ label: p.name_program, value: String(p.id) }))];
    }, [filtersApi]);

    const topicOptions = React.useMemo(() => {
        const list = filtersApi?.topics ?? [];
        // include "Sin tema" as special value "null"
        return [
            { label: "Todos", value: "" },
            { label: "Sin tema", value: "null" },
            ...list.map((t) => ({ label: t.topic_name, value: String(t.id) })),
        ];
    }, [filtersApi]);

    const programs = React.useMemo(() => (data ? toChartData(data.breakdown.programs) : null), [data]);
    const topics = React.useMemo(() => (data ? toChartData(data.breakdown.topics) : null), [data]);
    const status = React.useMemo(() => (data ? toChartData(data.breakdown.status) : null), [data]);

    const colors = React.useMemo(
        () => CHART_COLORS.cabildos ?? ["#111", "#333", "#555", "#777"],
        []
    );

    const progHeight = React.useMemo(() => {
        const n = programs?.labels?.length ?? 0;
        if (!isTabletOrLess) return 420;
        return Math.max(320, n * 34);
    }, [isTabletOrLess, programs?.labels?.length]);

    if (loadingFilters) return <div className="dash-loading">Cargando filtros...</div>;
    if (loading) return <div className="dash-loading">Cargando dashboard...</div>;
    if (!data) return <div className="dash-loading">No se pudo cargar la data.</div>;

    return (
        <div className="dash-container">
            <div className="fs18 fw700">
                Total: {data.totalEpisodes.toLocaleString()} episodios
            </div>

            <div style={{ height: 12 }} />

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Filter
                    label="Programa"
                    value={filters.programId}
                    onChange={(v) => setFilters((p) => ({ ...p, programId: clampStr(v) }))}
                    options={programOptions}
                />
                <Filter
                    label="Topic"
                    value={filters.topicId}
                    onChange={(v) => setFilters((p) => ({ ...p, topicId: clampStr(v) }))}
                    options={topicOptions}
                />

                <button
                    onClick={() => setFilters({ programId: "", topicId: "" })}
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

            <div style={{ height: 16 }} />

            <div className="dash-grid">
                <Card title="Episodios por Programa" scrollY maxBodyHeight={520}>
                    <div style={{ height: progHeight, width: "100%" }}>
                        <Bar
                            data={{
                                labels: programs?.labels ?? [],
                                datasets: [
                                    {
                                        data: programs?.values ?? [],
                                        backgroundColor: (programs?.labels ?? []).map((_, i) => colors[i % colors.length]),
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                indexAxis: isTabletOrLess ? "y" : "x",
                                plugins: { legend: { display: false } },
                                scales: isTabletOrLess
                                    ? {
                                        x: { ticks: { precision: 0 } },
                                        y: { ticks: { autoSkip: false, font: { size: 12 } }, grid: { display: false } },
                                    }
                                    : {
                                        x: { ticks: { autoSkip: true, maxRotation: 25, minRotation: 0 } },
                                        y: { ticks: { precision: 0 } },
                                    },
                            }}
                        />
                    </div>
                </Card>

                <Card title="Episodios por Topic">
                    <Doughnut
                        data={{
                            labels: topics?.labels ?? [],
                            datasets: [{ data: topics?.values ?? [], backgroundColor: (topics?.labels ?? []).map((_, i) => colors[i % colors.length]) }],
                        }}
                        options={{ plugins: { legend: { position: "bottom" } } }}
                    />
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
                        ? { maxHeight: maxBodyHeight, overflowY: "auto", overflowX: "hidden" }
                        : undefined
                }
            >
                <div className="dash-chart-wrap">{children}</div>
            </div>
        </div>
    );
}
