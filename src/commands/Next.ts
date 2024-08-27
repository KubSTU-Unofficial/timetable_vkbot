import { MessageContext, ContextDefaultState } from 'vk-io';
import Command from '../struct/Command.js';
import User from '../struct/User.js';
import { days } from '../shared/lib/Utils.js';
import { IRespOFOPara } from '../shared/lib/APIConvertor.js';

export default class NextCommand extends Command {
    names: CommandName = {
        buttons: { title: 'Ближайшее', emoji: '⏩' },
        command: 'nearest',
    };

    async exec(msg: MessageContext<ContextDefaultState> & object): Promise<unknown> {
        let user: User = msg.state.user;

        if (!user.group) return;

        let date = new Date();
        let fullRawSchedule = await user.group.getFullRawSchedule();

        if (!fullRawSchedule || !fullRawSchedule.length) return msg.send('Ближайшего расписания не найдено... или что-то пошло не так...');

        let day: number = 0,
            week: boolean = true,
            schedule: IRespOFOPara[] = [],
            eventsText: string | null = null;

        for (let i = 0; i <= 14; i++) {
            day = date.getDay();
            week = date.getWeek() % 2 == 0;
            schedule = fullRawSchedule.filter((p) => p.nedtype.nedtype_id == (week ? 2 : 1) && p.dayofweek.dayofweek_id == day);
            eventsText = await user.group.getTextEvents(date);

            if (schedule.length || eventsText) break;
            else date.setDate(date.getDate() + 1);
        }

        if (!schedule.length && !eventsText) return msg.send('Ближайшего расписания не найдено... или что-то пошло не так...');

        let textSchedule = user.group.formatSchedule(schedule, date);

        let text =
            `${days[day]} / ${week ? 'Чётная' : 'Нечётная'} неделя` +
            (!textSchedule ? '\nПар нет! Передохни:з' : textSchedule) +
            (eventsText ? `\n\n${eventsText}` : '');

        msg.send(text);
    }
}
