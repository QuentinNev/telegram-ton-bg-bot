import { Context } from "grammy";

export const description: string = "Claim your AKATON";
export const command = async (ctx: Context) => {
    const telegramId = ctx.from?.id;
    const reply_parameters = { reply_parameters: { message_id: ctx.message?.message_id || ctx.from?.id || 0 }, caption: '' };

    // Check if telegram Id is defined
    if (telegramId) {
        try {
            const can = await canClaim(telegramId);
            const body = JSON.stringify({ telegramId: telegramId });

            if (can) {
                const result = await fetch('https://api.shockwaves.ai/claims', {
                    method: 'POST',
                    headers: {
                        'x-api-token': process.env.SW_API_TOKEN || '',
                        'Content-Type': 'application/json'
                    },
                    body
                });

                if (result.ok) {
                    reply_parameters.caption = `You've successfully claimed your AKATON!`;
                    await ctx.replyWithVideo(`https://shockwaves-media.fra1.cdn.digitaloceanspaces.com/TON/AKATON%20GUN.mp4`, reply_parameters);
                } else {
                    console.error(`Couldn't get telegram ID`, telegramId);
                    await ctx.reply('Something went wrong claiming your AKATON', reply_parameters);
                }
            } else {
                return await ctx.reply(`Sorry, but you've already claimed your AKATON`, reply_parameters);
            }
        } catch (e) {
            console.error(`Error claiming your AKATON`, e);
            await ctx.reply('Something went wrong claiming your AKATON', reply_parameters);
        }
    } else { // This should happens, and if it does not our fault
        console.error(`Couldn't get telegram ID`, telegramId);
        await ctx.reply('Something went wrong claiming your AKATON', reply_parameters);
    }
}

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