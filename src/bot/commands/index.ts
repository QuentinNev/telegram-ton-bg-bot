import { Bot, Context } from 'grammy';
import { readdirSync } from 'fs';
import { join } from 'path';

export const loadCommands = (bot: Bot<Context>) => {
  const commandsPath = join(__dirname);  // Path to the commands folder

  // Read all files in the commands folder
  readdirSync(commandsPath).forEach((file) => {
    if (file !== 'index.ts') {
      const commandName = file.split('.')[0];  // Get the file name without extension

      // Import each command dynamically
      import(join(commandsPath, file)).then((commandModule) => {
        const { description, command } = commandModule;

        // Register the command description
        if (description && command) {
          bot.api.setMyCommands([{ command: commandName, description }]);

          // Execute the command function
          bot.command(commandName, command);
        }
      }).catch((error) => {
        console.error(`Error loading command ${file}:`, error);
      });
    }
  });
};
