'use client';

import React from "react";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";
import "./styles.css";
import DarkRoomDashboard from "@/components/darkroom/DarkRoomDashboard";
import DarkRoomResponsesTable from "@/components/darkroom/DarkRoomResponsesTable";

export default function DarkRoom() {
    return (
        <Wrapper>
            <div className="admin-darkroom">
                <SafeArea mv={32}>
                    <>
                        <DarkRoomDashboard />
                        <br />
                        <DarkRoomResponsesTable />
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
