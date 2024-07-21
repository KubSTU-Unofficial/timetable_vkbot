import { MessageContext, ContextDefaultState } from "vk-io";
import Command from "../struct/Command.js";

export default class StartCommand extends Command {
    condition = '/start';

    exec(msg: MessageContext<ContextDefaultState> & object): unknown {
        if(msg.state.user.group) {
            return msg.send("Приветствую!", msg.state.user.getMainKeyboard());
        }
        msg.send("Приветствую! Для работы мне нужно немного информации");

        return msg.scene.enter('signup');
    }
}