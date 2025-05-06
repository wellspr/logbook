import "./authentication.scss";
import { auth } from "@/auth";
import { AuthenticatedClient } from "./authenticated.client";
import { signUserIn } from "./actions";

export const Authentication = async () => {

    const session = await auth();

    if (!session) {
        return (
            <div className="unauthenticated">
                <form
                    action={signUserIn}
                >
                    <button className="btn btn-auth btn-auth--signin" type="submit">Signin with GitHub</button>
                </form>
            </div>
        );
    }

    return <AuthenticatedClient session={session} />;
};