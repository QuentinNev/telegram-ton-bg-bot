import { Bot, Context } from 'grammy';
import { readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

export const loadCommands = (bot: Bot<Context>) => {
  const commandsPath = join(__dirname);  // Path to the commands folder

  // Read all files in the commands folder
  readdirSync(commandsPath).forEach((file) => {
    if (file !== 'index.ts') {
      const commandName = file.split('.')[0];  // Get the file name without extension

      // Convert the file path to a URL
      const filePath = join(commandsPath, file);
      const fileURL = `file://${filePath}`;

      // Import each command dynamically using the file URL
      import(fileURL).then((commandModule) => {
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
