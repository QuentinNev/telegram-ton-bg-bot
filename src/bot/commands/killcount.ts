import "dotenv/config.js";
import { Context } from "grammy";

const isDev: boolean = ((process.env.NODE_ENV || 'development') == "development");

const chatFullId: string[] = (process.env.CHAT_FULL_ID || '0').split('_');
const chatId: number = parseInt(chatFullId[0]);

const url = isDev ? `http://localhost:3001` : `https://api.shockwaves.ai`;

export const description: string = "Get your kill count";
export const command = async (ctx: Context) => {
    const userId = ctx.from?.id;
    const reply_parameters = { reply_parameters: { message_id: ctx.message?.message_id || ctx.from?.id || 0 }, caption: '' };
    try {
        const result = await fetch(`${url}/telegram-game?userId=${userId}&chatId=${chatId}&version=${process.env.GAME_VERSION}&limit=1`).then(res => res.json());

        if (result.length > 0) {
            await ctx.reply(`You have killed ${result[0].score} ennemies`, reply_parameters);
        } else {
            await ctx.reply('You have killed no one yet.', reply_parameters);
        }

    } catch (e) {
        console.error(`Error`, e);
        await ctx.reply('Sorry, something went wrong', reply_parameters);
    }
}