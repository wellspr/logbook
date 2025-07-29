import { Protected } from "../authentication";
import { Header } from "./header";

export default async function Homepage() {

	return (
		<div className="homepage">
			<Header />

			<main className="main">

				<Protected />
			</main>
		</div>
	);
}