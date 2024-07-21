import { MessageContext, ContextDefaultState } from "vk-io";
import Command from "../struct/Command.js";
import Cache from "../lib/Cache.js";

export default class StartCommand extends Command {
    condition = '/test';

    async exec(msg: MessageContext<ContextDefaultState> & object) {
        let user = await Cache.getUser(msg.senderId);
        let group = user.group

        if(!group) return msg.send("Группы нет!");

        let text = await group.getTextSchedule();

        if(!text) return msg.send("Ошибка!");

        msg.send(text, {
            keyboard: user.getMainKeyboard()
        });

        return;
    }
}