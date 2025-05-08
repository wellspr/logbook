"use client";

import { useEditorContext } from "@/contexts/editorContext";

export default function LogsListContainerClient({ children }: { children: React.ReactNode }) {

    const { logsContainerRef } = useEditorContext();

    return (
        <div className="logs-list-container" ref={logsContainerRef}>
            {children}
        </div>
    );
}