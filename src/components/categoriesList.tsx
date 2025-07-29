import "./categoriesList.scss";
import { Category } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface CategoriesList {
    categories: Category[];
    categoriesToRemove: string[];
    setCategoriesToRemove: Dispatch<SetStateAction<string[]>>
    editMode: boolean
}

export const CategoriesList = (props: CategoriesList) => {

    const {categories, categoriesToRemove, setCategoriesToRemove, editMode} = props;

    return (
        <div className="categories__list">
            {
                categories
                    .filter(category => !categoriesToRemove.includes(category.id))
                    .map(category => (
                        <div key={category.id} className="categories__list__item">
                            {category.name}
                            {
                                editMode && (
                                    <button
                                        className="btn categories__list__item__btn categories__list__item__btn--remove"
                                        onClick={() => setCategoriesToRemove([...categoriesToRemove, category.id])}
                                    >
                                        X
                                    </button>
                                )
                            }
                        </div>
                    ))
            }
        </div>
    );
};