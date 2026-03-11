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

    const groups = React.useMemo(() => getAll(sp, "group"), [sp]);
    const groupsKey = React.useMemo(() => groups.join("|"), [groups]);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [data, setData] = React.useState<RadioCompareResult | null>(null);

    const compareUrl = React.useMemo(() => {
        const params = new URLSearchParams();
        for (const v of groups) params.append("group", v);
        return `/api/radio/compare?${params.toString()}`;
    }, [groupsKey]);

    React.useEffect(() => {
        console.log("RadioComparisonClient mounted");
        console.log("groups from URL =>", groups);
        console.log("API URL =>", compareUrl);
    }, [groupsKey, compareUrl]);

    React.useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                setLoading(true);
                setError(null);
                setData(null);

                if (groups.length < 2) {
                    setError("Debes seleccionar al menos 2 grupos para comparar.");
                    return;
                }

                console.log("fetching =>", compareUrl);

                const res = await fetch(compareUrl);
                const json = await res.json();

                console.log("compare response =>", json);

                if (cancelled) return;

                if (!res.ok) {
                    setError(json?.error || "No se pudo generar la comparación.");
                    return;
                }

                setData(json?.result ?? null);
            } catch (e) {
                console.error("compare page error =>", e);
                if (!cancelled) {
                    setError("Error cargando comparación.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [groupsKey, compareUrl]);

    return (
        <Wrapper>
            <div className="admin-radio">
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

                            <div className="fs18 fw700">Comparación (Radio)</div>
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
                                <RadioComparisonTable
                                    data={data}
                                    title={data.comparison_title || "Comparación de grupos"}
                                />
                                <RadioComparisonChat basis={data} mode="compare" />
                            </>
                        ) : null}
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}