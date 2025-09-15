import React from "react";
import './styles.css';

const filter_svg = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_146_2646)">
        <path d="M4.24993 5.61C6.56993 8.59 9.99993 13 9.99993 13V18C9.99993 19.1 10.8999 20 11.9999 20C13.0999 20 13.9999 19.1 13.9999 18V13C13.9999 13 17.4299 8.59 19.7499 5.61C20.2599 4.95 19.7899 4 18.9499 4H5.03993C4.20993 4 3.73993 4.95 4.24993 5.61Z" fill="#242424" />
    </g>
    <defs>
        <clipPath id="clip0_146_2646">
            <rect width="24" height="24" fill="white" />
        </clipPath>
    </defs>
</svg>

export enum StatusValue {
    all = "all",
    active = "active",
    inactive = "inactive",
    deactivated = "deactivated"
}

type Props = {
    value: StatusValue;                    // current applied value
    onApply: (v: StatusValue) => void;     // fire when user clicks Apply
    onClear?: () => void;                  // optional "Clear" handler (sets to 'all')
    options: Array<{ label: string; value: StatusValue }>;
};

export default function StatusFilter({
    value,
    onApply,
    onClear,
    options,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const [draft, setDraft] = React.useState<StatusValue>(value);

    React.useEffect(() => setDraft(value), [value]);

    const apply = () => {
        onApply(draft);
        setOpen(false);
    };

    const reset = () => setDraft(value);          // back to currently applied
    const clear = () => {
        setDraft(StatusValue.all);
        onClear?.();
    };

    const label = options.find(o => o.value === value)?.label ?? "Filter";

    return (
        <div className="filter-root">
            <button className="filter-trigger" onClick={() => setOpen(o => !o)}>
                Filter <span className="icon">{filter_svg}</span>
            </button>

            {open && (
                <div className="filter-popover" role="dialog" aria-label="Filter">
                    <div className="fp-head">
                        <div className="fp-title">Filter</div>
                        <button className="fp-close" onClick={() => setOpen(false)}>✕</button>
                    </div>

                    <div className="fp-row">
                        <div className="fp-row-left">
                            <div className="fp-label">Select Status</div>
                            <button className="fp-clear" onClick={clear}>Clear</button>
                        </div>

                        <label className="fp-select-label">
                            <span className="fp-select-title">Filter</span>
                            <select
                                className="fp-select"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value as StatusValue)}
                            >
                                {options.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="fp-actions">
                        <button className="btn ghost" onClick={reset}>Reset</button>
                        <button className="btn primary" onClick={apply}>Apply Filter</button>
                    </div>
                </div>
            )}
        </div>
    );
}
