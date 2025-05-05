'use client';

import "./editor.scss";
import { createLog, deleteLog, updateLog } from "@/actions/logs";
import { useEditorContext } from "@/contexts/editorContext";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Log } from "../../generated/prisma";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import ImageTool from "@editorjs/image";

export type EditorMode = "create" | "edit" | "view";

interface EditorProps {
    log?: Log
    editorMode?: EditorMode;
}

export const Editor = ({ log, editorMode = 'create' }: EditorProps) => {

    const ref = useRef<HTMLDivElement>(null);
    const editor = useRef<EditorJS>(null);
    const container = useRef<HTMLDivElement>(null);

    const [ready, setReady] = useState<boolean>(false);

    const { updateLogs } = useEditorContext();

    const [mode, setMode] = useState<EditorMode>(editorMode);

    useEffect(() => {

        setReady(true);

        if (ready) {
            const current = ref.current;

            const data = log?.content ? JSON.parse(log.content) as OutputData : undefined;

            if (current) {
                editor.current = new EditorJS({
                    holder: current,
                    placeholder: 'Start writing your diary',
                    autofocus: false,
                    data: data,
                    readOnly: mode === "view",
                    tools: {
                        header: Header,
                        list: EditorjsList,
                        quote: Quote,
                        code: CodeTool,
                        inlineCode: InlineCode,
                        underline: Underline,
                        image: ImageTool,
                    }
                });
            }
        }

        return () => {
            editor.current?.destroy();
            editor.current = null;
            setReady(false);
        };
    }, [ready, log, mode]);

    useEffect(() => {
        const onBodyClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const currentContainer = container.current;
            if (!currentContainer) return;
            if (!currentContainer.contains(target)) {
                if (mode === "edit") {
                    const editBtns = document.querySelectorAll(".edit-btn");
                    editBtns.forEach(btn => {
                        if (btn.contains(target)) {
                            setMode("view");
                        }
                    });
                }
            }
        }
        document.body.addEventListener('click', onBodyClick);

        return () => {
            document.body.removeEventListener('click', onBodyClick);
        }
    }, [mode]);

    const saveContent = useCallback(async () => {
        const content = await editor.current?.save();
        await createLog(JSON.stringify(content));
        await updateLogs();
        editor.current?.clear();
    }, [updateLogs]);

    const updateContent = useCallback(async () => {
        if (!log) return;
        if (!setMode) return;
        const content = await editor.current?.save();
        await updateLog(log.id, JSON.stringify(content));
        await updateLogs();
        setMode("view");
    }, [log, updateLogs]);

    const deleteContent = useCallback(async () => {
        if (!log) return;
        await deleteLog(log.id);
        await updateLogs();
    }, [log, updateLogs]);

    const changeMode = useCallback((mode: EditorMode) => {
        setMode(mode);
    }, [setMode]);

    const data = log ? JSON.parse(log.content) as OutputData : undefined;
    const date = data ? new Date(data.time as number) : null;

    return (
        <div ref={container} className="editor">

            <div className="editor__header">
                <div className="editor__header__date">
                    {date && <p><small>{date.toLocaleDateString()} - {date.toLocaleTimeString()}</small></p>}
                </div>
                <div className="editor__header__buttons">
                    {
                        mode === 'edit' &&
                        <button onClick={updateContent}>Update</button>
                    }

                    {
                        mode === "view" &&
                        <button className="edit-btn" onClick={() => changeMode("edit")}>Edit</button>
                    }

                    {
                        mode === "view" || mode === 'edit' &&
                        <button onClick={deleteContent}>Delete</button>
                    }

                    {
                        mode === "edit" &&
                        <button onClick={() => changeMode("view")}>Cancel</button>
                    }
                </div>
            </div>

            <div className="editor__container">
                <div className="editor__container__editorjs">
                    <div ref={ref}></div>
                </div>
                <div className="editor__container__buttons">
                    {
                        mode === 'create' &&
                        <button onClick={saveContent}>Save</button>
                    }
                </div>
            </div>
        </div>
    );
};