import "./categoriesDatalist.scss";
import { Category } from "@prisma/client";
import { RefObject } from "react";

interface CategoriesDatalist {
    showDatalist: boolean;
    categories: Category[] | undefined;
    ref: RefObject<HTMLDivElement | null>;
    onClickAction: (category: Category) => void;
}

export const CategoriesDatalist = (props: CategoriesDatalist) => {

    const { showDatalist, categories, ref, onClickAction } = props;

    if (!showDatalist) return null;
    if (!categories || categories.length === 0) return null;

    return (
        <div ref={ref} className="categories-datalist">
            {
                categories.map(category => {
                    return (
                        <button key={category.id}
                            className="btn categories-datalist__btn"
                            onClick={() => onClickAction(category)}>
                            {category.name}
                        </button>
                    )
                })
            }
        </div>
    );
};