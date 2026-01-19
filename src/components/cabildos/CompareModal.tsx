'use client';

import React from "react";

type Option = { label: string; value: string };

export type CompareDimension =
    | "age_group"
    | "region"
    | "genero"
    | "nivelinstruccion"
    | "grupoetnico"
    | "cabildoId"
    | "stationId";

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

export default function CompareModal({
    open,
    onClose,
    onApply,
    filtersApi,
}: {
    open: boolean;
    onClose: () => void;
    onApply: (val: CompareModalValue) => void;
    filtersApi: {
        regions: string[];
        genders: string[];
        ageGroups: string[];
        nivelesInstruccion: string[];
        gruposEtnicos: string[];
        estaciones: { id: number; nombre: string }[];
        cabildos: { id: number; nombre: string }[];
    } | null;
}) {
    const [dimension, setDimension] = React.useState<CompareDimension>("age_group");
    const [aValues, setAValues] = React.useState<string[]>([]);
    const [bValues, setBValues] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!open) return;
        // reset each time modal opens (optional)
        setDimension("age_group");
        setAValues([]);
        setBValues([]);
    }, [open]);

    if (!open) return null;

    const getOptions = (): Option[] => {
        if (!filtersApi) return [];

        switch (dimension) {
            case "age_group":
                return filtersApi.ageGroups.map((x) => ({ label: x, value: x }));
            case "region":
                return filtersApi.regions.map((x) => ({ label: x, value: x }));
            case "genero":
                return filtersApi.genders.map((x) => ({ label: x, value: x }));
            case "nivelinstruccion":
                return filtersApi.nivelesInstruccion.map((x) => ({ label: x, value: x }));
            case "grupoetnico":
                return filtersApi.gruposEtnicos.map((x) => ({ label: x, value: x }));
            case "cabildoId":
                return filtersApi.cabildos.map((c) => ({ label: c.nombre, value: String(c.id) }));
            case "stationId":
                return filtersApi.estaciones.map((s) => ({ label: s.nombre, value: String(s.id) }));
            default:
                return [];
        }
    };

    const options = getOptions();

    const canApply = aValues.length > 0 && bValues.length > 0;

    const labelForDim: Record<CompareDimension, string> = {
        age_group: "Grupo de edad",
        region: "Región",
        genero: "Género",
        nivelinstruccion: "Nivel de instrucción",
        grupoetnico: "Grupo étnico",
        cabildoId: "Cabildo",
        stationId: "Estación",
    };

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
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                        Selecciona las etiquetas que quieras comparar
                    </div>
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

                <div style={{ height: 14 }} />

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ opacity: 0.9 }}>Comparar por:</div>

                    <select
                        value={dimension}
                        onChange={(e) => {
                            const d = e.target.value as CompareDimension;
                            setDimension(d);
                            setAValues([]);
                            setBValues([]);
                        }}
                        style={{
                            height: 40,
                            padding: "0 10px",
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,.2)",
                            background: "#3a3a3a",
                            color: "#fff",
                            outline: "none",
                        }}
                    >
                        {Object.entries(labelForDim).map(([k, label]) => (
                            <option key={k} value={k}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ height: 16 }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Column
                        title="Selección 1"
                        options={options}
                        values={aValues}
                        onToggle={(v) => setAValues((p) => uniq(toggle(p, v)))}
                    />
                    <Column
                        title="Selección 2"
                        options={options}
                        values={bValues}
                        onToggle={(v) => setBValues((p) => uniq(toggle(p, v)))}
                    />
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
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
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

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {options.map((o) => {
                    const checked = values.includes(o.value);
                    return (
                        <label
                            key={o.value}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                cursor: "pointer",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => onToggle(o.value)}
                                style={{ width: 18, height: 18 }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    padding: "8px 12px",
                                    borderRadius: 10,
                                    background: checked ? "#fff" : "#666",
                                    color: checked ? "#000" : "#222",
                                    minWidth: 120,
                                }}
                            >
                                {o.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
