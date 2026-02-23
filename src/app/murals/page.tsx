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
    events: { id: number; name: string; id_region: number; region_name?: string | null }[];
};

type EventItem = { id: number; name: string; id_region: number; region_name?: string | null };
type ActivityItem = { id: number; name_event: string; date_event: string | null; id_event: number; event_name?: string | null };

export type MuralsFiltersState = {
    regionId: string;
    eventId: string;
    activityId: string;
};

const DEFAULT_FILTERS: MuralsFiltersState = { regionId: "", eventId: "", activityId: "" };

export default function Murals() {
    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    const [filters, setFilters] = React.useState<MuralsFiltersState>(DEFAULT_FILTERS);

    // Events (depend on regionId)
    const [eventsList, setEventsList] = React.useState<EventItem[]>([]);
    const [loadingEvents, setLoadingEvents] = React.useState(false);

    // Activities (depend on regionId + eventId)
    const [activitiesList, setActivitiesList] = React.useState<ActivityItem[]>([]);
    const [loadingActivities, setLoadingActivities] = React.useState(false);

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

    React.useEffect(() => {
        const loadActivities = async () => {
            try {
                setLoadingActivities(true);

                const params = new URLSearchParams();
                if (filters.regionId) params.set("regionId", filters.regionId);
                if (filters.eventId) params.set("eventId", filters.eventId);

                const url = params.toString()
                    ? `/api/murals/activities/list?${params.toString()}`
                    : `/api/murals/activities/list`;

                const res = await fetch(url);
                const json = await res.json();
                setActivitiesList(json?.activities ?? []);
            } catch (e) {
                console.error("Failed to load activities list", e);
                setActivitiesList([]);
            } finally {
                setLoadingActivities(false);
            }
        };

        loadActivities();
    }, [filters.regionId, filters.eventId]);

    const regionOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.regions ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((r) => ({ label: r.nombreregion, value: String(r.id) }))];
    }, [filtersApi]);

    const eventOptions: Option[] = React.useMemo(() => {
        const list = eventsList ?? [];
        return [{ label: "Todos", value: "" }, ...list.map((e) => ({ label: e.name, value: String(e.id) }))];
    }, [eventsList]);

    const activityOptions: Option[] = React.useMemo(() => {
        const list = activitiesList ?? [];
        return [
            { label: "Todas", value: "" },
            ...list.map((a) => ({
                label: `${a.name_event}`,
                value: String(a.id),
            })),
        ];
    }, [activitiesList]);

    const isLoadingTop = loadingFilters || loadingEvents || loadingActivities;

    return (
        <Wrapper>
            <div className="admin-murals">
                <SafeArea mv={32}>
                    <>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                            <Filter
                                label="Región"
                                value={filters.regionId}
                                onChange={(v) => setFilters((p) => ({ ...p, regionId: v, eventId: "", activityId: "" }))}
                                options={regionOptions}
                                disabled={!!(filters.activityId || filters.eventId)}
                            />

                            <Filter
                                label="Evento"
                                value={filters.eventId}
                                onChange={(v) => setFilters((p) => ({ ...p, eventId: v, activityId: "" }))}
                                options={eventOptions}
                                disabled={!!(filters.activityId)}
                            />

                            <Filter
                                label="Actividad"
                                value={filters.activityId}
                                onChange={(v) => setFilters((p) => ({ ...p, activityId: v }))}
                                options={activityOptions}
                            />

                            <button
                                onClick={() => setFilters(DEFAULT_FILTERS)}
                                style={{ height: 40, padding: "0 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
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