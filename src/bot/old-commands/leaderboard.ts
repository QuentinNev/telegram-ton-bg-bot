import "dotenv/config.js";
import { Context } from "grammy";

const isDev: boolean = ((process.env.NODE_ENV || 'development') == "development");

import { chatId } from "../utils/getChatId";

const url = isDev ? `http://localhost:3001` : `https://api.shockwaves.ai`;

export const description: string = "Get kill count leaderboard";
export const command = async (ctx: Context) => {
    const reply_parameters = {
        reply_parameters: { message_id: ctx.message?.message_id || ctx.from?.id || 0 },
        caption: ''
    };

    try {
        const results = await fetch(`${url}/telegram-game?chatId=${chatId}&version=${process.env.GAME_VERSION}&limit=10`).then(res => res.json());
        results.sort((a: any, b: any) => b.score - a.score);

        let text: string = `🏆 Leaderboard 🏆\n`

        for (let i = 0; i < results.length; i++) {
            const user = await ctx.api.getChatMember(chatId, results[i].userId);
            const username = user.user.first_name ? user.user.first_name : user.user.username;

            text += `\n`;

            if (i === 0) text += `🥇 ${username}`;
            else if (i === 1) text += `🥈 ${username}`;
            else if (i === 2) text += `🥉 ${username}`;
            else text += `🎯 ${username}`;

            text += ` : ${results[i].score}`;
        }

        await ctx.reply(text, reply_parameters);
    } catch (e) {
        console.error(`Error`, e);
        await ctx.reply('Sorry, something went wrong', reply_parameters);
    }
}