'use server';

import { prisma } from "@/prismaClient";

export const createLog = async (content: string) => {
    try {
        const newLog = await prisma.log.create({
            data: {
                content,
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

export const fetchLogs = async () => {
    try {
        const logs = await prisma.log.findMany();

        await prisma.$disconnect();

        return logs;
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