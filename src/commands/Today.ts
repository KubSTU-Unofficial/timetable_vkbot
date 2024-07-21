import { MessageContext, ContextDefaultState } from "vk-io";
import Command from "../struct/Command.js";
import User from "../struct/User.js";

export default class TodayCommand extends Command {
    names:CommandName = {
        buttons: { title: "Сегодняшнее", emoji: "⏺️" },
        command: "today"
    };

    async exec(msg: MessageContext<ContextDefaultState> & object): Promise<unknown> {
        let user:User = msg.state.user;

        if(!user.group) return;

        let text;
        let schedule = await user.group.getTextSchedule();
        let events = await user.group.getTextEvents();

        if(!schedule) text = "Расписание не найдено... или что-то пошло не так...";
        else text = schedule;

        if(events) text += `\n\n${events}`;

        msg.send(text, {
            dont_parse_links: false,
            keyboard: user.getMainKeyboard() // TODO: Убрать для групп
        });
    }
}