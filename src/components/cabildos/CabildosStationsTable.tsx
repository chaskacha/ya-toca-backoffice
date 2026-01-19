'use client';

import React from "react";
import Filter from "../basic/filter/Filter";
import CompareModal, { CompareModalValue } from "@/components/cabildos/CompareModal";
import { useRouter } from "next/navigation";

type Option = { label: string; value: string };

type FiltersApi = {
    regions: string[];
    genders: string[];
    ageGroups: string[];
    nivelesInstruccion: string[];
    gruposEtnicos: string[];
    estaciones: { id: number; nombre: string }[];
    cabildos: { id: number; nombre: string }[];
};

type Row = {
    fecha: string;
    cabildo: string;
    telefono: string;
    region: string;
    genero: string;
    age_group: string;
    nivelinstruccion: string;
    grupoetnico: string;
    idestacion: number;
    estacion: string;
    comentario: string;
};

export default function CabildosStationsTable() {
    const [filtersApi, setFiltersApi] = React.useState<FiltersApi | null>(null);
    const [loadingFilters, setLoadingFilters] = React.useState(true);
    const router = useRouter();
    const [compareOpen, setCompareOpen] = React.useState(false);

    const [filters, setFilters] = React.useState({
        cabildoId: "",
        region: "",
        age: "",
        gender: "",
        nivelinstruccion: "",
        grupoetnico: "",
        stationId: "",
    });

    const [loading, setLoading] = React.useState(true);
    const [rows, setRows] = React.useState<Row[]>([]);
    console.log(rows);
    const [total, setTotal] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const pageSize = 20;

    // Load filter options once
    React.useEffect(() => {
        const run = async () => {
            try {
                setLoadingFilters(true);
                const res = await fetch("/api/cabildos/stations/filters");
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
        if (filters.cabildoId) params.set("cabildoId", filters.cabildoId);
        if (filters.region) params.set("region", filters.region);
        if (filters.age) params.set("age", filters.age);
        if (filters.gender) params.set("gender", filters.gender);
        if (filters.nivelinstruccion) params.set("nivelinstruccion", filters.nivelinstruccion);
        if (filters.grupoetnico) params.set("grupoetnico", filters.grupoetnico);
        if (filters.stationId) params.set("stationId", filters.stationId);
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        return `/api/cabildos/stations/comments?${params.toString()}`;
    }, [filters, page]);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setPage(1);
    }, [
        filters.cabildoId,
        filters.region,
        filters.age,
        filters.gender,
        filters.nivelinstruccion,
        filters.grupoetnico,
        filters.stationId,
    ]);

    // Load rows when filters/page change
    React.useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const res = await fetch(buildUrl());
                const json = await res.json();
                setRows(json?.rows ?? []);
                setTotal(json?.total ?? 0);
            } catch (e) {
                console.error(e);
                setRows([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [buildUrl]);

    const cabildoOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.cabildos ?? [];
        return [{ label: "Todos", value: "" }, ...list.map((c) => ({ label: c.nombre, value: String(c.id) }))];
    }, [filtersApi]);

    const stationOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.estaciones ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((s) => ({ label: s.nombre, value: String(s.id) }))];
    }, [filtersApi]);

    const regionOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.regions ?? [];
        return [{ label: "Todas", value: "" }, ...list.map((r) => ({ label: r, value: r }))];
    }, [filtersApi]);

    const ageOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.ageGroups ?? ["16-29", "30-45", "46+", "No especifica"];
        return [{ label: "Todas", value: "" }, ...list.map((a) => ({ label: a, value: a }))];
    }, [filtersApi]);

    const genderOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.genders ?? ["Femenino", "Masculino", "Prefiero no indicar", "No especifica"];
        return [{ label: "Todos", value: "" }, ...list.map((g) => ({ label: g, value: g }))];
    }, [filtersApi]);

    const nivelOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.nivelesInstruccion ?? [];
        return [{ label: "Todos", value: "" }, ...list.map((n) => ({ label: n, value: n }))];
    }, [filtersApi]);

    const etnicoOptions: Option[] = React.useMemo(() => {
        const list = filtersApi?.gruposEtnicos ?? [];
        return [{ label: "Todos", value: "" }, ...list.map((e) => ({ label: e, value: e }))];
    }, [filtersApi]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div style={{ marginTop: 28 }}>
            <div className="fs18 fw700">Comentarios por Estación</div>
            <div style={{ height: 10 }} />

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                <Filter label="Cabildo" value={filters.cabildoId} onChange={(v) => setFilters((p) => ({ ...p, cabildoId: v }))} options={cabildoOptions} />
                <Filter label="Estación" value={filters.stationId} onChange={(v) => setFilters((p) => ({ ...p, stationId: v }))} options={stationOptions} />
                <Filter label="Edad" value={filters.age} onChange={(v) => setFilters((p) => ({ ...p, age: v }))} options={ageOptions} />
                <Filter label="Género" value={filters.gender} onChange={(v) => setFilters((p) => ({ ...p, gender: v }))} options={genderOptions} />
                <Filter label="Región" value={filters.region} onChange={(v) => setFilters((p) => ({ ...p, region: v }))} options={regionOptions} />
                <Filter label="Nivel" value={filters.nivelinstruccion} onChange={(v) => setFilters((p) => ({ ...p, nivelinstruccion: v }))} options={nivelOptions} />
                <Filter label="Grupo étnico" value={filters.grupoetnico} onChange={(v) => setFilters((p) => ({ ...p, grupoetnico: v }))} options={etnicoOptions} />

                <button
                    onClick={() =>
                        setFilters({
                            cabildoId: "",
                            region: "",
                            age: "",
                            gender: "",
                            nivelinstruccion: "",
                            grupoetnico: "",
                            stationId: "",
                        })
                    }
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
                <button
                    onClick={() => setCompareOpen(true)}
                    style={{
                        height: 40,
                        padding: "0 12px",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        background: "#000",
                        color: "#fff",
                    }}
                >
                    Comparar
                </button>
            </div>

            <div style={{ height: 14 }} />

            {loadingFilters ? (
                <div className="dash-loading">Cargando filtros...</div>
            ) : null}

            {loading ? (
                <div className="dash-loading">Cargando comentarios...</div>
            ) : (
                <div style={{ width: "100%", overflowX: "auto", border: "1px solid #000", borderRadius: 12, background: "#fff" }}>
                    <div style={{ color: "#666", padding: 12 }}>
                        {total.toLocaleString()} resultados
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                        <thead>
                            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                                <th style={{ padding: 12 }}>Fecha</th>
                                <th style={{ padding: 12 }}>Cabildo</th>
                                <th style={{ padding: 12 }}>Región</th>
                                <th style={{ padding: 12 }}>Género</th>
                                <th style={{ padding: 12 }}>Edad</th>
                                <th style={{ padding: 12 }}>Nivel</th>
                                <th style={{ padding: 12 }}>Grupo étnico</th>
                                <th style={{ padding: 12 }}>Estación</th>
                                <th style={{ padding: 12 }}>Comentario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, idx) => (
                                <tr key={idx} style={{ borderBottom: "1px solid #000" }}>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{String(r.fecha).slice(0, 10)}</td>
                                    <td style={{ padding: 12 }}>{r.cabildo}</td>
                                    <td style={{ padding: 12 }}>{r.region}</td>
                                    <td style={{ padding: 12 }}>{r.genero === "Masculino" ? "M" : r.genero === "Femenino" ? "F" : "N"}</td>
                                    <td style={{ padding: 12 }}>{r.age_group}</td>
                                    <td style={{ padding: 12 }}>{r.nivelinstruccion}</td>
                                    <td style={{ padding: 12, }}>{r.grupoetnico}</td>
                                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{r.idestacion === 14
                                        ? "E1"
                                        : r.idestacion === 11
                                            ? "E2"
                                            : r.idestacion === 12
                                                ? "E3"
                                                : r.idestacion === 13
                                                    ? "E4"
                                                    : "N"}</td>
                                    <td style={{ padding: 12, minWidth: 520, maxWidth: 720 }}>
                                        <div
                                            style={{
                                                whiteSpace: "normal",
                                                wordBreak: "break-word",
                                                overflowWrap: "anywhere",
                                                lineHeight: 1.35,
                                            }}
                                        >
                                            {r.comentario}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={9} style={{ padding: 16, color: "#777" }}>
                                        No hay resultados con los filtros seleccionados.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>

                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        style={{ height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
                    >
                        Anterior
                    </button>
                    <div style={{ minWidth: 120, textAlign: "center" }}>
                        Página {page} / {totalPages}
                    </div>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        style={{ height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            <CompareModal
                open={compareOpen}
                onClose={() => setCompareOpen(false)}
                filtersApi={filtersApi}
                onApply={(val: CompareModalValue) => {
                    setCompareOpen(false);

                    // Build URL to new page
                    const params = new URLSearchParams();
                    params.set("dimension", val.dimension);

                    val.aValues.forEach((x) => params.append("a", x));
                    val.bValues.forEach((x) => params.append("b", x));

                    router.push(`/cabildos/compare?${params.toString()}`);
                }}
            />
        </div>
    );
}
