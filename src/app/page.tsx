import { LogsListComponent } from "@/components/logsListComponent";
import { EditorContext } from "../contexts/editorContext";
import { LogWriterComponent } from "@/components/LogWriterComponent";
import { Authentication, Protected } from "../authentication";


export default async function Homepage() {
	return (
		<div className="homepage">
			<header className="header">
				<div className="header__content">
					<h1>Logbook</h1>
					<div className="header__content__auth">
						<Authentication />
					</div>
				</div>
			</header>

			<main className="main">
				<Protected>
					<EditorContext>
						<div className="log-writer-container">
							<LogWriterComponent />
						</div>
						<div className="logs-list-container">
							<LogsListComponent />
						</div>
					</EditorContext>
				</Protected>
			</main>
		</div>
	);
}