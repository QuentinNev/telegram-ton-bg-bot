import { Context } from "grammy";

/**
 * @typedef {Object} Command A Telegram bot command
 * @property {string} description - A brief description of the command.
 * @property {(ctx: Context) => any | Promise<any>} command - The function the command will execute. 
 * @property {boolean} public - Indicates if the command is publicly accessible.
 */
type Command = {
    description: string;
    command: (ctx: Context) => any | Promise<any>;
    public: boolean
}

export default Command;