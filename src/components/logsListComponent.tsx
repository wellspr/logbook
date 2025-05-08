"use client";

import "./logsList.scss";
import dynamic from "next/dynamic";
import { useEditorContext } from "@/contexts/editorContext";
import { Loader } from "./loader";

const Editor = dynamic(
    () => import("../components/editor").then(m => m.Editor), {
    ssr: false,
});

export const LogsListComponent = () => {

    const { logs } = useEditorContext();

    if (!logs) {
        return (
            <div className="loading">
                <Loader />
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="empty">
                <p>No logs found</p>
            </div>
        );
    }

    return (
        <div className="logs">
            <ul className="logs__list">
                {logs
                    .toReversed()
                    .map((log) => {
                        return (

                            <li key={log.id} className="logs__list__item">
                                <Editor log={log} editorMode="view" />
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};