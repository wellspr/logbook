"use client";

import "./categories.scss";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Category, Log } from "@prisma/client";
import { CategoriesList } from "./categoriesList";
import { CategoriesActions } from "./categoriesActions";

interface CategoryProps {
    log?: Log;
    logCategories?: Category[];
    editMode: boolean;
    categoriesToRemove: string[];
    setCategoriesToRemove: Dispatch<SetStateAction<string[]>>
}

export const Categories = (props: CategoryProps) => {

    const { log, logCategories, editMode, categoriesToRemove, setCategoriesToRemove } = props;

    /* These are the categories attributed to the log */
    const [currentLogCategories, setCurrentLogCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (log && logCategories) {
            setCurrentLogCategories(logCategories);
        }
    }, [log, logCategories]);

    if (!log) return null;

    return (
        <div className="categories">
            <CategoriesList
                categories={currentLogCategories}
                categoriesToRemove={categoriesToRemove}
                editMode={editMode}
                setCategoriesToRemove={setCategoriesToRemove}
            />

            <CategoriesActions
                log={log}
                currentLogCategories={currentLogCategories}
            />
        </div >
    );
};