import { EditorContext } from "../contexts/editorContext";
import { LogsListComponent } from "@/components/logsListComponent";
import { LogWriterComponent } from "@/components/logWriterComponent";
import { Protected } from "../authentication";
import LogsListContainerClient from "./page.logsListContainer.client";
import LogWriterContainerClient from "./page.logWriterContainer.client";
import { Header } from "./header";
import { fetchLogs } from "@/actions/logs";

export default async function Homepage() {

	const logs = await fetchLogs();

	return (
		<div className="homepage">
			<Header />			

			<main className="main">
				<Protected>
					<EditorContext serverLogs={logs}>
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