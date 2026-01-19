// app/cabildos/compare/CabildosComparisonClient.tsx
"use client";

import React from "react";
import "./styles.css";
import { useSearchParams, useRouter } from "next/navigation";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";
import ComparisonTable, { CompareResult } from "@/components/cabildos/ComparisonTable";
import ComparisonChat from "@/components/cabildos/ComparisonChat";

function getAll(sp: URLSearchParams, key: string) {
    return sp.getAll(key).map((x) => x.trim()).filter(Boolean);
}

export default function CabildosComparisonClient() {
    const sp = useSearchParams();
    const router = useRouter();

    const dimension = sp.get("dimension") || "age_group";
    const a = getAll(sp as any, "a");
    const b = getAll(sp as any, "b");

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [data, setData] = React.useState<CompareResult | null>(null);

    const buildCompareUrl = React.useCallback(() => {
        const params = new URLSearchParams();

        const dimMap: Record<string, { aKey: string; bKey: string }> = {
            age_group: { aKey: "a_age", bKey: "b_age" },
            region: { aKey: "a_region", bKey: "b_region" },
            genero: { aKey: "a_gender", bKey: "b_gender" },
            nivelinstruccion: { aKey: "a_nivelinstruccion", bKey: "b_nivelinstruccion" },
            grupoetnico: { aKey: "a_grupoetnico", bKey: "b_grupoetnico" },
            cabildoId: { aKey: "a_cabildoId", bKey: "b_cabildoId" },
            stationId: { aKey: "a_stationId", bKey: "b_stationId" },
        };

        const map = dimMap[dimension] ?? dimMap["age_group"];

        for (const v of a) params.append(map.aKey, v);
        for (const v of b) params.append(map.bKey, v);

        return `/api/cabildos/stations/compare?${params.toString()}`;
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
            <div className="admin-cabildos">
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
                                <ComparisonTable data={data} cohortA_label={cohortA_label} cohortB_label={cohortB_label} />
                                <ComparisonChat basis={data} />
                            </>
                        ) : null}
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
