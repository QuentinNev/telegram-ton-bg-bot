import "dotenv/config.js";
import { Context } from "grammy";

const isDev: boolean = ((process.env.NODE_ENV || 'development') == "development");

const chatFullId: string[] = (process.env.CHAT_FULL_ID || '0').split('_');
const chatId: number = parseInt(chatFullId[0]);

const url = isDev ? `http://localhost:3001` : `https://api.shockwaves.ai`;

export const description: string = "Request your access to TON Battleground alpha";
export const command = async (ctx: Context) => {
    const reply_parameters = {
        reply_parameters: { message_id: ctx.message?.message_id || ctx.from?.id || 0 },
        caption: ''
    };

    try {
        const body = JSON.stringify({
            userId: ctx.from?.id,
            username: ctx.from?.username,
            firstname: ctx.from?.first_name,
            gameId: 4
        });

        let message: string = '';

        const response = await fetch(`${url}/whitelist/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-token': process.env.SW_API_TOKEN || ''
            },
            body
        }).then(res => {
            if (res.ok) {
                message = `You've been successfully whitelisted`
            } else {
                message = `Yo're already whitelisted`
            }
        });


        await ctx.reply(
            message,
            reply_parameters
        );
    } catch (e) {
        console.error(`Error`, e);
        await ctx.reply('Sorry, something went wrong', reply_parameters);
    }
}