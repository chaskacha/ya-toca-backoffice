import React, { Suspense } from "react";
import RadioComparisonClient from "./RadioComparisonTable";
import "./styles.css";

export default function Page() {
  return (
    <Suspense fallback={<div className="dash-loading" style={{ marginTop: 16 }}>Cargando comparación...</div>}>
      <RadioComparisonClient />
    </Suspense>
  );
}
