import { MessageContext, ContextDefaultState } from "vk-io";
import Command from "../struct/Command.js";
import User from "../struct/User.js";

export default class TomorrowCommand extends Command {
    names:CommandName = {
        buttons: { title: "Завтрашнее", emoji: "▶️" },
        command: "tomorrow"
    };

    async exec(msg: MessageContext<ContextDefaultState> & object): Promise<unknown> {
        let user:User = msg.state.user;

        if(!user.group) return; // TODO: Выводить ошибку

        let date = new Date();
        date.setDate(date.getDate() + 1);

        let text;
        let schedule = await user.group.getTextSchedule(date);
        let events = await user.group.getTextEvents(date);

        if(!schedule) text = "Расписание не найдено... или что-то пошло не так...";
        else text = schedule;

        if(events) text += `\n\n${events}`;

        msg.send(text, {
            dont_parse_links: false,
            keyboard: user.getMainKeyboard() // TODO: Убрать для групп
        });
    }
}