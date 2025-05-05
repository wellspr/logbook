import { LogsListComponent } from "@/components/logsListComponent";
import { EditorContext } from "../contexts/editorContext";
import { LogWriterComponent } from "@/components/LogWriterComponent";

export default function Homepage() {
	return (
		<div className="homepage">
			<header className="header">
				<div className="header__content">
					<h1>Logbook</h1>
				</div>
			</header>

			<main className="main">
				<EditorContext>
					<div className="log-writer-container">
						<LogWriterComponent />
					</div>
					<div className="logs-list-container">
						<LogsListComponent />
					</div>
				</EditorContext>
			</main>
		</div>
	);
}