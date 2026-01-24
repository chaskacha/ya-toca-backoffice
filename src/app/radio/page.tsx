'use client';

import React from "react";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";
import RadioDashboard from "@/components/radio/RadioDashboard";
import RadioEpisodesTable from "@/components/radio/RadioEpisodesTable";
import "./styles.css";

export default function Radio() {
    return (
        <Wrapper>
            <div className="admin-radio">
                <SafeArea mv={32}>
                    <>
                        <RadioDashboard />
                        <br />
                        <RadioEpisodesTable />
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
