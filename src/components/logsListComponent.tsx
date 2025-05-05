"use client";

import "./logsList.scss";
import dynamic from "next/dynamic";
import { useEditorContext } from "@/contexts/editorContext";
//import { OutputData } from "@editorjs/editorjs";
const Editor = dynamic(
    () => import("../components/editor").then(m => m.Editor), {
    ssr: false,
});

export const LogsListComponent = () => {

    const { logs } = useEditorContext();

    return (
        <div className="logs">
            <ul className="logs__list">
                {logs
                    .toReversed()
                    .map((log) => {

                        //const data = JSON.parse(log.content) as OutputData;
                        //const date = new Date(data.time as number);

                        return (
                            <li key={log.id} className="logs__list__item">
                                {/* <div className="logs__list__item__header">
                                    <p><small>{date.toLocaleDateString()} - {date.toLocaleTimeString()}</small></p>
                                </div> */}

                                <Editor log={log} editorMode="view" />
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};