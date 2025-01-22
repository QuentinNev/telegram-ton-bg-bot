import dotenv from 'dotenv';
dotenv.config();

const chatFullId: string[] = (process.env.CHAT_FULL_ID || '0').split('_');
const chatId: number = parseInt(chatFullId[0]);
const treadId: number = 0;//parseInt(chatFullId.length > 1 ? chatFullId[1] : '-1');

export { chatFullId, chatId, treadId }