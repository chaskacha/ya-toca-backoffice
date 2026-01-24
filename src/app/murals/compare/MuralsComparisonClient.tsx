"use client";

import React from "react";
import "./styles.css";
import { useSearchParams, useRouter } from "next/navigation";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";

import MuralsComparisonTable, { CompareResult } from "@/components/murals/ComparisonTable";
import MuralsComparisonChat from "@/components/murals/ComparisonChat";

function getAll(sp: URLSearchParams, key: string) {
    return sp.getAll(key).map((x) => x.trim()).filter(Boolean);
}

export default function MuralsComparisonClient() {
    const sp = useSearchParams();
    const router = useRouter();

    // supported mural compare dimensions (adjust to your reality)
    const dimension = sp.get("dimension") || "region";
    const a = getAll(sp as any, "a");
    const b = getAll(sp as any, "b");

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [data, setData] = React.useState<CompareResult | null>(null);

    const buildCompareUrl = React.useCallback(() => {
        const params = new URLSearchParams();

        // ✅ adapt this to murals compare API query keys
        // Recommended contract:
        // - dimension=region|eventId|date_range|...
        // - a=...
        // - b=...
        // But if you prefer old style a_region / b_region, keep the mapping here.
        //
        // Option A (simple): send dimension + a[] + b[]
        params.set("dimension", dimension);
        for (const v of a) params.append("a", v);
        for (const v of b) params.append("b", v);

        return `/api/murals/compare?${params.toString()}`;
    }, [dimension, a.join("|"), b.join("|")]);

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

    const cohortA_label = `Selección 1: ${a.join(", ")}`;
    const cohortB_label = `Selección 2: ${b.join(", ")}`;

    return (
        <Wrapper>
            <div className="admin-murals">
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

                            <div className="fs18 fw700">Comparación</div>
                        </div>

                        <div style={{ height: 12 }} />

                        {loading ? (
                            <div className="dash-loading" style={{ marginTop: 16 }}>
                                Generando comparación...
                            </div>
                        ) : null}

                        {error ? (
                            <div className="dash-loading" style={{ marginTop: 16 }}>
                                {error}
                            </div>
                        ) : null}

                        {data ? (
                            <>
                                <MuralsComparisonTable
                                    data={data}
                                    cohortA_label={cohortA_label}
                                    cohortB_label={cohortB_label}
                                />
                                <MuralsComparisonChat basis={data} />
                            </>
                        ) : null}
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
