import "dotenv/config.js";
import storage from 'node-persist';

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

export default async function startGame(bot: Bot<Context>) {
    await storage.init();
    const nextSpawn = await storage.get('next-spawn');
    const currentEnemy = await storage.get('current-enemy');

    if (!nextSpawn && !currentEnemy) spawnEnemy(bot);
    if (nextSpawn) {
        console.log(`nextSpawn is due in ${(nextSpawn - Date.now()) / 1000} seconds`)
        setTimeout(() => {
            spawnEnemy(bot);
        }, nextSpawn - Date.now());
    }

    bot.callbackQuery('pew', async (ctx: Context) => {
        if (ctx.update.callback_query?.message?.message_id) {
            killEnemy(bot, ctx.update.callback_query?.message?.message_id);
        }

        if (ctx.update.callback_query?.message?.message_thread_id) {
            killEnemy(bot, ctx.update.callback_query?.message?.message_thread_id);
        }

        await updateScore(ctx);
    })
}

async function spawnEnemy(bot: Bot<Context>) {
    await storage.set('next-spawn', undefined);
    const image = targets[Math.floor(Math.random() * targets.length)];
    const msg = await bot.api.sendPhoto(
        chatId,
        new InputFile(image),
        {
            message_thread_id: treadId,
            caption: 'KILL KILL KILL',
            reply_markup: new InlineKeyboard().text('PEW', "pew")
        }
    );

    await storage.set('current-enemy', msg.message_id);
}

async function killEnemy(bot: Bot<Context>, message_id: number) {
    await bot.api.deleteMessage(chatId, message_id);
    await storage.set('current-enemy', undefined);

    const image = successes[Math.floor(Math.random() * successes.length)];
    bot.api.sendPhoto(
        chatId,
        new InputFile(image),
        {
            message_thread_id: treadId,
            caption: 'You got him!',
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
}