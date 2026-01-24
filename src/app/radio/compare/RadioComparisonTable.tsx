"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";

import RadioComparisonTable, { RadioCompareResult } from "@/components/radio/RadioComparisonTable";
import RadioComparisonChat from "@/components/radio/RadioComparisonChat";
import "./styles.css";

function getAll(sp: URLSearchParams, key: string) {
    return sp.getAll(key).map((x) => x.trim()).filter(Boolean);
}

export default function RadioComparisonClient() {
    const sp = useSearchParams();
    const router = useRouter();

    const dimension = (sp.get("dimension") || "programId") as "programId" | "topicId";
    const topicId = sp.get("topicId") || ""; // optional shared scope

    const a = getAll(sp as any, "a");
    const b = getAll(sp as any, "b");

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [data, setData] = React.useState<RadioCompareResult | null>(null);

    const buildCompareUrl = React.useCallback(() => {
        const params = new URLSearchParams();
        params.set("dimension", dimension);
        if (topicId) params.set("topicId", topicId);
        for (const v of a) params.append("a", v);
        for (const v of b) params.append("b", v);
        return `/api/radio/compare?${params.toString()}`;
    }, [dimension, topicId, a.join("|"), b.join("|")]);

    React.useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                setError(null);
                setData(null);

                if (!a.length || !b.length) {
                    setError("Faltan valores para comparar (a y b).");
                    return;
                }

                const res = await fetch(buildCompareUrl());
                const json = await res.json();

                if (!res.ok) {
                    setError(json?.error || "No se pudo generar la comparación.");
                    return;
                }

                setData(json?.result ?? null);
            } catch (e) {
                console.error(e);
                setError("Error cargando comparación.");
            } finally {
                setLoading(false);
            }
        };

        run();
    }, [buildCompareUrl]);

    const dimensionLabel = dimension === "programId" ? "Programa" : "Topic";
    const cohortA_label = `Selección 1: ${a.join(", ")}`;
    const cohortB_label = `Selección 2: ${b.join(", ")}`;

    return (
        <Wrapper>
            <div className="admin-radio">
                <SafeArea mv={32}>
                    <>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <button
                                onClick={() => router.back()}
                                style={{ height: 40, padding: "0 12px", borderRadius: 10, border: "1px solid #ddd", background: "#fff" }}
                            >
                                ← Volver
                            </button>

                            <div className="fs18 fw700">Comparación (Radio)</div>
                        </div>

                        <div style={{ height: 12 }} />

                        {loading ? <div className="dash-loading" style={{ marginTop: 16 }}>Generando comparación...</div> : null}
                        {error ? <div className="dash-loading" style={{ marginTop: 16 }}>{error}</div> : null}

                        {data ? (
                            <>
                                <RadioComparisonTable
                                    data={data}
                                    cohortA_label={cohortA_label}
                                    cohortB_label={cohortB_label}
                                    dimensionLabel={dimensionLabel}
                                />
                                <RadioComparisonChat basis={data} />
                            </>
                        ) : null}
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
