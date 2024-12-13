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

import { Bot, Context, InputFile } from "grammy";

export default function test(bot: Bot<Context>) {
    bot.api.sendPhoto(
        chatId,
        new InputFile(targets[0]),
        { message_thread_id: treadId }
    );
}