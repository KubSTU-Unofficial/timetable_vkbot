import { readdirSync } from "fs";
import Command from "./Command.js";
import VkBot from "node-vk-bot-api";

export default class Main {
    commands:Command[] = [];
    bot = new VkBot(process.env.TOKEN!);

    constructor() {
        this.bot.startPolling(async (err) => {
            console.log(err);
        });

        this.initCommands();
    }

    async initCommands() {
        for (let dirent of readdirSync("./dist/commands/", {withFileTypes: true})) {
            if (!dirent.name.endsWith("")) continue;
        
            let commandClass = (await import("../commands/" + dirent.name)).default;
            let command:Command = new commandClass();

            this.bot.command(command.name, command.exec)
        }
    }
}