"use server";

import { signIn, signOut } from "@/auth";

export const signUserOut = async () => {
    await signOut();
};

export const signUserIn = async () => {
    await signIn("github");
};