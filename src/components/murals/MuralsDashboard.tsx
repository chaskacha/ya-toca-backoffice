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

type Option = { label: string; value: string };

type FiltersApi = {
    regions: { id: number; nombreregion: string }[];
    events: { id: number; name_event: string; date_event: string; region_name?: string | null }[];
};

type ApiResponse = {
    totalPhrases: number;
    breakdown: {
        regions: Breakdown;
        events: Breakdown; // label = "Evento — YYYY-MM-DD"
    };
    filters?: {
        regions?: string[];
    };
};

type EventItem = {
    id: number;
    name_event: string;
    date_event: string; // YYYY-MM-DD
    region_name?: string | null;
};

function toChartData(obj: Breakdown) {
    const labels = Object.keys(obj);
    const values = Object.values(obj);
    return { labels, values };
}

export default function MuralsDashboard({ filters }: { filters: { regionId: string; eventId: string } }) {
    const [data, setData] = React.useState<ApiResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const [eventsList, setEventsList] = React.useState<EventItem[]>([]);

    const isTabletOrLess = useMediaQuery("(max-width: 1024px)");

    // Load filters once
    React.useEffect(() => {
        const run = async () => {
            try {
                setLoadingFilters(true);
                const res = await fetch("/api/murals/phrases/filters");
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

    // Load events (can be filtered by regionId)
    React.useEffect(() => {
        const loadEvents = async () => {
            try {
                const params = new URLSearchParams();
                if (filters.regionId) params.set("regionId", filters.regionId);
                const url = params.toString()
                    ? `/api/murals/events/list?${params.toString()}`
                    : `/api/murals/events/list`;

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
        return qs ? `/api/murals/dashboard?${qs}` : `/api/murals/dashboard`;
    }, [filters.regionId, filters.eventId]);

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

    const phrasesByEvent = React.useMemo(() => (data ? toChartData(data.breakdown.events) : null), [data]);

    const eventLabels = React.useMemo(() => phrasesByEvent?.labels ?? [], [phrasesByEvent]);
    const eventValues = React.useMemo(() => phrasesByEvent?.values ?? [], [phrasesByEvent]);

    if (loadingFilters) return <div className="dash-loading">Cargando filtros...</div>;
    if (loading) return <div className="dash-loading">Cargando dashboard...</div>;
    if (!data) return <div className="dash-loading">No se pudo cargar la data.</div>;

    return (
        <div className="dash-container">
            <div className="fs18 fw700">
                Total: {data.totalPhrases.toLocaleString()} Frases extraídas
            </div>

            <br />

            <div className="dash-grid">
                <Card title="Frases por Evento" scrollY maxBodyHeight={420}>
                    {(() => {
                        const rows = (eventLabels ?? []).map((label, i) => ({
                            evento: label,
                            frases: Number(eventValues?.[i] ?? 0),
                        }));

                        const total = rows.reduce((a, r) => a + r.frases, 0) || 1;

                        // optional: sort desc by count
                        rows.sort((a, b) => b.frases - a.frases);

                        return (
                            <div style={{ width: "100%", overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                    <thead>
                                        <tr style={{ textAlign: "left" }}>
                                            <th style={{ padding: "10px 8px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                                                Evento
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px 8px",
                                                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                                                    textAlign: "right",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                Frases
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px 8px",
                                                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                                                    textAlign: "right",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                %
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {rows.map((r) => {
                                            const pct = ((r.frases / total) * 100).toFixed(1);
                                            return (
                                                <tr key={r.evento}>
                                                    <td style={{ padding: "8px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                                        {r.evento}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "8px",
                                                            borderBottom: "1px solid rgba(0,0,0,0.06)",
                                                            textAlign: "right",
                                                            fontVariantNumeric: "tabular-nums",
                                                        }}
                                                    >
                                                        {r.frases}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "8px",
                                                            borderBottom: "1px solid rgba(0,0,0,0.06)",
                                                            textAlign: "right",
                                                            fontVariantNumeric: "tabular-nums",
                                                            whiteSpace: "nowrap",
                                                            opacity: 0.85,
                                                        }}
                                                    >
                                                        {pct}%
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                    <tfoot>
                                        <tr>
                                            <td style={{ padding: "10px 8px", fontWeight: 700 }}>Total</td>
                                            <td style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700 }}>
                                                {rows.reduce((a, r) => a + r.frases, 0)}
                                            </td>
                                            <td style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700 }}>100%</td>
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
