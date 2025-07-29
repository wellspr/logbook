'use client';

import { useContext, createContext, useState, useEffect, useCallback, useRef, RefObject } from "react";
import { Category, Log } from "@prisma/client";
import * as logActions from "@/actions/logs";
import * as categoryActions from "@/actions/categories";
import localforage from "localforage";
import { OutputData } from "@editorjs/editorjs";

const scrollStore = localforage.createInstance({
    name: "scrollStore",
});

type EditorContextInterface = {
    logs: Log[] | undefined;
    categories: Category[] | undefined;
    createLog: (content: OutputData) => Promise<void>;
    updateLog: (logId: string, content: OutputData | undefined) => Promise<Log>;
    deleteLog: (logId: string) => Promise<void>
    createCategory: (name: string) => Promise<Category>
    addCategoryToLog: (logId: string, categoryId: string) => Promise<void>
    removeCategoriesFromLog: (logId: string, categoriesToRemove: string[]) => Promise<void>
    logsContainerRef: RefObject<HTMLDivElement | null>
}

const defaultValue: EditorContextInterface = {
    logs: undefined,
    categories: undefined,
    createLog: async () => { },
    updateLog: async () => { return {} as Log },
    deleteLog: async () => { },
    createCategory: async () => {return {} as Category },
    addCategoryToLog: async () => { },
    removeCategoriesFromLog: async () => { },
    logsContainerRef: { current: null }
};

const Context = createContext<EditorContextInterface>(defaultValue);

export const EditorContext = ({
    serverLogs,
    serverCategories,
    userId,
    children
}: {
    serverLogs: Log[],
    serverCategories: Category[],
    userId: string,
    children: React.ReactNode
}) => {

    const [logs, setLogs] = useState<Log[] | undefined>(serverLogs);
    const [categories, setCategories] = useState<Category[]>(serverCategories);
    const logsContainerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<number | undefined>(null);

    useEffect(() => {
        setLogs(serverLogs);
    }, [serverLogs]);

    useEffect(() => {
        setCategories(serverCategories);
    }, [serverCategories]);

    useEffect(() => {
        const logsContainer = logsContainerRef.current;

        if (logs && logs.length > 0 && logsContainer) {
            setTimeout(() => {
                scrollStore.getItem('currentScroll')
                    .then((scroll) => {
                        if (scroll) {
                            const top = Number(scroll);
                            logsContainer.scrollTo({ top, behavior: 'smooth' });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }, 500);
        }
    }, [logs]);

    useEffect(() => {
        const current = logsContainerRef.current;

        const onScroll = () => {
            const scrollTop = current?.scrollTop;
            scrollRef.current = scrollTop;
            scrollStore.setItem('currentScroll', scrollTop)
                .then((r) => {
                    console.log('saved: ', r);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        current?.addEventListener('scrollend', onScroll);

        return () => {
            current?.removeEventListener('scrollend', onScroll);
        }
    }, []);

    const updateLogs = useCallback(async () => {
        const logs = await logActions.fetchLogs();
        setLogs(logs);
    }, []);

    const updateCategories = useCallback(async () => {
        const categories = await categoryActions.fetchCategories();
        setCategories(categories);
    }, []);

    const createLog = useCallback(async (content: OutputData) => {
        await logActions.createLog({ content: JSON.stringify(content), userId });
        await updateLogs();
        logsContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [userId, updateLogs]);

    const updateLog = useCallback(async (logId: string, content: OutputData | undefined) => {
        return await logActions.updateLog(logId, JSON.stringify(content));
    }, []);

    const deleteLog = useCallback(async (logId: string) => {
        await logActions.deleteLog(logId);
        updateLogs();
    }, [updateLogs]);

    const createCategory = useCallback(async (name: string) => {
        const newCategory = await categoryActions.createCategory(name, userId);
        updateCategories();
        return newCategory;
    }, [userId, updateCategories]);

    const addCategoryToLog = useCallback(async (logId: string, categoryId: string) => {
        await logActions.addCategoryToLog(logId, categoryId);
        updateLogs();
    }, [updateLogs]);

    const removeCategoriesFromLog = useCallback(async (logId: string, categoriesToRemove: string[]) => {
        await logActions.removeCategoriesFromLog(logId, categoriesToRemove);
        updateLogs();
    }, [updateLogs]);

    const value: EditorContextInterface = {
        logs,
        categories,
        createLog,
        updateLog,
        deleteLog,
        createCategory,
        addCategoryToLog,
        removeCategoriesFromLog,
        logsContainerRef,
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export const useEditorContext = () => {
    return useContext(Context);
};