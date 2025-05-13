import dotenv from 'dotenv';
dotenv.config();

import { Bot, Context, InlineKeyboard } from 'grammy';
import { loadCommands } from "./commands";
import { chatId, treadId } from "./utils/getChatId";

import getRandomPhoto from "./utils/getRandomPhoto";
import { CronJob } from "cron";
console.log('Bot token', process.env.TELEGRAM_BOT_TOKEN)
const bot = new Bot<Context>(process.env.TELEGRAM_BOT_TOKEN || ``);
const apiToken = process.env.SW_API_TOKEN || ``;

loadCommands(bot);

const handleGracefulShutdown = async () => {
    await bot.stop();
    process.exit();
};

bot.on("message", async (ctx) => {
    console.log(`${ctx.from.username} said something!`)
    await fetch(`https://data.tonbg.com/users/${ctx.from.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'x-api-token': apiToken
        },
        body: JSON.stringify({ inTG: true })
    });
    console.log(`added ${ctx.from.first_name} to inTG!`)
});

bot.on("message:new_chat_members", async (ctx) => {
    const newMembers = ctx.message.new_chat_members;

    // Get existing users
    const existing: any[] = await fetch(`https://data.tonbg.com/users?telegramId=${newMembers.join(',')}`).then(res => res.json());

    for (const user of newMembers) {
        // If user is not found in db, create it before updating (because flemme d'update la POST route)
        if (!existing.some(ex => ex.id === user.id)) {
            await fetch(`https://data.tonbg.com/users/${user.id}`, {
                method: 'POST',
                headers: {
                    'Context-Type': 'application/json',
                    'x-api-token': apiToken
                },
                body: JSON.stringify({
                    username: user.username,
                    nickname: user.first_name
                })
            });
        }

        await fetch(`https://data.tonbg.com/users/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Context-Type': 'application/json',
                'x-api-token': apiToken
            },
            body: JSON.stringify({ inTG: true })
        });
    }
});

bot.on("message:left_chat_member", async (ctx) => {
    const user = ctx.message.left_chat_member;

    await fetch(`https://data.tonbg.com/users/${user.id}`, {
        method: 'PATCH',
        headers: {
            'Context-Type': 'application/json',
            'x-api-token': apiToken
        },
        body: JSON.stringify({ inTG: false })
    });
});

bot.catch((e) => {
    console.log("Error", e);
})

if (process.env.NODE_ENV === "development") {
    // Graceful shutdown handlers
    process.once("SIGTERM", handleGracefulShutdown);
    process.once("SIGINT", handleGracefulShutdown);
}

export const startBot = async () => {
    if (bot.isInited()) {
        await bot.stop();
    }
    cron();
    await bot.start();
};

export default bot;

export async function cron() {
    new CronJob('0 0,8,16 * * *', () => {
        bot.api.sendPhoto(chatId, getRandomPhoto(), {
            reply_markup: new InlineKeyboard().url("🚁 Play 🪂", `https://t.me/TON_BATTLEGROUND_bot?startapp`),
            message_thread_id: treadId
        });
    }).start();
}