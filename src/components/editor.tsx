'use client';

import EditorJS, { OutputData } from "@editorjs/editorjs";
import { useEffect, useRef, useState } from "react";

export const EditorComponent = () => {

    const ref = useRef<HTMLDivElement>(null);
    const editor = useRef<EditorJS>(null);

    const [ready, setReady] = useState<boolean>(false);

    const [content, setContent] = useState<OutputData>();

    useEffect(() => {

        setReady(true);

        if (ready) {
            const current = ref.current;
    
            if (current) {
                editor.current = new EditorJS({
                    holder: current,
                    placeholder: 'Start writing your diary',
                    onChange: () => {
                        // Get saved data from Editor.js
                        editor.current?.save().then((outputData) => {
                            setContent(outputData);
                        });
                    },
                });

                editor.current.isReady.then(() => {
                    console.log('Editor is ready to work!');
                });
            }
        }

        return () => {
            editor.current?.destroy();
            editor.current = null;
            setReady(false);
        };
    }, [ready]);

    useEffect(() => {
        if (content) {
            console.log('Editor content: ', content);
        }
    }, [content]);

    return (
        <div>
            <h2>Editor</h2>

            <div ref={ref}></div>
        </div>
    );
};