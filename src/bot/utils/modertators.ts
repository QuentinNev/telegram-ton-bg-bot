import { Context } from "grammy";
import { ChatMemberAdministrator, ChatMemberOwner } from "grammy/types";

/**
 * Return a list of all moderators. (In telegram, there's only normal user, admins and admins with less privileges)
 * @param ctx Context of the command
 * @returns {Promise<(ChatMemberOwner | ChatMemberAdministrator)[]>} list of all moderators
 */
export async function getModerators(ctx: Context): Promise<(ChatMemberOwner | ChatMemberAdministrator)[]> {
    return await ctx.getChatAdministrators();
}

/**
 * Check if user is a moderator
 * @param ctx Context of the command
 * @returns {Promise<boolean>} if user is moderator
 */
export default async function isModerator(ctx: Context): Promise<boolean> {
    const mods = await getModerators(ctx);
    return mods.some(mod => mod.user.id == ctx.from?.id);
}