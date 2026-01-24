"use client";

import React from "react";
import type { DarkRoomCompareApiResponse } from "@/components/darkroom/DarkRoomComparisonTable";

type ChatMsg = { role: "user" | "assistant"; content: string };
type ChatSize = "min" | "dock" | "full";

function nextSize(s: ChatSize): ChatSize {
    if (s === "min") return "dock";
    if (s === "dock") return "full";
    return "min";
}

function iconFor(s: ChatSize) {
    if (s === "min") return "💬";
    if (s === "dock") return "⬜";
    return "➖";
}

function labelFor(s: ChatSize) {
    if (s === "min") return "Abrir chat";
    if (s === "dock") return "Pantalla completa";
    return "Minimizar";
}

/**
 * Dark Room chat grounding prompt
 * - basis is the source of truth (counts/pcts per question/option)
 * - do not invent context
 * - if "why" => hypotheses only
 */
const SYSTEM = `
Eres un analista. Responde en español.
Tu base de verdad es el JSON "basis" (resultado de /api/darkroom/compare).

IMPORTANTE (contexto de datos):
- Dark Room: participantes eligieron OPCIONES ante una PREGUNTA (no hay texto libre).
- El JSON contiene, por pregunta, totales por cohorte y porcentajes por opción (A% y B%).

Reglas:
- No inventes datos que no estén en basis.
- Sustenta con NÚMEROS: totales, porcentajes y diferencias (A% − B%) por pregunta/opción.
- Si te preguntan "por qué", responde con hipótesis cautelosas, no con hechos.
- Si los totales son bajos o hay sesgo, menciónalo como limitación.
- Si el usuario pide "fuentes", menciona solo fuentes metodológicas (análisis descriptivo; LLM) y aclara que NO son fuentes sobre la realidad social local.
- No des consejos legales/médicos/financieros. Mantén tono neutral y analítico.
`;

export default function ComparisonChatDarkRoom({
    data,
    cohortA_label,
    cohortB_label,
}: {
    data: DarkRoomCompareApiResponse; // full response from /api/darkroom/compare
    cohortA_label?: string;
    cohortB_label?: string;
}) {
    const [messages, setMessages] = React.useState<ChatMsg[]>([
        {
            role: "assistant",
            content:
                "Listo. Pregúntame lo que quieras sobre esta comparación de Dark Room. Responderé basándome solo en los números (totales y porcentajes por pregunta/opción) y señalaré limitaciones cuando aplique.",
        },
    ]);
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const [size, setSize] = React.useState<ChatSize>("dock");

    const send = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const next: ChatMsg[] = [...messages, { role: "user", content: text }];
        setMessages(next);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/darkroom/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system: SYSTEM,
                    basis: data, // IMPORTANT: send the compare response as basis
                    messages: next,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                setMessages((p) => [
                    ...p,
                    {
                        role: "assistant",
                        content: json?.error || "No se pudo responder. Intenta de nuevo.",
                    },
                ]);
                return;
            }

            setMessages((p) => [...p, { role: "assistant", content: json.answer ?? "OK" }]);
        } catch (e) {
            console.error(e);
            setMessages((p) => [...p, { role: "assistant", content: "Error de red. Intenta de nuevo." }]);
        } finally {
            setLoading(false);
        }
    };

    // ---- layout based on size ----
    const containerStyle: React.CSSProperties =
        size === "min"
            ? { position: "fixed", bottom: 14, right: 14, zIndex: 50 }
            : size === "dock"
                ? {
                    position: "fixed",
                    bottom: 12,
                    right: 0,
                    left: 85, // adjust if sidebar, otherwise set to 12
                    width: "auto",
                    zIndex: 50,
                }
                : {
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    background: "rgba(0,0,0,.35)",
                    padding: 14,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                };

    const panelStyle: React.CSSProperties =
        size === "min"
            ? {
                width: 56,
                height: 56,
                borderRadius: 16,
                border: "1px solid #000",
                background: "#000",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 8px 22px rgba(0, 0, 0, 0.22)",
                userSelect: "none",
            }
            : size === "dock"
                ? {
                    border: "1px solid #000",
                    borderRadius: 12,
                    background: "#fff",
                    width: "min(980px, calc(100% - 24px))",
                    margin: "0 auto",
                    boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.12)",
                    overflow: "hidden",
                }
                : {
                    border: "1px solid #000",
                    borderRadius: 12,
                    background: "#fff",
                    width: "min(1100px, 100%)",
                    height: "min(92vh, 100%)",
                    boxShadow: "0px 10px 30px rgba(0,0,0,.25)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                };

    const bodyHeight = size === "dock" ? "30vh" : size === "full" ? "100%" : "auto";

    if (size === "min") {
        return (
            <div style={containerStyle}>
                <div
                    style={panelStyle}
                    onClick={() => setSize(nextSize(size))}
                    aria-label={labelFor(size)}
                    title={labelFor(size)}
                >
                    💬
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle} onClick={size === "full" ? () => setSize("dock") : undefined}>
            <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
                <div
                    style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <div>
                        <div className="fs18 fw700">Chat (Dark Room)</div>
                        <div style={{ color: "#666", marginTop: 6, lineHeight: 1.35 }}>
                            <div><b>A:</b> {cohortA_label}</div>
                            <div><b>B:</b> {cohortB_label}</div>
                            <div style={{ marginTop: 6 }}>
                                Esta conversación no se guarda. Se reinicia si sales de la página.
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setSize(nextSize(size))}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            border: "1px solid #ddd",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label={labelFor(size)}
                        title={labelFor(size)}
                    >
                        {iconFor(size)}
                    </button>
                </div>

                <div
                    style={{
                        padding: 14,
                        height: bodyHeight,
                        maxHeight: size === "dock" ? "30vh" : undefined,
                        overflowY: "auto",
                    }}
                >
                    {messages.map((m, idx) => (
                        <div key={idx} style={{ marginBottom: 12 }}>
                            <div style={{ fontWeight: 800, marginBottom: 4 }}>{m.role === "user" ? "Tú" : "Asistente"}</div>
                            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.35, color: "#111" }}>{m.content}</div>
                        </div>
                    ))}
                </div>

                <div style={{ padding: 14, borderTop: "1px solid #eee", display: "flex", gap: 10 }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pregunta algo…"
                        style={{
                            flex: 1,
                            height: 42,
                            padding: "0 12px",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            outline: "none",
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") send();
                        }}
                    />
                    <button
                        onClick={send}
                        disabled={loading || !input.trim()}
                        style={{
                            height: 42,
                            padding: "0 14px",
                            borderRadius: 10,
                            border: "1px solid #000",
                            background: "#000",
                            color: "#fff",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "..." : "Enviar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
