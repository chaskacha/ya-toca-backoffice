"use client";

import React from "react";

type Option = { label: string; value: string };

export type CompareDimensionRadio = "programId" | "topicId";

export type CompareModalValueRadio = {
    dimension: CompareDimensionRadio;
    aValues: string[];
    bValues: string[];
};

type FiltersApi = {
    programs: { id: number; name_program: string }[];
    topics: { id: number; topic_name: string }[];
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

export default function CompareModalRadio({
    open,
    onClose,
    onApply,
    filtersApi,
}: {
    open: boolean;
    onClose: () => void;
    onApply: (val: CompareModalValueRadio) => void;
    filtersApi: FiltersApi | null;
}) {
    const [dimension, setDimension] = React.useState<CompareDimensionRadio>("programId");
    const [aValues, setAValues] = React.useState<string[]>([]);
    const [bValues, setBValues] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!open) return;
        setDimension("programId");
        setAValues([]);
        setBValues([]);
    }, [open]);

    if (!open) return null;

    const options: Option[] =
        dimension === "programId"
            ? (filtersApi?.programs ?? []).map((p) => ({ label: p.name_program, value: String(p.id) }))
            : [
                { label: "Sin tema", value: "null" },
                ...(filtersApi?.topics ?? []).map((t) => ({ label: t.topic_name, value: String(t.id) })),
            ];

    const onToggleA = (v: string) => {
        setAValues((prev) => uniq(toggle(prev, v)));
        setBValues((prev) => remove(prev, v));
    };

    const onToggleB = (v: string) => {
        setBValues((prev) => uniq(toggle(prev, v)));
        setAValues((prev) => remove(prev, v));
    };

    const canApply = aValues.length > 0 && bValues.length > 0;

    const title = dimension === "programId" ? "Comparar programas" : "Comparar topics";

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

                <div style={{ height: 14 }} />

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <button
                        onClick={() => {
                            setDimension("programId");
                            setAValues([]);
                            setBValues([]);
                        }}
                        style={{
                            height: 38,
                            padding: "0 12px",
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,.2)",
                            background: dimension === "programId" ? "#fff" : "transparent",
                            color: dimension === "programId" ? "#000" : "#fff",
                            cursor: "pointer",
                            fontWeight: 800,
                        }}
                    >
                        Programas
                    </button>

                    <button
                        onClick={() => {
                            setDimension("topicId");
                            setAValues([]);
                            setBValues([]);
                        }}
                        style={{
                            height: 38,
                            padding: "0 12px",
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,.2)",
                            background: dimension === "topicId" ? "#fff" : "transparent",
                            color: dimension === "topicId" ? "#000" : "#fff",
                            cursor: "pointer",
                            fontWeight: 800,
                        }}
                    >
                        Topics
                    </button>

                    <div style={{ opacity: 0.8, fontSize: 13 }}>
                        Selecciona items para A y B (no pueden repetirse).
                    </div>
                </div>

                <div style={{ height: 16 }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Column title="Selección 1 (A)" options={options} values={aValues} onToggle={onToggleA} />
                    <Column title="Selección 2 (B)" options={options} values={bValues} onToggle={onToggleB} />
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
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10, fontWeight: 800 }}>{title}</div>

            {options.length === 0 ? (
                <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)" }}>
                    No hay opciones disponibles.
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
                                        fontWeight: 800,
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
