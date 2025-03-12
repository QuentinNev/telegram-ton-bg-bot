import "dotenv/config.js";
import { Context } from "grammy";
import isModerator from "../utils/modertators";

export const description: string = "Hard ban a user";
export const command = async (ctx: Context) => {
    if (!await isModerator(ctx)) return;
    if (!ctx.message?.reply_to_message) return;
    const target = {
        id: ctx.message.reply_to_message.from?.id,
        username: ctx.message.reply_to_message.from?.username
    }

    // TODO : Hard ban user

    await ctx.reply(`Hard banned ${target.username}`);
}