"use server";

import { prisma } from "@/prismaClient";

export const fetchCategories = async () => {
    try {
        const categories = await prisma.category.findMany();
        await prisma.$disconnect();
        return categories;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

export const createCategory = async (name: string, userId: string) => { 
    try {
        const category = await prisma.category.create({
            data: {
                name,
                userId,
            }
        });
        await prisma.$disconnect();
        return category;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

export const updateCategory = async (id: string, name: string) => {
    try {
        const category = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name,
            }
        });
        await prisma.$disconnect();
        return category;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const category = await prisma.category.delete({
            where: {
                id,
            }
        });
        await prisma.$disconnect();
        return category;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};