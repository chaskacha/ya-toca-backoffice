'use client';

import React from "react";

type MethodSource = { title: string; url: string };

export type RadioCompareItem = {
    id: number;
    name: string;

    cohortA_tendencies: string[];
    cohortB_tendencies: string[];
    key_differences: string[];
    possible_reasons_hypotheses: string[];

    evidence?: {
        cohortA_examples: string[];
        cohortB_examples: string[];
    };
};

export type RadioCompareResult = {
    summary?: string;
    per_program?: RadioCompareItem[];
    per_topic?: RadioCompareItem[];
    methodology_sources?: MethodSource[];
    limitations?: string[];
};

export default function RadioComparisonTable({
    data,
    cohortA_label,
    cohortB_label,
    dimensionLabel = "Programa",
}: {
    data: RadioCompareResult;
    cohortA_label: string;
    cohortB_label: string;
    dimensionLabel?: string;
}) {
    const per: RadioCompareItem[] =
        (data?.per_program?.length ? data.per_program : null) ??
        (data?.per_topic?.length ? data.per_topic : null) ??
        [];

    return (
        <div style={{ marginTop: 16, maxWidth: "90vw", overflowX: "auto", paddingBottom: 380 }}>
            {data?.summary && (
                <Section title="Resumen">
                    <div style={{ lineHeight: 1.4 }}>{data.summary}</div>
                </Section>
            )}

            <Table>
                <thead>
                    <HeaderRow
                        labels={[
                            // dimensionLabel,
                            cohortA_label,
                            cohortB_label,
                            "Diferencias clave",
                            "Hipótesis",
                            "Evidencia (transcripción)",
                        ]}
                    />
                </thead>

                <tbody>
                    {per.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0", verticalAlign: "top" }}>
                            {/* <Cell bold>{row.name}</Cell> */}
                            <Cell><Bullets items={row.cohortA_tendencies} /></Cell>
                            <Cell><Bullets items={row.cohortB_tendencies} /></Cell>
                            <Cell><Bullets items={row.key_differences} /></Cell>
                            <Cell><Bullets items={row.possible_reasons_hypotheses} /></Cell>
                            <Cell>
                                <Evidence title="A" items={row.evidence?.cohortA_examples} />
                                <div style={{ height: 10 }} />
                                <Evidence title="B" items={row.evidence?.cohortB_examples} />
                            </Cell>
                        </tr>
                    ))}

                    {per.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ padding: 16, color: "#777" }}>
                                No se pudo construir la comparación.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {data?.methodology_sources?.length && (
                <Section title="Fuentes (metodología)">
                    <ul>
                        {data.methodology_sources.map((s, i) => (
                            <li key={i}>
                                <strong>{s.title}</strong>
                                <div style={{ fontSize: 12, color: "#666" }}>{s.url}</div>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {data?.limitations?.length && (
                <Section title="Limitaciones">
                    <ul>
                        {data.limitations.map((l, i) => (
                            <li key={i}>{l}</li>
                        ))}
                    </ul>
                </Section>
            )}
        </div>
    );
}

/* ---------- helpers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div className="fs16 fw700">{title}</div>
            <div style={{ marginTop: 8 }}>{children}</div>
        </div>
    );
}

function Table({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>
        </div>
    );
}

function HeaderRow({ labels }: { labels: string[] }) {
    return (
        <tr style={{ borderBottom: "1px solid #eee" }}>
            {labels.map((l) => (
                <th key={l} style={{ padding: 12, minWidth: 220, position: "sticky", top: 0, background: "#fff" }}>
                    {l}
                </th>
            ))}
        </tr>
    );
}

function Cell({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
    return (
        <td style={{ padding: 12, minWidth: 220, fontWeight: bold ? 700 : 400 }}>
            {children}
        </td>
    );
}

function Bullets({ items }: { items?: string[] }) {
    if (!items?.length) return <span style={{ color: "#888" }}>—</span>;
    return (
        <ul style={{ paddingLeft: 18 }}>
            {items.map((x, i) => (
                <li key={i}>{x}</li>
            ))}
        </ul>
    );
}

function Evidence({ title, items }: { title: string; items?: string[] }) {
    if (!items?.length) return <span style={{ color: "#888" }}>—</span>;
    return (
        <>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{title}</div>
            {items.slice(0, 4).map((q, i) => (
                <div key={i} style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
                    “{q}”
                </div>
            ))}
        </>
    );
}
