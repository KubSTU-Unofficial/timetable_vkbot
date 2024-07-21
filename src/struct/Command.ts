import { Context, ContextDefaultState, MessageContext } from "vk-io";
import { HearConditions } from "@vk-io/hear";

export default abstract class Command {
    condition?: HearConditions<Context<object, ContextDefaultState, string, string>>;
    names?: CommandName = undefined;

    abstract exec(msg: MessageContext<ContextDefaultState> & object, next: () => Promise<unknown>):unknown;

    static commandName(opts: CommandName) {
        let arr = [];
    
        if(opts.buttons) {
            if(Array.isArray(opts.buttons)) {
                opts.buttons.forEach(elm => {
                    if(typeof elm == "string") arr.push(elm);
                    else {
                        arr.push(elm.title);
                        if(elm.emoji) arr.push(`${elm.emoji} ${elm.title}`);
                    }
                });
            } else {
                if(typeof opts.buttons == "string") arr.push(opts.buttons);
                else {
                    arr.push(opts.buttons.title);
                    if(opts.buttons.emoji) arr.push(`${opts.buttons.emoji} ${opts.buttons.title}`);
                }
            }
        }
    
        if(opts.command) arr.push(`/${opts.command}`);
    
        return arr;
    }

    getCommandsName() {
        if(this.condition) return this.condition
        else if(this.names) return Command.commandName(this.names);
        else throw Error('Команда не имеет имени!');
    }
}