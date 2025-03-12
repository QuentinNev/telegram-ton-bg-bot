import { Bot, Context } from 'grammy';
import { readdirSync } from 'fs';
import { join } from 'path';
import Command from '../types/command';

export const loadCommands = async (bot: Bot<Context>) => {
  const commandsPath = join(__dirname);  // Path to the commands folder
  const commands: any[] = [];

  // Read all files in the commands folder
  const files = readdirSync(commandsPath);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file !== 'index.ts') {
      const commandName = file.split('.')[0];  // Get the file name without extension

      // Convert the file path to a URL
      const filePath = join(commandsPath, file);
      const fileURL = `file://${filePath}`;

      // Import each command dynamically using the file URL
      await import(fileURL).then((module) => {
        const commandModule: Command = module.default.default;
        console.log("desc", commandModule)

        commands.push({ command: commandName, description: commandModule.description });
        if (commandModule.public) bot.command(commandName, commandModule.command);
      }).catch((error) => {
        console.error(`Error loading command ${file}:`, error);
      });
    }
  }

  console.log(commands)
  bot.api.setMyCommands(commands);
};
