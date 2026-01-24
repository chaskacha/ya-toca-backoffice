'use client';

import React from "react";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";
import "./styles.css";
import MuralsDashboard from "@/components/murals/MuralsDashboard";
import MuralsPhrasesTable from "@/components/murals/MuralsPhrasesTable";

export default function Murals() {
    return (
        <Wrapper>
            <div className="admin-murals">
                <SafeArea mv={32}>
                    <>
                        <MuralsDashboard />
                        <br />
                        <MuralsPhrasesTable />
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
