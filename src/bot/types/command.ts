/**
 * @typedef {Object} Command A Telegram bot command
 * @property {string} description - A brief description of the command.
 * @property {() => void} function - The function the command will execute. 
 * @property {boolean} public - Indicates if the command is publicly accessible.
 */
type Command = {
    description: string;
    function: () => void;
    public: boolean
}

export default Command;