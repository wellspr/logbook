"use server";

import { auth } from "@/auth";
import { prisma } from "@/prismaClient"

export const getUserId = async () => {
    const session = await auth();

    if (!session) {
        throw new Error('Not authenticated');
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email ?? '',
        }
    });

    await prisma.$disconnect();

    if (!user) {
        throw new Error('User not found');
    }

    const userId = user.id;

    return userId;
};