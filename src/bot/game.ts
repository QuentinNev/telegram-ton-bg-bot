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
            await updateScore(ctx);
            killEnemy(bot);
        }

        if (ctx.update.callback_query?.message?.message_thread_id) {
            await bot.api.deleteMessage(chatId, ctx.update.callback_query?.message?.message_thread_id);
            await updateScore(ctx);
            killEnemy(bot);
        }
    })
}

function spawnEnemy(bot: Bot<Context>) {
    const image = targets[Math.floor(Math.random() * targets.length)];
    bot.api.sendPhoto(
        chatId,
        new InputFile(image),
        {
            message_thread_id: treadId,
            caption: 'KILL KILL KILL',
            reply_markup: new InlineKeyboard().text('PEW', "pew")
        }
    );
}

function killEnemy(bot: Bot<Context>) {
    const image = successes[Math.floor(Math.random() * successes.length)];
    bot.api.sendPhoto(
        chatId,
        new InputFile(image),
        {
            message_thread_id: treadId,
            caption: 'You got him!',
        }
    );

    setTimeout(() => {
        spawnEnemy(bot);
    }, 1000);
}

const url: string = (process.env.NODE_ENV || 'development' == "development") ? 'http://localhost:3001' : 'https://api.shockwaves.ai'

async function updateScore(ctx: Context) {
    const userId = ctx.update.callback_query?.from.id;

    const body = JSON.stringify({
        userId,
        chatId,
        version: process.env.GAME_VERSION
    })

    const response = await fetch(`${url}/telegram-game/add_points`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-token': process.env.SW_API_TOKEN || ''
        },
        body
    }).then(res => res.json());

    console.log("Response", response);
}