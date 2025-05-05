import { LogsListComponent } from "@/components/logsListComponent";
import { EditorContext } from "../contexts/editorContext";
import { LogWriterComponent } from "@/components/LogWriterComponent";
import { auth, signIn, signOut } from "@/auth";

export default async function Homepage() {

	const session = await auth();

	return (
		<div className="homepage">
			<header className="header">
				<div className="header__content">
					<h1>Logbook</h1>

					<div className="header__content__auth">
						{
							session ?
								<div className="header__content__auth__authenticated">
									{/* <p>{session.user?.email}</p> */}
									<form
										action={async () => {
											"use server"
											await signOut()
										}}
									>
										<button type="submit">Sign Out</button>
									</form>
								</div>
								:
								<div className="header__content__auth__unauthenticated">
									<form
										action={async () => {
											"use server"
											await signIn("github")
										}}
									>
										<button type="submit">Signin with GitHub</button>
									</form>
								</div>
						}
					</div>
				</div>
			</header>

			<main className="main">
				{
					session &&
					<EditorContext>
						<div className="log-writer-container">
							<LogWriterComponent />
						</div>
						<div className="logs-list-container">
							<LogsListComponent />
						</div>
					</EditorContext>
				}
			</main>
		</div>
	);
}