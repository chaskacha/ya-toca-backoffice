'use client';

import React from "react";
import type { RadioCompareResult } from "./RadioComparisonTable";

type ChatMsg = { role: "user" | "assistant"; content: string };
type ChatSize = "min" | "dock" | "full";

function nextSize(s: ChatSize): ChatSize {
    if (s === "min") return "dock";
    if (s === "dock") return "full";
    return "min";
}

export default function RadioComparisonChat({ basis }: { basis: RadioCompareResult }) {
    const [messages, setMessages] = React.useState<ChatMsg[]>([
        {
            role: "assistant",
            content:
                "Listo. Pregúntame sobre diferencias entre programas o temas, basándome únicamente en las transcripciones analizadas.",
        },
    ]);

    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [size, setSize] = React.useState<ChatSize>("dock");

    const send = async () => {
        if (!input.trim() || loading) return;

        setMessages((p) => [...p, { role: "user", content: input }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/radio/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ basis, messages }),
            });

            const json = await res.json();
            setMessages((p) => [...p, { role: "assistant", content: json.answer ?? "—" }]);
        } catch {
            setMessages((p) => [...p, { role: "assistant", content: "Error de red." }]);
        } finally {
            setLoading(false);
        }
    };

    if (size === "min") {
        return (
            <div style={{ position: "fixed", bottom: 14, right: 14, zIndex: 50 }}>
                <button onClick={() => setSize("dock")} style={fabStyle}>💬</button>
            </div>
        );
    }

    return (
        <div style={container(size)} onClick={size === "full" ? () => setSize("dock") : undefined}>
            <div style={panel(size)} onClick={(e) => e.stopPropagation()}>
                <Header onToggle={() => setSize(nextSize(size))} />

                <div style={{ padding: 14, height: size === "dock" ? "30vh" : "100%", overflowY: "auto" }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ marginBottom: 12 }}>
                            <strong>{m.role === "user" ? "Tú" : "Analista"}</strong>
                            <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                        </div>
                    ))}
                </div>

                <Footer
                    value={input}
                    onChange={setInput}
                    onSend={send}
                    loading={loading}
                />
            </div>
        </div>
    );
}

/* ---------- styles ---------- */

const fabStyle = {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "#000",
    color: "#fff",
};

const container = (s: ChatSize): React.CSSProperties =>
    s === "min"
        ? { position: "fixed", bottom: 14, right: 14, zIndex: 50 }
        : s === "dock"
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

const panel = (s: ChatSize): React.CSSProperties =>
    s === "min"
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
        : s === "dock"
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

function Header({ onToggle }: { onToggle: () => void }) {
    return (
        <div style={{ padding: 14, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
            <strong>Chat (Radio)</strong>
            <button onClick={onToggle}>⬜</button>
        </div>
    );
}

function Footer({
    value,
    onChange,
    onSend,
    loading,
}: {
    value: string;
    onChange: (v: string) => void;
    onSend: () => void;
    loading: boolean;
}) {
    return (
        <div style={{ padding: 14, borderTop: "1px solid #eee", display: "flex", gap: 10 }}>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Pregunta algo…"
                style={{ flex: 1 }}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
            />
            <button onClick={onSend} disabled={loading}>
                {loading ? "..." : "Enviar"}
            </button>
        </div>
    );
}
