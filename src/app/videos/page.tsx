'use client';

import React from "react";
import Wrapper from "@/components/basic/wrapper";
import SafeArea from "@/components/basic/safe-area";
import "./styles.css";

import VideosDashboard from "@/components/videos/VideosDashboard";
import VideosPhrasesTable from "@/components/videos/VideosPhrasesTable";

export default function VideosPage() {
    return (
        <Wrapper>
            <div className="admin-videos">
                <SafeArea mv={32}>
                    <>
                        <VideosDashboard />
                        <br />
                        <VideosPhrasesTable />
                    </>
                </SafeArea>
            </div>
        </Wrapper>
    );
}
