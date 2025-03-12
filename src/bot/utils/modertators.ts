import { Context } from "grammy";

/**
 * Return a list of all moderators. (In telegram, there's only normal user, admins and admins with less privileges)
 * @param ctx Context of the command
 * @returns list of all moderators
 */
export async function getModerators(ctx: Context) {
    return await ctx.getChatAdministrators();
}

/**
 * Check if user is a moderator
 * @param ctx Context of the command
 * @returns 
 */
export default async function isModerator(ctx: Context) {
    const mods = await getModerators(ctx);
    return mods.some(mod => mod.user.id == ctx.from?.id);
}