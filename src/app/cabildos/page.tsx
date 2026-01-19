'use client';

import React from "react";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";
import CabildosDashboard from "@/components/cabildos/CabildosDashboard";
import CabildosStationsTable from "@/components/cabildos/CabildosStationsTable";
import "./styles.css";

export default function Cabildos() {
    return (
        <Wrapper>
            <div className="admin-cabildos">
                <SafeArea mv={32}>
                    <>
                        <CabildosDashboard />
                        <br />
                        <CabildosStationsTable />
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
