export default abstract class Command {
    abstract name: string;

    abstract exec(ctx: VkBotContext): Promise<void>;
}