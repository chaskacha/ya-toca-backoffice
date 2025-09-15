'use client'
import React from "react";
import './styles.css';

type Props = {
    open: boolean;
    title: string;                 // e.g. "Are you sure you want to delete this role?"
    description?: string;          // optional helper text
    confirmLabel?: string;         // e.g. "Delete Role"
    cancelLabel?: string;          // e.g. "Cancel"
    variant?: "danger" | "primary" | "success"; // button color emphasis
    onConfirm: () => void;
    onClose: () => void;
};

const ConfirmModal: React.FC<Props> = ({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "primary",
    onConfirm,
    onClose,
}) => {
    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="overlay" role="dialog" aria-modal="true">
            <div className='card'>
                <button className="close" aria-label="Close" onClick={onClose}>×</button>
                <h3 className={"title" + " " + variant}>
                    {title}
                </h3>
                <div style={{ height: 1, width: '100%', backgroundColor: '#d9d9d9', marginTop: 24, marginBottom: 24 }} />
                {description && <p className="desc">{description}</p>}

                <div className="actions">
                    <button className="btn" onClick={onClose}>{cancelLabel}</button>
                    <button
                        className={`btn btn-${variant}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
