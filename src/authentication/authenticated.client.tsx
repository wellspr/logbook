'use client';

import "./authenticatedClient.scss";
import { useEffect, useRef, useState } from "react";
import { Session } from "next-auth";
import { signUserOut } from "./actions";
import Image from "next/image";

export const AuthenticatedClient = ({ session }: { session: Session }) => {

    const [show, setShow] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onBodyClick = (e: MouseEvent) => {
            const current = ref.current;
            const target = e.target as HTMLElement;

            if (current && !current.contains(target)) {
                setShow(false);
            }
        };

        document.body.addEventListener("click", onBodyClick);

        return () => {
            document.body.removeEventListener("click", onBodyClick);
        };
    }, []);

    return (
        <div className="authenticated" ref={ref}>
            <div className="authenticated__avatar" onClick={() => setShow(!show)}>
                <Image src={session.user?.image ?? ""} alt="avatar" width={25} height={25} />
            </div>

            {
                show &&

                <div className="authenticated__details">
                    <p>{session.user?.email}</p>
                    <form
                        action={signUserOut}
                    >
                        <button className="btn btn-auth btn-auth--signout" type="submit">
                            Sign Out
                        </button>
                    </form>
                </div>
            }
        </div>
    );
};