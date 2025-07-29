import { Public } from "./public";
import { fetchLogs } from "@/actions/logs";
import { fetchCategories } from "@/actions/categories";
import { getUserId } from "./actions/user";
import { EditorContext } from "@/contexts/editorContext";
import LogWriterContainerClient from "@/app/page.logWriterContainer.client";
import { LogWriterComponent } from "@/components/logWriterComponent";
import LogsListContainerClient from "@/app/page.logsListContainer.client";
import { LogsListComponent } from "@/components/logsListComponent";

export const Protected = async () => {

    const logs = await fetchLogs();
	const categories = await fetchCategories();
	const userId = await getUserId();

    if (!userId) {
        return (
            <Public />
        );
    }

    return <>
        <EditorContext serverLogs={logs} serverCategories={categories} userId={userId}>
            <LogWriterContainerClient>
                <LogWriterComponent />
            </LogWriterContainerClient>
            <LogsListContainerClient>
                <LogsListComponent />
            </LogsListContainerClient>
        </EditorContext>
    </>;
};