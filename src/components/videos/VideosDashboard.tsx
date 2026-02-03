'use client';

import React from "react";
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Filter from "@/components/basic/filter/Filter";
import { CHART_COLORS } from "@/constants/chartColors";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import "./styles.css";

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type Breakdown = Record<string, number>;
type Option = { label: string; value: string };

type FiltersApi = {
    regions: { id: number; nombreregion: string }[];
    events: { id: number; name_event: string; date_event: string; region_name?: string | null }[];
};

type ApiResponse = {
    totalVideos: number;
    totalPhrases: number;
    breakdown: {
        regions: Breakdown;
        events: Breakdown;
        topPhrases: { text: string; count: number }[];
    };
};

type EventItem = {
    id: number;
    name_event: string;
    date_event: string;
    region_name?: string | null;
};

function toChartData(obj: Breakdown) {
    const labels = Object.keys(obj);
    const values = Object.values(obj);
    return { labels, values };
}

export default function VideosDashboard() {
    const [data, setData] = React.useState<ApiResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    const [filters, setFilters] = React.useState({ regionId: "", eventId: "" });
    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const [eventsList, setEventsList] = React.useState<EventItem[]>([]);

    const isTabletOrLess = useMediaQuery("(max-width: 1024px)");

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

    React.useEffect(() => {
        const loadEvents = async () => {
            try {
                const params = new URLSearchParams();
                if (filters.regionId) params.set("regionId", filters.regionId);
                const url = params.toString()
                    ? `/api/videos/events/list?${params.toString()}`
                    : `/api/videos/events/list`;

                const res = await fetch(url);
                const json = await res.json();
                setEventsList(json?.events ?? []);
            } catch (e) {
                console.error("Failed to load events list", e);
                setEventsList([]);
            }
        };
        loadEvents();
    }, [filters.regionId]);

    const buildUrl = React.useCallback(() => {
        const params = new URLSearchParams();
        if (filters.regionId) params.set("regionId", filters.regionId);
        if (filters.eventId) params.set("eventId", filters.eventId);
        const qs = params.toString();
        return qs ? `/api/videos/dashboard?${qs}` : `/api/videos/dashboard`;
    }, [filters]);

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

    const phrasesByEvent = React.useMemo(
        () => (data ? toChartData(data.breakdown.events) : null),
        [data]
    );

    const regionOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.regions ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((r) => ({ label: r.nombreregion, value: String(r.id) }))];
    }, [filtersApi]);

    const eventOptions: Option[] = React.useMemo(() => {
        const list = eventsList ?? [];
        return [{ label: "Todos", value: "" }, ...list.map((e) => ({ label: e.name_event, value: String(e.id) }))];
    }, [eventsList]);

    const eventLabels = React.useMemo(() => phrasesByEvent?.labels ?? [], [phrasesByEvent]);
    const eventValues = React.useMemo(() => phrasesByEvent?.values ?? [], [phrasesByEvent]);

    const eventColors = React.useMemo(
        () => eventLabels.map((_, i) => CHART_COLORS.cabildos[i % CHART_COLORS.cabildos.length]),
        [eventLabels]
    );

    const eventsDynamicHeight = React.useMemo(() => {
        if (!isTabletOrLess) return 420;
        return Math.max(360, eventLabels.length * 34);
    }, [isTabletOrLess, eventLabels.length]);

    if (loadingFilters) return <div className="dash-loading">Cargando filtros...</div>;
    if (loading) return <div className="dash-loading">Cargando dashboard...</div>;
    if (!data) return <div className="dash-loading">No se pudo cargar la data.</div>;

    return (
        <div className="dash-container">
            <div className="fs18 fw700">
                Total: {data.totalPhrases.toLocaleString()} frases extraídas (de {data.totalVideos.toLocaleString()} videos)
            </div>

            <br />

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
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

            <div className="dash-grid">
                <Card title="Frases por Evento" scrollY maxBodyHeight={420}>
                    <div style={{ height: eventsDynamicHeight, width: "100%" }}>
                        <Bar
                            data={{ labels: eventLabels, datasets: [{ data: eventValues, backgroundColor: eventColors }] }}
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
                style={scrollY ? { maxHeight: maxBodyHeight, overflowY: "auto", overflowX: "hidden" } : undefined}
            >
                <div className="dash-chart-wrap">
                    {centerText ? <div className="dash-center-text">{centerText}</div> : null}
                    {children}
                </div>
            </div>
        </div>
    );
}
