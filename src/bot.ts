import "dotenv/config.js";

const isProd = process.env.NODE_ENV === "production";
import { Bot, Context, Keyboard, InlineKeyboard } from 'grammy';

const bot = new Bot<Context>(process.env.TELEGRAM_BOT_TOKEN || ``);

bot.api.setMyCommands([{ command: "claim", description: "Claim your AKATON" }]);

bot.command('claim', async (ctx) => {
    const telegramId = ctx.from?.id;

    // Check if telegram Id is defined
    if (telegramId) {
        try {
            const can = await canClaim(telegramId);
            const body = JSON.stringify({ telegramId: telegramId });

            if (can) {
                const result = await fetch('https://api.shockwaves.ai/claims', {
                    method: 'POST',
                    headers: {
                        'x-api-token': 'e3dec941734b967b8ee2f4855c271a19',
                        'Content-Type':'application/json'
                    },
                    body
                });

                if (result.ok) {
                    await ctx.reply(`You've successfully claimed your AKATON!`);
                } else {
                    console.error(`Couldn't get telegram ID`, telegramId);
                    await ctx.reply('Something went wrong claiming your AKATON');
                }
            } else {
                return await ctx.reply(`You've already claimed your AKATON!`);
            }
        } catch (e) {
            console.error(`Error claiming your AKATON`, e);
            await ctx.reply('Something went wrong claiming your AKATON');
        }
    } else { // This should happens, and if it does not our fault
        console.error(`Couldn't get telegram ID`, telegramId);
        await ctx.reply('Something went wrong claiming your AKATON');
    }

})

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

// private functions
/**
 * canClaim
 * @param telegramId Telegran user to check AKATON claim status
 * @returns boolean
 */
const canClaim = async (telegramId: number) => {
    const result = await fetch(`https://api.shockwaves.ai/claims?telegramId=${telegramId}&limit=1`, {
        method: 'GET'
    }).then(async res => {
        if (res.ok) return await res.json();
        else return null;
    });

    return result && result.length === 0;
}