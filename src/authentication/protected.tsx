import { auth } from "@/auth";
import { Public } from "./public";

export const Protected = async ({ children }: { children: React.ReactNode }) => {

    const session = await auth();

    if (!session) {
        return (
            <Public />
        );
    }

    return <>{children}</>;
};