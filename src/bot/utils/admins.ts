import { Context } from "grammy";
import { ChatMemberAdministrator, ChatMemberOwner } from "grammy/types";

/**
 * Return a list of all moderators. (In telegram, there's only normal user, admins and admins with less privileges)
 * @param ctx Context of the command
 * @returns {Promise<(ChatMemberOwner | ChatMemberAdministrator)[]>} list of all moderators
 */
export async function getAdmin(ctx: Context) : Promise<(ChatMemberOwner | ChatMemberAdministrator)[]> {
    return await ctx.getChatAdministrators();
}

/**
 * Check if user is an administrator
 * @param ctx Context of the command
 * @returns {Promise<boolean>} 
 */
export default async function isAdmin(ctx: Context): Promise<boolean> {
    const mods = await getAdmin(ctx);
    return mods.some(mod => mod.user.id == ctx.from?.id);
}