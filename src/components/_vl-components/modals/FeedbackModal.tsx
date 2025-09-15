'use client'
import React from "react";
import './styles.css';

const success_svg = <svg width="61" height="60" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <mask id="mask0_38_11204" maskUnits="userSpaceOnUse" x="0" y="0" width="61" height="60">
    <rect x="0.5" width="60" height="60" fill="#D9D9D9" />
  </mask>
  <g mask="url(#mask0_38_11204)">
    <path d="M27 34.5L21.625 29.125C21.1667 28.6667 20.5833 28.4375 19.875 28.4375C19.1667 28.4375 18.5833 28.6667 18.125 29.125C17.6667 29.5833 17.4375 30.1667 17.4375 30.875C17.4375 31.5833 17.6667 32.1667 18.125 32.625L25.25 39.75C25.75 40.25 26.3333 40.5 27 40.5C27.6667 40.5 28.25 40.25 28.75 39.75L42.875 25.625C43.3333 25.1667 43.5625 24.5833 43.5625 23.875C43.5625 23.1667 43.3333 22.5833 42.875 22.125C42.4167 21.6667 41.8333 21.4375 41.125 21.4375C40.4167 21.4375 39.8333 21.6667 39.375 22.125L27 34.5ZM30.5 55C27.0417 55 23.7917 54.3438 20.75 53.0312C17.7083 51.7188 15.0625 49.9375 12.8125 47.6875C10.5625 45.4375 8.78125 42.7917 7.46875 39.75C6.15625 36.7083 5.5 33.4583 5.5 30C5.5 26.5417 6.15625 23.2917 7.46875 20.25C8.78125 17.2083 10.5625 14.5625 12.8125 12.3125C15.0625 10.0625 17.7083 8.28125 20.75 6.96875C23.7917 5.65625 27.0417 5 30.5 5C33.9583 5 37.2083 5.65625 40.25 6.96875C43.2917 8.28125 45.9375 10.0625 48.1875 12.3125C50.4375 14.5625 52.2188 17.2083 53.5312 20.25C54.8438 23.2917 55.5 26.5417 55.5 30C55.5 33.4583 54.8438 36.7083 53.5312 39.75C52.2188 42.7917 50.4375 45.4375 48.1875 47.6875C45.9375 49.9375 43.2917 51.7188 40.25 53.0312C37.2083 54.3438 33.9583 55 30.5 55Z" fill="#36976E" />
  </g>
</svg>

type Props = {
  open: boolean;
  title?: string;            // e.g. "Success"
  message?: string;          // e.g. "The role has been successfully removed from the list."
  autoCloseMs?: number;      // optional auto-close
  onClose: () => void;
};

const FeedbackModal: React.FC<Props> = ({
  open,
  title = "Success",
  message = "",
  autoCloseMs,
  onClose,
}) => {
  React.useEffect(() => {
    if (!open || !autoCloseMs) return;
    const id = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(id);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="cardSmall">
        <button className="close" aria-label="Close" onClick={onClose}>×</button>
        <div className="check">✓</div>
        <h3 className="successTitle">{title}</h3>
        {message && <p className="descCenter">{message}</p>}
      </div>
    </div>
  );
};

export default FeedbackModal;
