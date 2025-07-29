'use server';

import { prisma } from "@/prismaClient";

export const fetchLogs = async () => {
    try {
        const logs = await prisma.log.findMany({ 
            include:  {
                categories: true,
            }
        });
        await prisma.$disconnect();
        return logs;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

export const createLog = async ({content, userId}: {content: string, userId: string}) => {
    try {
        const newLog = await prisma.log.create({
            data: {
                content,
                userId,
            }
        });

        await prisma.$disconnect();

        return newLog;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

export const updateLog = async (id: string, content: string) => {
    try {
        const updatedLog = await prisma.log.update({
            where: {
                id,
            },
            data: {
                content,
            }
        });
        await prisma.$disconnect();
        return updatedLog;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

export const addCategoryToLog = async (id: string, categoryId: string) => {
    try {
        const updatedLog = await prisma.log.update({
            where: {
                id,
            },
            data: {
                categoryIds: {
                    push: categoryId
                }
            }
        });
        await prisma.$disconnect();
        return updatedLog;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

export const removeCategoryFromLog = async (id: string, categoryId: string) => {
    try {
        const log = await prisma.log.findUnique({
            where: { id },
            select: { categoryIds: true }
        });
        
        const updatedLog = await prisma.log.update({
            where: {
                id,
            },
            data: {
                categoryIds: {
                    set: log?.categoryIds.filter(cId => cId !== categoryId) || []
                }
            }
        });
        
        await prisma.$disconnect();
        return updatedLog;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }   
};

export const removeCategoriesFromLog = async (id: string, categoryIds: string[]) => {
    try {
        const log = await prisma.log.findUnique({
            where: { id },
            select: { categoryIds: true }
        });

        const updatedLog = await prisma.log.update({
            where: {
                id,
            },
            data: {
                categoryIds: {
                    set: log?.categoryIds.filter(cId => !categoryIds.includes(cId)) || []
                }
            }
        });

        await prisma.$disconnect();
        return updatedLog;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

export const deleteLog = async (id: string) => {
    try {
        const deletedLog = await prisma.log.delete({
            where: {
                id,
            }
        });
        await prisma.$disconnect();
        return deletedLog;

    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};