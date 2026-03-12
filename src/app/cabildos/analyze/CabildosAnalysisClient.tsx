"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";
import PersistedAnalysisChat from "@/components/ai-history/PersistedAnalysisChat";

type AnalyzeStation = {
    stationId: number;
    stationName?: string;
    question?: string;
    dominant_themes?: string[];
    emotions?: string[];
    demands_or_proposals?: string[];
    hopes_or_positive_signals?: string[];
    actionable_opportunities?: string[];
    evidence?: string[];
};

type AnalyzeResult = {
    population_summary?: string;
    per_station?: AnalyzeStation[];
    limitations?: string[];
};

type SavedThread = {
    id: string;
    title: string;
    created_at: string;
};

type ApiResponse = {
    result: AnalyzeResult;
    thread?: SavedThread | null;
    initialMessages?: { role: "user" | "assistant"; content: string }[];
};

export default function CabildosAnalyzeClient() {
    const sp = useSearchParams();
    const router = useRouter();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [data, setData] = React.useState<AnalyzeResult | null>(null);
    const [thread, setThread] = React.useState<SavedThread | null>(null);
    const [initialMessages, setInitialMessages] = React.useState<
        { role: "user" | "assistant"; content: string }[]
    >([]);

    const allowedKeys = [
        "cabildoId",
        "region",
        "age",
        "gender",
        "nivelinstruccion",
        "grupoetnico",
        "stationId",
    ] as const;

    const buildAnalyzeUrl = React.useCallback(() => {
        const params = new URLSearchParams();

        for (const k of allowedKeys) {
            const v = sp.get(k);
            if (v) params.set(k, v);
        }

        return `/api/cabildos/stations/analyze?${params.toString()}`;
    }, [sp]);

    React.useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                setError(null);
                setData(null);
                setThread(null);
                setInitialMessages([]);

                const res = await fetch(buildAnalyzeUrl());
                const json = (await res.json()) as ApiResponse & { error?: string };

                if (!res.ok) {
                    setError(json?.error || "No se pudo generar el análisis.");
                    return;
                }

                setData((json?.result ?? null) as AnalyzeResult);
                setThread(json?.thread ?? null);
                setInitialMessages(Array.isArray(json?.initialMessages) ? json.initialMessages : []);
            } catch (e) {
                console.error(e);
                setError("Error cargando análisis.");
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [buildAnalyzeUrl]);

    const appliedFiltersLabel = React.useMemo(() => {
        const pairs: string[] = [];
        for (const k of allowedKeys) {
            const v = sp.get(k);
            if (v) pairs.push(`${k}=${v}`);
        }
        return pairs.length ? pairs.join(" · ") : "Sin filtros (global)";
    }, [sp]);

    return (
        <Wrapper>
            <div className="admin-cabildos" style={{ maxHeight: "100vh", overflow: "auto" }}>
                <SafeArea mv={32}>
                    <>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <button
                                onClick={() => router.back()}
                                style={{
                                    height: 40,
                                    padding: "0 12px",
                                    borderRadius: 10,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                }}
                            >
                                ← Volver
                            </button>

                            <div className="fs18 fw700">Análisis</div>
                        </div>

                        <div style={{ height: 8 }} />
                        <div style={{ color: "#666" }}>{appliedFiltersLabel}</div>

                        {loading ? (
                            <div className="dash-loading" style={{ marginTop: 16 }}>
                                Generando análisis...
                            </div>
                        ) : null}

                        {error ? (
                            <div className="dash-loading" style={{ marginTop: 16 }}>
                                {error}
                            </div>
                        ) : null}

                        {data ? (
                            <>
                                <AnalysisView data={data} />

                                {thread ? (
                                    <PersistedAnalysisChat
                                        threadId={thread.id}
                                        title="Chat (basado en el análisis guardado)"
                                        initialMessages={initialMessages}
                                    />
                                ) : null}
                            </>
                        ) : null}
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}

