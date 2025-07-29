import { EditorContext } from "../contexts/editorContext";
import { LogsListComponent } from "@/components/logsListComponent";
import { LogWriterComponent } from "@/components/logWriterComponent";
import { Protected } from "../authentication";
import LogsListContainerClient from "./page.logsListContainer.client";
import LogWriterContainerClient from "./page.logWriterContainer.client";
import { Header } from "./header";
import { fetchLogs } from "@/actions/logs";
import { getUserId } from "@/authentication/actions/user";
import { fetchCategories } from "@/actions/categories";

export default async function Homepage() {

	const logs = await fetchLogs();
	const categories = await fetchCategories();
	const userId = await getUserId();
	
	return (
		<div className="homepage">
			<Header />			

			<main className="main">
				<Protected>
					<EditorContext serverLogs={logs} serverCategories={categories} userId={userId}> 
						<LogWriterContainerClient>
							<LogWriterComponent />
						</LogWriterContainerClient>
						<LogsListContainerClient>
							<LogsListComponent />
						</LogsListContainerClient>
					</EditorContext>
				</Protected>
			</main>
		</div>
	);
}