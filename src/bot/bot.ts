import "dotenv/config.js";

import { Bot, Context } from 'grammy';
import { loadCommands } from "./commands";

const bot = new Bot<Context>(process.env.TELEGRAM_BOT_TOKEN || ``);

loadCommands(bot);

const handleGracefulShutdown = async () => {
    await bot.stop();
    process.exit();
};

if (process.env.NODE_ENV === "development") {
    // Graceful shutdown handlers
    process.once("SIGTERM", handleGracefulShutdown);
    process.once("SIGINT", handleGracefulShutdown);
}

export const startBot = async () => {
    if (bot.isInited()) {
        await bot.stop();
    }

    await bot.start();
};

export default bot;