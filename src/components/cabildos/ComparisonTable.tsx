'use client';

import React from "react";

type MethodSource = { title: string; url: string };

export type CompareResult = {
    summary?: string;
    per_station?: Array<{
        stationId: number;
        stationName: string;
        cohortA_tendencies: string[];
        cohortB_tendencies: string[];
        key_differences: string[];
        possible_reasons_hypotheses: string[];
        evidence?: {
            cohortA_examples: string[];
            cohortB_examples: string[];
        };
    }>;
    methodology_sources?: MethodSource[];
    limitations?: string[];
};

export default function ComparisonTable({
    data,
    cohortA_label,
    cohortB_label,
}: {
    data: CompareResult;
    cohortA_label: string;
    cohortB_label: string;
}) {
    const per = data?.per_station ?? [];

    return (
        <div style={{ marginTop: 16, maxWidth: '90vw', overflowX: 'auto', paddingBottom: 380 }}>
            {data?.summary ? (
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: 14 }}>
                    <div className="fs16 fw700">Resumen</div>
                    <div style={{ marginTop: 8, lineHeight: 1.4, color: "#333" }}>{data.summary}</div>
                </div>
            ) : null}

            <div style={{ height: 14 }} />

            <div
                style={{
                    width: "100%",
                    overflowX: "auto",
                    border: "1px solid #eee",
                    borderRadius: 12,
                    background: "#fff",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                textAlign: "left",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            <th style={{ padding: 12, whiteSpace: "nowrap", minWidth: 160, position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                                Estación
                            </th>
                            <th style={{ padding: 12, minWidth: 260, position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                                {cohortA_label}
                            </th>
                            <th style={{ padding: 12, minWidth: 260, position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                                {cohortB_label}
                            </th>
                            <th style={{ padding: 12, minWidth: 260, position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                                Diferencias clave
                            </th>
                            <th style={{ padding: 12, minWidth: 320, position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                                Hipótesis (posibles razones)
                            </th>
                            <th style={{ padding: 12, minWidth: 520, position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                                Evidencia (ejemplos)
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {per.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0", verticalAlign: "top" }}>
                                <td style={{ padding: 12, whiteSpace: "nowrap", fontWeight: 700, minWidth: 160 }}>
                                    {row.stationName}
                                </td>

                                <td style={{ padding: 12, minWidth: 260 }}>
                                    <Bullets items={row.cohortA_tendencies} />
                                </td>

                                <td style={{ padding: 12, minWidth: 260 }}>
                                    <Bullets items={row.cohortB_tendencies} />
                                </td>

                                <td style={{ padding: 12, minWidth: 260 }}>
                                    <Bullets items={row.key_differences} />
                                </td>

                                <td style={{ padding: 12, minWidth: 320 }}>
                                    <Bullets items={row.possible_reasons_hypotheses} />
                                </td>

                                <td style={{ padding: 12, minWidth: 520 }}>
                                    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>A</div>
                                    <Quotes items={row.evidence?.cohortA_examples ?? []} />
                                    <div style={{ height: 10 }} />
                                    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>B</div>
                                    <Quotes items={row.evidence?.cohortB_examples ?? []} />
                                </td>
                            </tr>
                        ))}

                        {per.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: 16, color: "#777" }}>
                                    No se pudo construir una comparación (sin resultados).
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>


            <div style={{ height: 14 }} />

            {data?.methodology_sources?.length ? (
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: 14 }}>
                    <div className="fs16 fw700">Fuentes (metodología)</div>
                    <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                        {data.methodology_sources.map((s, i) => (
                            <li key={i} style={{ marginBottom: 6, color: "#333" }}>
                                <span style={{ fontWeight: 600 }}>{s.title}</span>
                                <div style={{ fontSize: 12, color: "#666", wordBreak: "break-all" }}>{s.url}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {data?.limitations?.length ? (
                <div style={{ height: 14 }} />
            ) : null}

            {data?.limitations?.length ? (
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: 14 }}>
                    <div className="fs16 fw700">Limitaciones</div>
                    <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                        {data.limitations.map((x, i) => (
                            <li key={i} style={{ marginBottom: 6, color: "#333" }}>
                                {x}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
}

function Bullets({ items }: { items: string[] }) {
    if (!items?.length) return <div style={{ color: "#888" }}>—</div>;
    return (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
            {items.map((x, i) => (
                <li key={i} style={{ marginBottom: 6, lineHeight: 1.35 }}>
                    {x}
                </li>
            ))}
        </ul>
    );
}

function Quotes({ items }: { items: string[] }) {
    if (!items?.length) return <div style={{ color: "#888" }}>—</div>;
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.slice(0, 4).map((q, i) => (
                <div
                    key={i}
                    style={{
                        background: "#fafafa",
                        border: "1px solid #eee",
                        borderRadius: 10,
                        padding: 10,
                        lineHeight: 1.35,
                        color: "#333",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                    }}
                >
                    “{q}”
                </div>
            ))}
        </div>
    );
}
