'use client';

import "./logWriter.scss";
import dynamic from "next/dynamic";

const Editor = dynamic(
    () => import("./editor").then(m => m.Editor), {
    ssr: false,
});

export const LogWriterComponent = () => {
    return (
        <div className="log-writer">
            <div className="log-writer__content">
                <Editor />
            </div>
        </div>
    );
};