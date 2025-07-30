'use client';

import "./editor.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { Category, Log } from "@prisma/client";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import ImageTool from "@editorjs/image";
import { useEditorContext } from "@/contexts/editorContext";
import { Categories } from "./categories";

export type EditorMode = "create" | "edit" | "view";

interface EditorProps {
    log: Log & { categories?: Category[] } | undefined;
    editorMode?: EditorMode;
}

export const Editor = ({ log, editorMode = 'create' }: EditorProps) => {

    const ref = useRef<HTMLDivElement>(null);
    const editor = useRef<EditorJS>(null);
    const container = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState<boolean>(false);
    const [mode, setMode] = useState<EditorMode>(editorMode);
    const [currentLog, setCurrentLog] = useState<Log | undefined>(log);
    const [loading, setLoading] = useState<boolean>(false);
    const [empty, setEmpty] = useState<boolean>(true);
    const [categoriesToRemove, setCategoriesToRemove] = useState<string[]>([]);
    const { createLog, updateLog, deleteLog, removeCategoriesFromLog } = useEditorContext();

    useEffect(() => {

        setReady(true);

        if (ready) {
            const current = ref.current;
            const data = currentLog?.content ? JSON.parse(currentLog.content) as OutputData : undefined;

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
                    },
                    onChange: async () => {
                        const content = await editor.current?.save();
                        if (content && content.blocks.length === 0) {
                            setEmpty(true);
                        } else {
                            setEmpty(false);
                        }
                    }
                });
            }
        }

        return () => {
            editor.current?.destroy();
            editor.current = null;
            setReady(false);
        };
    }, [ready, currentLog, mode]);

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
        if (!content) return;
        setLoading(true);
        createLog(content);
        editor.current?.clear();
        setLoading(false);
    }, [createLog]);

    const updateContent = useCallback(async () => {
        setLoading(true);
        if (!log) return;
        if (!setMode) return;
    
        /* If there are some categories (tags) to remove... */
        if (categoriesToRemove.length > 0) {
            await removeCategoriesFromLog(log.id, categoriesToRemove);
        }

        const content = await editor.current?.save();
        const updatedLog = await updateLog(log.id, content);

        setCurrentLog(updatedLog);
        setMode("view");
        setLoading(false);
    }, [log, updateLog, categoriesToRemove, removeCategoriesFromLog]);

    const deleteContent = useCallback(async () => {
        setLoading(true);
        if (!log) return;
        await deleteLog(log.id);
        setLoading(false);
    }, [log, deleteLog]);

    const changeMode = useCallback((mode: EditorMode) => {
        setMode(mode);

        if (mode !== "edit") {
            setCategoriesToRemove([]);
        }
    }, [setMode]);

    const data = log ? JSON.parse(log.content) as OutputData : undefined;
    const date = data ? new Date(data.time as number) : null;

    return (
        <div ref={container} className={`editor editor__${mode}`}>

            <div className="editor__header">
                <div className="editor__header__date">
                    {date && <p><small>{date.toLocaleDateString()} - {date.toLocaleTimeString()}</small></p>}
                </div>
                <div className="editor__header__buttons">
                    {
                        mode === 'edit' &&
                        <button className="btn editor__header__buttons__btn editor__header__buttons__btn--update"
                            disabled={loading}
                            onClick={updateContent}>
                            Update
                        </button>
                    }

                    {
                        mode === "view" &&
                        <button className="btn edit-btn editor__header__buttons__btn editor__header__buttons__btn--edit"
                            disabled={loading}
                            onClick={() => changeMode("edit")}>
                            Edit
                        </button>
                    }

                    {
                        mode === "view" || mode === 'edit' &&
                        <button className="btn editor__header__buttons__btn editor__header__buttons__btn--delete"
                            disabled={loading}
                            onClick={deleteContent}>
                            Delete
                        </button>
                    }

                    {
                        mode === "edit" &&
                        <button className="btn editor__header__buttons__btn editor__header__buttons__btn--cancel"
                            disabled={loading}
                            onClick={() => changeMode("view")}>
                            Cancel
                        </button>
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
                        <button className="btn editor__header__buttons__btn editor__header__buttons__btn--save"
                            disabled={empty || loading}
                            onClick={saveContent}>
                            Save
                        </button>
                    }
                </div>
            </div>
            <Categories
                log={log}
                editMode={mode === 'edit'}
                categoriesToRemove={categoriesToRemove}
                setCategoriesToRemove={setCategoriesToRemove}
            />
        </div>
    );
};