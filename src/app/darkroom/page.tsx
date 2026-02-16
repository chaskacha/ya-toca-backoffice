'use client';

import React from "react";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";
import "./styles.css";
import DarkRoomDashboard from "@/components/darkroom/DarkRoomDashboard";
import DarkRoomResponsesTable from "@/components/darkroom/DarkRoomResponsesTable";
import Filter from "@/components/basic/filter/Filter";

type Option = { label: string; value: string };

export type DarkRoomFiltersState = {
    questionId: string;
    optionId: string;
    age: string;
    gender: string;
};

type FiltersApi = {
    questions: { id: number; text: string; sort_order?: number }[];
    optionsByQuestion: Record<number, { id: number; question_id: number; text: string; sort_order?: number }[]>;
    ageGroups: string[];
    genders: string[];
};

const DEFAULT_FILTERS: DarkRoomFiltersState = {
    questionId: "",
    optionId: "",
    age: "",
    gender: "",
};

export default function DarkRoom() {
    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    const [filters, setFilters] = React.useState<DarkRoomFiltersState>(DEFAULT_FILTERS);

    // Load filters once (questions/options/age/gender)
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

    const questionOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.questions ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((q) => ({ label: q.text, value: String(q.id) }))];
    }, [filtersApi]);

    const optionOptions: Option[] = React.useMemo(() => {
        const qid = filters.questionId && /^\d+$/.test(filters.questionId) ? Number(filters.questionId) : null;
        if (!qid || !filtersApi?.optionsByQuestion?.[qid]) return [{ label: "Todas", value: "" }];
        const list = filtersApi.optionsByQuestion[qid] ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((o) => ({ label: o.text, value: String(o.id) }))];
    }, [filtersApi, filters.questionId]);

    // If your API provides ageGroups/genders, use them; otherwise keep your fixed list
    const ageOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.ageGroups?.length
            ? filtersApi.ageGroups
            : ["16-29", "30-45", "46+", "No especifica"];
        return [{ label: "Todas", value: "" }, ...list.map((x) => ({ label: x, value: x }))];
    }, [filtersApi]);

    const genderOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.genders?.length
            ? filtersApi.genders
            : ["Femenino", "Masculino", "Prefiero no indicar", "No especifica"];
        return [{ label: "Todos", value: "" }, ...list.map((x) => ({ label: x, value: x }))];
    }, [filtersApi]);

    return (
        <Wrapper>
            <div className="admin-darkroom">
                <SafeArea mv={32}>
                    <>
                        {/* ✅ Shared filters bar (ONE place) */}
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                            <Filter
                                label="Pregunta"
                                value={filters.questionId}
                                onChange={(v) =>
                                    setFilters((p) => ({
                                        ...p,
                                        questionId: v,
                                        optionId: "", // reset dependent option
                                    }))
                                }
                                options={questionOptions}
                            />

                            <Filter
                                label="Opción"
                                value={filters.optionId}
                                onChange={(v) => setFilters((p) => ({ ...p, optionId: v }))}
                                options={optionOptions}
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

                        {loadingFilters ? (
                            <div className="dash-loading" style={{ marginTop: 10 }}>
                                Cargando filtros...
                            </div>
                        ) : null}

                        <br />

                        <DarkRoomDashboard filters={filters} loadingFilters={loadingFilters} />
                        <br />
                        <DarkRoomResponsesTable filters={filters} loadingFilters={loadingFilters} />
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
