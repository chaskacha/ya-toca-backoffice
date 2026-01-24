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
import Filter from "../basic/filter/Filter";
import { useMediaQuery } from "@/hooks/useMediaQuery";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type Breakdown = Record<string, number>;

type ApiResponse = {
    totalParticipants: number;
    breakdown: {
        age: Breakdown;
        gender: Breakdown;
        regions: Breakdown;
        cabildos: Breakdown;
    };
    filters?: {
        regions?: string[];
    };
};

type CabildoItem = {
    id: number;
    nombre_de_cabildo: string;
};

function toChartData(obj: Breakdown) {
    const labels = Object.keys(obj);
    const values = Object.values(obj);
    return { labels, values };
}

export default function CabildosDashboard() {
    const [data, setData] = React.useState<ApiResponse | null>(null);
    const [loading, setLoading] = React.useState(true);

    const [filters, setFilters] = React.useState({
        region: "",
        age: "",
        gender: "",
        cabildoId: "",
    });

    const [cabildosList, setCabildosList] = React.useState<CabildoItem[]>([]);

    const isTabletOrLess = useMediaQuery("(max-width: 1024px)");

    // Load cabildos list once
    React.useEffect(() => {
        const loadCabildos = async () => {
            try {
                const res = await fetch("/api/cabildos/list");
                const json = await res.json();
                setCabildosList(json?.cabildos ?? []);
            } catch (e) {
                console.error("Failed to load cabildos list", e);
                setCabildosList([]);
            }
        };
        loadCabildos();
    }, []);

    const buildUrl = React.useCallback(() => {
        const params = new URLSearchParams();
        if (filters.region) params.set("region", filters.region);
        if (filters.age) params.set("age", filters.age);
        if (filters.gender) params.set("gender", filters.gender);
        if (filters.cabildoId) params.set("cabildoId", filters.cabildoId);

        const qs = params.toString();
        return qs ? `/api/cabildos/dashboard?${qs}` : `/api/cabildos/dashboard`;
    }, [filters]);

    // Fetch dashboard whenever filters change
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
    const regions = React.useMemo(() => (data ? toChartData(data.breakdown.regions) : null), [data]);

    // Region options: only regions with at least 1 record
    const regionOptions = React.useMemo(() => {
        const apiRegions = data?.filters?.regions?.filter(Boolean) ?? [];
        const chartRegions = Object.keys(data?.breakdown?.regions ?? {}).filter(
            (r) => r && r.trim() !== "" && r !== "Otros" && r !== "No especifica"
        );
        const unique = Array.from(new Set([...apiRegions, ...chartRegions]));
        unique.sort((a, b) => a.localeCompare(b, "es"));
        return [{ label: "Todos", value: "" }, ...unique.map((r) => ({ label: r, value: r }))];
    }, [data]);

    const ageOptions = React.useMemo(
        () => [
            { label: "Todos", value: "" },
            { label: "16-29", value: "16-29" },
            { label: "30-45", value: "30-45" },
            { label: "46+", value: "46+" },
        ],
        []
    );

    const genderOptions = React.useMemo(
        () => [
            { label: "Todos", value: "" },
            { label: "Femenino", value: "Femenino" },
            { label: "Masculino", value: "Masculino" },
            { label: "Prefiero no indicar", value: "Prefiero no indicar" },
        ],
        []
    );

    const cabildoOptions = React.useMemo(
        () => [
            { label: "Todos", value: "" },
            ...cabildosList.map((c) => ({ label: c.nombre_de_cabildo, value: String(c.id) })),
        ],
        [cabildosList]
    );

    // ✅ stable cabildo colors (based on labels order)
    const cabildoLabels = React.useMemo(() => Object.keys(data?.breakdown?.cabildos ?? {}), [data]);
    const cabildoValues = React.useMemo(() => Object.values(data?.breakdown?.cabildos ?? {}), [data]);
    const cabildoColors = React.useMemo(
        () => cabildoLabels.map((_, i) => CHART_COLORS.cabildos[i % CHART_COLORS.cabildos.length]),
        [cabildoLabels]
    );

    const cabildosDynamicHeight = React.useMemo(() => {
        if (!isTabletOrLess) return 420;
        return Math.max(360, cabildoLabels.length * 34);
    }, [isTabletOrLess, cabildoLabels.length]);

    if (loading) return <div className="dash-loading">Cargando dashboard...</div>;
    if (!data) return <div className="dash-loading">No se pudo cargar la data.</div>;

    return (
        <div className="dash-container">
            <div className="fs18 fw700">
                Total: {data.totalParticipants.toLocaleString()} Participantes
            </div>

            <br />

            <div
                style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 16,
                    alignItems: "flex-end",
                }}
            >
                <Filter
                    label="Cabildo"
                    value={filters.cabildoId}
                    onChange={(v) => setFilters((p) => ({ ...p, cabildoId: v }))}
                    options={cabildoOptions}
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

                <Filter
                    label="Región"
                    value={filters.region}
                    onChange={(v) => setFilters((p) => ({ ...p, region: v }))}
                    options={regionOptions}
                />

                <button
                    onClick={() => setFilters({ region: "", age: "", gender: "", cabildoId: "" })}
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

            <br />

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
                                plugins: {
                                    legend: { position: "bottom" },
                                },
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
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                            }}
                        />
                    )}
                </Card>

                <Card title="Regiones" scrollY maxBodyHeight={400}>
                    {regions && (
                        <Doughnut
                            data={{
                                labels: regions.labels,
                                datasets: [
                                    {
                                        data: regions.values,
                                        backgroundColor: colorsFromMap(regions.labels, CHART_COLORS.regions),
                                        borderWidth: 0,
                                    },
                                ],
                            }}
                            options={{
                                cutout: "70%",
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                            }}
                        />
                    )}
                </Card>
            </div>

            <div className="dash-grid-2">
                <Card title="Participantes por Cabildo">
                    <div style={{ height: cabildosDynamicHeight, width: "100%" }}>
                        <Bar
                            data={{
                                labels: cabildoLabels,
                                datasets: [
                                    {
                                        data: cabildoValues,
                                        backgroundColor: cabildoColors,
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
                                        y: {
                                            ticks: { autoSkip: false, font: { size: 12 } },
                                            grid: { display: false },
                                        },
                                    }
                                    : {
                                        x: { ticks: { autoSkip: true, maxRotation: 25, minRotation: 0 } },
                                        y: { ticks: { precision: 0 } },
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
    centerText,
    scrollY = false,
    maxBodyHeight = 520,
}: {
    title: string;
    children: React.ReactNode;
    centerText?: string;
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
                <div className="dash-chart-wrap">
                    {centerText ? <div className="dash-center-text">{centerText}</div> : null}
                    {children}
                </div>
            </div>
        </div>
    );
}
