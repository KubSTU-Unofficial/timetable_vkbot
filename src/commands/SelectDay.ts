import { MessageContext, ContextDefaultState } from "vk-io";
import Command from "../struct/Command.js";

export default class StartCommand extends Command {
    names = { buttons: { title: "Выбрать день", emoji: "🔀" } };

    exec(msg: MessageContext<ContextDefaultState> & object): unknown {
        return msg.scene.enter('daySelector');
    }
}