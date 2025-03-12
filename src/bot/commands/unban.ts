import "dotenv/config.js";
import { Context } from "grammy";
import isModerator from "../utils/modertators";
import Command from "../types/command";

const command: Command = {
    public: false,
    description: "Unban a user",
    command: async (ctx: Context) => {
        if (!await isModerator(ctx)) return;
        if (!ctx.message?.reply_to_message) return;
        const target = {
            id: ctx.message.reply_to_message.from?.id,
            username: ctx.message.reply_to_message.from?.username
        }

        // TODO : Unban user

        await ctx.reply(`Unbanned ${target.username}`);
    }
}

export default command;