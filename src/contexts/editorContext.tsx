'use client';

import { useContext, createContext, useState, Dispatch, SetStateAction, useEffect, useCallback, useRef, RefObject } from "react";
import { Log } from "@prisma/client";
import { fetchLogs } from "@/actions/logs";
import localforage from "localforage";

const scrollStore = localforage.createInstance({
    name: "scrollStore",
});

type EditorContextInterface = {
    logs: Log[] | undefined;
    setLogs: Dispatch<SetStateAction<Log[] | undefined>>;
    updateLogs: () => Promise<void>;
    logsContainerRef: RefObject<HTMLDivElement | null>
}

const defaultValue: EditorContextInterface = {
    logs: undefined,
    setLogs: () => { },
    updateLogs: async () => { },
    logsContainerRef: { current: null }
};

const Context = createContext<EditorContextInterface>(defaultValue);

export const EditorContext = ({ 
    serverLogs, 
    children 
}: { 
    serverLogs: Log[], 
    children: React.ReactNode 
}) => {

    const [logs, setLogs] = useState<Log[] | undefined>(serverLogs);

    const logsContainerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<number | undefined>(null);

    useEffect(() => {
        /* fetchLogs().then((logs) => {
            setLogs(logs);
        }); */
        setLogs(serverLogs);
    }, [serverLogs]);

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
        const logs = await fetchLogs();
        setLogs(logs);
    }, []);

    const value: EditorContextInterface = {
        logs,
        setLogs,
        updateLogs,
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