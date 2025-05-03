'use client';

import dynamic from "next/dynamic";

const EditorComponent = dynamic(
    () => import("../components/editor").then(m => m.EditorComponent), {
	ssr: false,
});

export const EditorClient = () => <EditorComponent />;