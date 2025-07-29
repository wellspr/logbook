import "./categoriesActions.scss";

import { CategoriesDatalist } from "./categoriesDatalist";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Category, Log } from "@prisma/client";
import { useEditorContext } from "@/contexts/editorContext";

interface CategoriesActionsProps {
    log: Log;
    currentLogCategories: Category[];
}

export const CategoriesActions = (props: CategoriesActionsProps) => {

    const { log, currentLogCategories } = props;

    const editorRef = useRef<HTMLInputElement>(null);
    const datalistRef = useRef<HTMLDivElement>(null);

    const [editorActive, setEditorActive] = useState<boolean>(false);
    const [categoryName, setCategoryName] = useState<string>("");
    
    /* These are the categories shown in the datalist (suggestions close to the input) */
    const [dataListCategories, setDataListCategories] = useState<Category[]>([]);
    const [showDatalist, setShowDatalist] = useState<boolean>(false);

    /* Category marked to inclusion in the edit mode */
    const [categoryToInclude, setCategoryToInclude] = useState<Category>();

    /* List of all categories */
    const { categories, createCategory, addCategoryToLog } = useEditorContext();

    const addNewCategory = useCallback(async () => {
        if (!log) return;
        if (!categoryName) return;
        const logId = log.id as string;
        const newCategory = await createCategory(categoryName);
        await addCategoryToLog(logId as string, newCategory.id);
        setEditorActive(false);
        setCategoryName("");
    }, [categoryName, createCategory, addCategoryToLog, log]);

    const addExistentCategoryToLog = useCallback(async () => {
        if (!log) return;
        if (!categoryToInclude) return;
        const logId = log.id as string;
        await addCategoryToLog(logId, categoryToInclude.id)
        setEditorActive(false);
        setCategoryName("");
        setCategoryToInclude(undefined);
    }, [addCategoryToLog, categoryToInclude, log]);

    const onChoseCategoryFromDatalist = useCallback((category: Category) => {
        setCategoryName(category.name);
        setCategoryToInclude(category);
        setShowDatalist(false);
    }, []);

    const onCancelEdition = useCallback(() => {
        setEditorActive(false);
        setCategoryName("");
        setCategoryToInclude(undefined);
    }, []);

    const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);

        if (e.target.value !== categoryToInclude?.name) {
            setCategoryToInclude(undefined);
        }
    }, [categoryToInclude]);

    const onInputFocus = useCallback(() => setShowDatalist(true), []);

    useEffect(() => {
        const onBodyClick = (e: MouseEvent) => {
            if (editorRef.current && editorRef.current.contains(e.target as Node)) {
                return;
            }

            if (datalistRef.current && datalistRef.current.contains(e.target as Node)) {
                return;
            }

            setShowDatalist(false);
        }

        document.body.addEventListener('click', onBodyClick);

        return () => {
            document.body.removeEventListener('click', onBodyClick);
        }
    }, []);

    useEffect(() => {
        if (categories && categories.length > 0) {
            let updatedDatalist = categories
                .filter(category => {
                    return category.name
                        .toLowerCase()
                        .startsWith(categoryName.toLowerCase())
                });

            updatedDatalist = updatedDatalist.filter(category => {
                return !currentLogCategories.map(c => c.id).includes(category.id);
            });

            setDataListCategories(updatedDatalist);
        } else {
            setDataListCategories([]);
        }
    }, [categories, categoryName, currentLogCategories]);


    return (
        <div className="categories__actions">
            {
                editorActive ?
                    (
                        <div className="categories__actions__editor">
                            <div className="categories__actions__editor__input">
                                <input
                                    ref={editorRef}
                                    type="text"
                                    placeholder="Category name"
                                    value={categoryName}
                                    onChange={onInputChange}
                                    onFocus={onInputFocus}
                                />

                                <CategoriesDatalist
                                    categories={dataListCategories}
                                    ref={datalistRef}
                                    showDatalist={showDatalist}
                                    onClickAction={onChoseCategoryFromDatalist}
                                />
                            </div>

                            {
                                categoryToInclude ?
                                    <button className="btn categories__actions__btn"
                                        onClick={addExistentCategoryToLog}>
                                        Add (old)
                                    </button>
                                    :
                                    <button className="btn categories__actions__btn"
                                        disabled={categoryName.length === 0}
                                        onClick={addNewCategory}>
                                        Add (new)
                                    </button>
                            }

                            <button className="btn categories__actions__btn"
                                onClick={onCancelEdition}>
                                Cancel
                            </button>
                        </div>
                    )
                    :
                    (
                        <button className="btn categories__actions__btn"
                            onClick={() => setEditorActive(true)}>
                            Add Category
                        </button>
                    )
            }
        </div>
    );
}