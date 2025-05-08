import { Authentication } from "@/authentication";

export const Header = () => {
    return (
        <header className="header">
            <div className="header__content">
                <h1>Logbook</h1>
                <div className="header__content__auth">
                    <Authentication />
                </div>
            </div>
        </header>
    );
};