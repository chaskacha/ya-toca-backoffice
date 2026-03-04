"use client";

import React from "react";

type Option = { label: string; value: string };

export type CompareDimension = "eventId" | "regionId" | "activityId";

export type CompareModalValue = {
    dimension: CompareDimension;
    aValues: string[];
    bValues: string[];
};

function uniq(arr: string[]) {
    return Array.from(new Set(arr));
}
function toggle(list: string[], v: string) {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}
function remove(list: string[], v: string) {
    return list.filter((x) => x !== v);
}

type FiltersApi = {
    regions: { id: number; nombreregion: string }[];
    events: { id: number; name: string }[];
    activities: { id: number; name_event: string }[];
};

export default function CompareModal({
    open,
    onClose,
    onApply,
    filtersApi,
}: {
    open: boolean;
    onClose: () => void;
    onApply: (val: CompareModalValue) => void;
    filtersApi: FiltersApi | null;
}) {
    console.log(filtersApi);
    const [dimension, setDimension] = React.useState<CompareDimension>("eventId");
    const [aValues, setAValues] = React.useState<string[]>([]);
    const [bValues, setBValues] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!open) return;
        setDimension("eventId");
        setAValues([]);
        setBValues([]);
    }, [open]);

    React.useEffect(() => {
        // reset selections when dimension changes
        setAValues([]);
        setBValues([]);
    }, [dimension]);

    if (!open) return null;

    const options: Option[] = (() => {
        if (!filtersApi) return [];
        if (dimension === "eventId") return (filtersApi.events ?? []).map((e) => ({ label: e.name, value: String(e.id) }));
        if (dimension === "regionId") return (filtersApi.regions ?? []).map((r) => ({ label: r.nombreregion, value: String(r.id) }));
        return (filtersApi.activities ?? []).map((a) => ({ label: a.name_event, value: String(a.id) }));
    })();

    const onToggleA = (v: string) => {
        setAValues((prev) => uniq(toggle(prev, v)));
        setBValues((prev) => remove(prev, v));
    };

    const onToggleB = (v: string) => {
        setBValues((prev) => uniq(toggle(prev, v)));
        setAValues((prev) => remove(prev, v));
    };

    const canApply = aValues.length > 0 && bValues.length > 0;

    const title =
        dimension === "eventId" ? "Comparar eventos" : dimension === "regionId" ? "Comparar regiones" : "Comparar actividades";

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.55)",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    width: "min(920px, 100%)",
                    background: "#2f2f2f",
                    borderRadius: 16,
                    padding: 18,
                    color: "#fff",
                    boxShadow: "0 8px 30px rgba(0,0,0,.35)",
                    maxHeight: "80vh",
                    minHeight: "80vh",
                    overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,.2)",
                            background: "transparent",
                            color: "#fff",
                            fontSize: 18,
                            cursor: "pointer",
                        }}
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div style={{ height: 12 }} />

                {/* dimension selector */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <DimButton active={dimension === "eventId"} onClick={() => setDimension("eventId")} label="Eventos" />
                    <DimButton active={dimension === "regionId"} onClick={() => setDimension("regionId")} label="Regiones" />
                    <DimButton active={dimension === "activityId"} onClick={() => setDimension("activityId")} label="Actividades" />
                </div>

                <div style={{ height: 16 }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Column title="Selección 1" options={options} values={aValues} onToggle={onToggleA} />
                    <Column title="Selección 2" options={options} values={bValues} onToggle={onToggleB} />
                </div>

                <div style={{ height: 18 }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <button
                        onClick={() => onApply({ dimension, aValues, bValues })}
                        disabled={!canApply}
                        style={{
                            height: 46,
                            borderRadius: 12,
                            border: "1px solid rgba(0,0,0,.4)",
                            background: canApply ? "#000" : "#222",
                            color: "#fff",
                            fontSize: 16,
                            cursor: canApply ? "pointer" : "not-allowed",
                            fontWeight: 800,
                        }}
                    >
                        Aplicar
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            height: 46,
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,.2)",
                            background: "transparent",
                            color: "#fff",
                            fontSize: 16,
                            cursor: "pointer",
                            fontWeight: 800,
                        }}
                    >
                        Cancelar
                    </button>
                </div>

                {!filtersApi ? (
                    <div style={{ marginTop: 14, opacity: 0.9, fontSize: 12 }}>
                        ⚠️ <b>filtersApi</b> es null. Debes pasar <b>regions/events/activities</b> desde{" "}
                        <code>/api/murals/phrases/filters</code>.
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function DimButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            style={{
                height: 34,
                padding: "0 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.25)",
                background: active ? "#fff" : "rgba(255,255,255,.08)",
                color: active ? "#000" : "#fff",
                cursor: "pointer",
                fontWeight: 800,
            }}
        >
            {label}
        </button>
    );
}

function Column({
    title,
    options,
    values,
    onToggle,
}: {
    title: string;
    options: Option[];
    values: string[];
    onToggle: (v: string) => void;
}) {
    return (
        <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>{title}</div>

            {options.length === 0 ? (
                <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)" }}>
                    No hay opciones disponibles para esta dimensión.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {options.map((o) => {
                        const checked = values.includes(o.value);
                        return (
                            <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                <input type="checkbox" checked={checked} onChange={() => onToggle(o.value)} style={{ width: 18, height: 18 }} />
                                <span
                                    style={{
                                        display: "inline-block",
                                        padding: "8px 12px",
                                        borderRadius: 10,
                                        background: checked ? "#fff" : "#666",
                                        color: checked ? "#000" : "#222",
                                        minWidth: 160,
                                    }}
                                >
                                    {o.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}