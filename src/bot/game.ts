import "dotenv/config.js";
import storage from 'node-persist';

const isDev: boolean = ((process.env.NODE_ENV || 'development') == "development");

const chatFullId: string[] = (process.env.CHAT_FULL_ID || '0').split('_');
const chatId: number = parseInt(chatFullId[0]);
const treadId: number = 0;//parseInt(chatFullId.length > 1 ? chatFullId[1] : '-1');

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

export default async function startGame(bot: Bot<Context>) {
    await storage.init();
    const nextSpawn = await storage.get('next-spawn');
    const currentEnemy = await storage.get('current-enemy');

    if ((!nextSpawn && !currentEnemy) || isDev) spawnEnemy(bot);
    if (nextSpawn) {
        setTimeout(() => {
            spawnEnemy(bot);
        }, nextSpawn - Date.now());
    }

    bot.callbackQuery('pew', async (ctx: Context) => {
        if (ctx.update.callback_query?.message?.message_id) {
            killEnemy(bot, ctx, ctx.update.callback_query?.message?.message_id);
        }

        if (ctx.update.callback_query?.message?.message_thread_id) {
            killEnemy(bot, ctx, ctx.update.callback_query?.message?.message_thread_id);
        }
    });
}

async function spawnEnemy(bot: Bot<Context>) {
    await storage.set('next-spawn', undefined);
    const image = targets[Math.floor(Math.random() * targets.length)];
    const msg = await bot.api.sendPhoto(
        chatId,
        new InputFile(image),
        {
            message_thread_id: treadId,
            caption: 'Contact! Open fire!',
            reply_markup: new InlineKeyboard().text('FIRE', "pew")
        }
    );

    await storage.set('current-enemy', msg.message_id);
}

async function killEnemy(bot: Bot<Context>, ctx: Context, message_id: number) {
    await bot.api.deleteMessage(chatId, message_id);
    await storage.set('current-enemy', undefined);
    const data = await updateScore(ctx);

    const image = successes[Math.floor(Math.random() * successes.length)];
    bot.api.sendPhoto(
        chatId,
        new InputFile(image),
        {
            message_thread_id: treadId,
            caption: `${ctx.from?.first_name || ctx.from?.username} killed the enemy!\nCurrent kill count : ${data.score}`,
        }
    );

    const baseDelay = 24 * 60 * 60 * 1000;
    const userCount = await bot.api.getChatMemberCount(chatId);
    const freq = 3 + (Math.floor(userCount / 100));
    const delay = (baseDelay / freq);

    const nextSpawn = Date.now() + delay;
    storage.set("next-spawn", nextSpawn);

    setTimeout(() => {
        spawnEnemy(bot);
    }, delay);
}

const url: string = isDev ? 'http://localhost:3001' : 'https://api.shockwaves.ai'

async function updateScore(ctx: Context) {
    const userId = ctx.update.callback_query?.from.id;

    const body = JSON.stringify({
        userId,
        chatId,
        version: process.env.GAME_VERSION
    })

    return await fetch(`${url}/telegram-game/add_points`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-token': process.env.SW_API_TOKEN || ''
        },
        body
    }).then(res => res.json());
}