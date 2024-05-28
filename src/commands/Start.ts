import Command from "../struct/Command.js";

export default class StartCommand extends Command {
    name:string = "/start";

    async exec(ctx: VkBotContext): Promise<void> {
        ctx.reply('Хелло!');
    }   
}