function AnalysisView({ data }: { data: AnalyzeResult }) {
    const [showRaw, setShowRaw] = React.useState(false);

    const perStation = Array.isArray(data?.per_station) ? data.per_station : [];
    const limitations = Array.isArray(data?.limitations) ? data.limitations : [];
    const sortedStations = [...perStation].sort((a, b) => (a.stationId ?? 0) - (b.stationId ?? 0));

    return (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14, paddingBottom: 380 }}>
            {data?.population_summary ? (
                <Card title="Resumen del grupo filtrado">
                    <div style={{ lineHeight: 1.5 }}>{data.population_summary}</div>
                </Card>
            ) : null}

            {sortedStations.map((s) => (
                <Card
                    key={String(s.stationId)}
                    title={`${s.stationName ?? "Estación"} (ID ${s.stationId})`}
                    subtitle={s.question ? s.question : undefined}
                >
                    <Grid2>
                        <Block title="Temas dominantes" items={s.dominant_themes} empty="Sin temas" />
                        <Block title="Emociones" items={s.emotions} empty="Sin emociones" />
                    </Grid2>

                    <div style={{ height: 10 }} />

                    <Grid2>
                        <Block title="Demandas / propuestas" items={s.demands_or_proposals} empty="Sin demandas/propuestas" />
                        <Block title="Esperanzas / señales positivas" items={s.hopes_or_positive_signals} empty="Sin señales positivas" />
                    </Grid2>

                    {Array.isArray(s.actionable_opportunities) && s.actionable_opportunities.length ? (
                        <>
                            <div style={{ height: 10 }} />
                            <div style={{ fontWeight: 800, marginBottom: 6 }}>Oportunidades accionables</div>
                            <Bullets items={s.actionable_opportunities} />
                        </>
                    ) : null}

                    {Array.isArray(s.evidence) && s.evidence.length ? (
                        <>
                            <div style={{ height: 10 }} />
                            <Quotes title="Evidencia (citas)" quotes={s.evidence} />
                        </>
                    ) : (
                        <>
                            <div style={{ height: 10 }} />
                            <div style={{ color: "#777" }}>Sin evidencia</div>
                        </>
                    )}
                </Card>
            ))}

            {limitations.length ? (
                <Card title="Limitaciones">
                    <Bullets items={limitations} />
                </Card>
            ) : null}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    onClick={() => setShowRaw((v) => !v)}
                    style={{
                        height: 36,
                        padding: "0 10px",
                        borderRadius: 10,
                        border: "1px solid #ddd",
                        background: "#fff",
                    }}
                >
                    {showRaw ? "Ocultar JSON" : "Ver JSON"}
                </button>
            </div>

            {showRaw ? (
                <pre
                    style={{
                        marginTop: 0,
                        whiteSpace: "pre-wrap",
                        background: "#111",
                        color: "#fff",
                        padding: 12,
                        borderRadius: 12,
                    }}
                >
                    {JSON.stringify(data, null, 2)}
                </pre>
            ) : null}
        </div>
    );
}

function Card({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ border: "1px solid #eee", borderRadius: 12, background: "#fff", padding: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>{title}</div>
            {subtitle ? (
                <div style={{ color: "#666", marginTop: 6, lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 700 }}>Pregunta:</span> {subtitle}
                </div>
            ) : null}
            <div style={{ height: 10 }} />
            {children}
        </div>
    );
}

function Grid2({ children }: { children: React.ReactNode }) {
    return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>;
}

function Block({ title, items, empty }: { title: string; items: any; empty: string }) {
    const arr = Array.isArray(items) ? items : [];
    return (
        <div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{title}</div>
            {arr.length ? <Bullets items={arr} /> : <div style={{ color: "#777" }}>{empty}</div>}
        </div>
    );
}

function Bullets({ items }: { items: any }) {
    const arr = Array.isArray(items) ? items : [];
    return (
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
            {arr.map((x: any, i: number) => (
                <li key={i}>{String(x)}</li>
            ))}
        </ul>
    );
}

function Quotes({ title, quotes }: { title: string; quotes: any }) {
    const arr = Array.isArray(quotes) ? quotes : [];
    return (
        <div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {arr.map((q: any, i: number) => (
                    <div
                        key={i}
                        style={{
                            border: "1px solid #eee",
                            borderRadius: 10,
                            padding: 10,
                            background: "#fafafa",
                        }}
                    >
                        <div style={{ fontStyle: "italic", lineHeight: 1.4 }}>"{String(q)}"</div>
                    </div>
                ))}
            </div>
        </div>
    );
}