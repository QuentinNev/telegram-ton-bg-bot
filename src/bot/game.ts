import "dotenv/config.js";
const chatFullId: string[] = (process.env.CHAT_FULL_ID || '0').split('_');
const chatId: number = parseInt(chatFullId[0]);
const treadId: number = parseInt(chatFullId.length > 1 ? chatFullId[1] : '-1');

import { readdirSync } from 'fs';
import { join } from 'path';

const targetsDir: string = join(__dirname, '../../public/targets');
const successesDir: string = join(__dirname, '../../public/success');

const targets = readdirSync(targetsDir).filter(file =>
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
).map(file => join(targetsDir, file));;

const successes = readdirSync(successesDir).filter(file =>
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
).map(file => join(successesDir, file));

import { Bot, Context, InlineKeyboard, InputFile } from "grammy";

export default function startGame(bot: Bot<Context>) {
    spawnEnemy(bot);

    bot.callbackQuery('pew', async (ctx: Context) => {
        if (ctx.update.callback_query?.message?.message_id) {
            await bot.api.deleteMessage(chatId, ctx.update.callback_query.message?.message_id);
            killEnemy(bot);
        }

        if (ctx.update.callback_query?.message?.message_thread_id) {
            await bot.api.deleteMessage(chatId, ctx.update.callback_query?.message?.message_thread_id);
            killEnemy(bot);
        }
    })
}

function spawnEnemy(bot: Bot<Context>) {
    bot.api.sendPhoto(
        chatId,
        new InputFile(targets[Math.floor(Math.random() * targets.length)]),
        {
            message_thread_id: treadId,
            caption: 'KILL KILL KILL',
            reply_markup: new InlineKeyboard().text('PEW', "pew")
        }
    );
}

function killEnemy(bot: Bot<Context>) {
    bot.api.sendPhoto(
        chatId,
        new InputFile(successes[Math.floor(Math.random() * targets.length)]),
        {
            message_thread_id: treadId,
            caption: 'You got him!',
        }
    );

    setTimeout(() => {
        spawnEnemy(bot);
    }, 1000);
}