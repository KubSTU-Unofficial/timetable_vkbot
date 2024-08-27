import APIConvertor from '../shared/lib/APIConvertor.js';
import { days, weekNumber } from '../shared/lib/Utils.js';
import BaseGroup from '../shared/structures/Group.js';
import EventsModel from '../shared/models/EventsModel.js';
import { IRespOFOPara } from '../shared/lib/APIConvertor.js';
// import ExamsModel from "../models/ExamsModel.js";

let space = '&#12288;';

/*
formatSchedule(lessons:IRespOFOPara[], date = new Date()): string
getTextSchedule(date = new Date(), opts:{showDate?: boolean} = {}): Promise<string>
getTextFullSchedule(week: boolean, startDate: Date): Promise<string | null>
getTextExams(): Promise<string>
getTextEvents(date = new Date()): Promise<string | null>
*/

export default class Group extends BaseGroup {
    formatSchedule(lessons: IRespOFOPara[], date = new Date()) {
        let out = '';
        let para = '';
        let weekNum = date ? weekNumber(date) : null;

        lessons.forEach((elm) => {
            para += `\n\n${elm.pair} пара: ${elm.disc.disc_name} [${Group.lessonsTypes[elm.kindofnagr.kindofnagr_name]}]\n${space}Время: ${Group.lessonsTime[elm.pair]}`;
            if (elm.teacher) para += `\n${space}Преподаватель: ${elm.teacher}`;
            if (elm.classroom) para += `\n${space}Аудитория: ${elm.classroom}`;
            if (elm.persent_of_gr != 100) para += `\n${space}Процент группы: ${elm.persent_of_gr}%`;
            if (elm.ispotok) para += `\n${space}В лекционном потоке`;
            if (elm.ned_from != 1 || elm.ned_to != 18) para += `\n${space}Период: c ${elm.ned_from} по ${elm.ned_to} неделю`;
            if (elm.comment) para += `\n${space}Примечание: ${elm.comment}`;

            if (weekNum && (elm.ned_from > weekNum || elm.ned_to < weekNum)) para = `${para}`;

            out += para;
            para = '';
        });

        return out;
    }

    async getTextSchedule(date = new Date(), opts: { showDate?: boolean } = {}) {
        let day = date.getDay();
        let week = date.getWeek() % 2 == 0;
        let lessons = await this.getDayRawSchedule(day, week);

        if (!lessons) return 'Во время получения расписания произошла ошибка!\nВозможно стоит обратиться в [поддержку|https://t.me/Elektroplayer]';

        let text = this.formatSchedule(lessons, date);

        return (
            `${days[day]} / ${week ? 'Чётная' : 'Нечётная'} неделя` +
            (opts.showDate ? ` / ${date.stringDate()}` : '') +
            `` +
            (!text ? '\nПар нет! Передохни:з' : text)
        );
    }

    async getTextFullSchedule(week: boolean, startDate: Date) {
        let schedule = await this.getFullRawSchedule();
        let num = weekNumber(startDate);
        let out = '';

        let dict: { [index: string]: string } = {
            Лекции: 'Лек',
            'Практические занятия': 'Прак',
            'Лабораторные занятия': 'Лаб',
        };

        if (schedule == null || schedule == undefined)
            return 'Во время получения расписания произошла ошибка!\nВозможно стоит обратиться в [поддержку|https://t.me/Elektroplayer]';

        out += `${week ? 'ЧЁТНАЯ' : 'НЕЧЁТНАЯ'} НЕДЕЛЯ${num ? ` | №${num}` : ''}:\n`;

        if (!schedule.length) return out + 'Здесь ничего нет...';

        let currWeekLessons: IRespOFOPara[] = schedule.filter((elm) => elm.nedtype.nedtype_id == (week ? 2 : 1));

        for (let i = 0; i < 7; i++) {
            let curDayLessons = currWeekLessons.filter((p) => p.dayofweek.dayofweek_id == i);

            startDate.setDate(startDate.getDate() + 1);

            if (curDayLessons.length) {
                out += `\n${days[i]} | ${startDate.stringDate()}, ${Group.lessonsTime[curDayLessons[0].pair].split(' - ')[0]} - ${Group.lessonsTime[curDayLessons[curDayLessons.length - 1].pair].split(' - ')[1]}\n`;

                curDayLessons.forEach((lesson) => {
                    out += `  ${lesson.pair}. ${lesson.disc.disc_name} [${dict[lesson.kindofnagr.kindofnagr_name] ?? lesson.kindofnagr.kindofnagr_name}] (${lesson.classroom})\n`;
                });
            }
        }

        return out;
    }

    async getTextExams() {
        let date = new Date();
        let ugod = date.getFullYear() - (date.getMonth() >= 6 ? 0 : 1);
        let sem = date.getMonth() > 5 ? 1 : 2;

        // TODO: Вынести в отдельный метод с получением из БД
        let resp = await APIConvertor.exam(this.name, ugod, sem);

        if (!resp || !resp.isok)
            return 'Во время получения расписания произошла ошибка!\nВозможно стоит обратиться в [поддержку|https://t.me/Elektroplayer]';
        if (!resp.data.length) return `У меня нет расписания экзаменов для твоей группы...`;

        let examsText = resp.data.reduce(
            (acc, x) =>
                acc +
                `${x.time_sd.substring(0, x.time_sd.length - 3)} ${x.date_sd} / ${x.disc.disc_name}\n  Преподаватель: ${x.teacher}\n  Аудитория: ${x.classroom}\n\n`,
            '',
        );

        return `РАСПИСАНИЕ ЭКЗАМЕНОВ\n\n${examsText}`;
    }

    async getTextEvents(date = new Date()): Promise<string | null> {
        date.setUTCHours(0, 0, 0, 0);

        // События ищутся так, чтобы они или совпадали по дате или были между начальной конечной датой,
        // при этом если у события есть список групп, курсов или институтов, для которых предназначается событие,
        // то группе, под эти критерии не подходящей, событие показываться не будет.
        let filter = {
            $or: [
                {
                    date: date,
                },
                {
                    startDate: { $lte: date },
                    endDate: { $gte: date },
                },
            ],
            $and: [
                {
                    $or: [{ groups: undefined }, { groups: this.name }],
                },
                {
                    $or: [{ kurses: undefined }, { kurses: this.kurs }],
                },
                {
                    $or: [{ inst_ids: undefined }, { inst_ids: this.instId }],
                },
            ],
        };

        let dayEvents = await EventsModel.find(filter);
        let out = dayEvents.reduce(
            (acc, elm, i) => acc + `\n\n${i + 1}. ${elm.name}` + (elm.note ? `\n  ${elm.note.replace('\n', '\n  ')}` : ''),
            '',
        );

        return out ? 'СОБЫТИЯ:' + out : null;
    }
}
