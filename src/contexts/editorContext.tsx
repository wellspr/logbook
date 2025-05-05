'use client';

import { useContext, createContext, useState, Dispatch, SetStateAction, useEffect, useCallback } from "react";
import { Log } from "../../generated/prisma";
import { fetchLogs } from "@/actions/logs";

type EditorContextInterface = {
    logs: Log[];
    setLogs: Dispatch<SetStateAction<Log[]>>;
    updateLogs: () => Promise<void>;
}

const defaultValue: EditorContextInterface = {
    logs: [],
    setLogs: () => { },
    updateLogs: async () => { },
};

const Context = createContext<EditorContextInterface>(defaultValue);

export const EditorContext = ({ children }: { children: React.ReactNode }) => {

    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
        fetchLogs().then((logs) => {
            setLogs(logs);
        });
    }, []);

    const updateLogs = useCallback(async () => {
        const logs = await fetchLogs();
        setLogs(logs);
    }, []);

    const value: EditorContextInterface = {
        logs,
        setLogs,
        updateLogs,
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