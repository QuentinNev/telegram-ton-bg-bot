import "dotenv/config.js";

import { Bot, Context, InlineKeyboard } from 'grammy';
import { loadCommands } from "./commands";
import { chatId, treadId } from "./utils/getChatId";

import getRandomPhoto from "./utils/getRandomPhoto";
import { CronJob } from "cron";

const bot = new Bot<Context>(process.env.TELEGRAM_BOT_TOKEN || ``);

loadCommands(bot);

const handleGracefulShutdown = async () => {
    await bot.stop();
    process.exit();
};

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
    new CronJob('* 10,22 * * *', () => {
        bot.api.sendPhoto(chatId, getRandomPhoto(), {
            reply_markup: new InlineKeyboard().url("🚁 Play 🪂", `https://t.me/TON_BATTLEGROUND_bot?startapp`),
            message_thread_id: treadId
        });
    }).start();
}