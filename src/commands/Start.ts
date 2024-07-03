import { MessageContext, ContextDefaultState, Context } from "vk-io";
import Command from "../struct/Command.js";
import { HearConditions } from "@vk-io/hear";

export default class StartCommand extends Command {
    condition: HearConditions<Context<object, ContextDefaultState, string, string>> = '/start';

    exec(msg: MessageContext<ContextDefaultState> & object): unknown {
        msg.send("Совершаю пространственный переход между сценами!");

        return msg.scene.enter('signup');
    }
}