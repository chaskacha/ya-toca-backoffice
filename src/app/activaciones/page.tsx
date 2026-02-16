'use client';

import React from "react";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";
import "./styles.css";
import MuralsDashboard from "@/components/murals/MuralsDashboard";
import MuralsPhrasesTable from "@/components/murals/MuralsPhrasesTable";
import Filter from "@/components/basic/filter/Filter";

type Option = { label: string; value: string };

type FiltersApi = {
    regions: { id: number; nombreregion: string }[];
    events: { id: number; name_event: string; date_event: string; region_name?: string | null }[]; // may exist but we will not rely on it
};

type EventItem = {
    id: number;
    name_event: string;
    date_event: string;
    region_name?: string | null;
};

export type MuralsFiltersState = {
    regionId: string;
    eventId: string;
};

const DEFAULT_FILTERS: MuralsFiltersState = { regionId: "", eventId: "" };

export default function Murals() {
    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    const [filters, setFilters] = React.useState<MuralsFiltersState>(DEFAULT_FILTERS);

    // events options DEPEND on regionId (server-side)
    const [eventsList, setEventsList] = React.useState<EventItem[]>([]);
    const [loadingEvents, setLoadingEvents] = React.useState(false);

    // Load base filters once (regions list, etc.)
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

    // Load events whenever regionId changes (exactly like you had)
    React.useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoadingEvents(true);

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
            } finally {
                setLoadingEvents(false);
            }
        };

        loadEvents();
    }, [filters.regionId]);

    const regionOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.regions ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((r) => ({ label: r.nombreregion, value: String(r.id) }))];
    }, [filtersApi]);

    const eventOptions: Option[] = React.useMemo(() => {
        const list = eventsList ?? [];
        return [{ label: "Todos", value: "" }, ...list.map((e) => ({ label: e.name_event, value: String(e.id) }))];
    }, [eventsList]);

    const isLoadingTop = loadingFilters || loadingEvents;

    return (
        <Wrapper>
            <div className="admin-murals">
                <SafeArea mv={32}>
                    <>
                        {/* ONE filters bar */}
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                            <Filter
                                label="Región"
                                value={filters.regionId}
                                onChange={(v) => setFilters((p) => ({ ...p, regionId: v, eventId: "" }))} // reset event on region change
                                options={regionOptions}
                            />

                            <Filter
                                label="Evento"
                                value={filters.eventId}
                                onChange={(v) => setFilters((p) => ({ ...p, eventId: v }))}
                                options={eventOptions}
                            />

                            <button
                                onClick={() => setFilters(DEFAULT_FILTERS)}
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

                        {isLoadingTop ? (
                            <div className="dash-loading" style={{ marginTop: 10 }}>
                                Cargando filtros...
                            </div>
                        ) : null}

                        <br />

                        <MuralsDashboard filters={filters} />
                        <br />
                        <MuralsPhrasesTable filters={filters} />
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
