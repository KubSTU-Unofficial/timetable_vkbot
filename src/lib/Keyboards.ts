import { Keyboard } from "vk-io";
import { daysOdd, daysEven } from "../shared/lib/Utils.js";

export const institutes = Keyboard.builder().textButton({
    label: 'ИНГиЭ',
    payload: { id: 495 }
}).textButton({
    label: 'ИКСиИБ',
    payload: { id: 516 }
}).textButton({
    label: 'ИПиПП',
    payload: { id: 490 }
}).row().textButton({
    label: 'ИЭУиБ',
    payload: { id: 29 }
}).textButton({
    label: 'ИСиТИ',
    payload: { id: 538 }
}).textButton({
    label: 'ИМРИТиТС',
    payload: { id: 539 }
}).row().textButton({
    label: 'ИФН',
    payload: { id: 540 }
}).textButton({
    label: 'ИТК',
    payload: { id: 541 }
}).oneTime()

export const kurses = Keyboard.builder().textButton({
    label: '1',
    payload: { num: 1 }
}).textButton({
    label: '2',
    payload: { num: 2 }
}).textButton({
    label: '3',
    payload: { num: 3 }
}).row().textButton({
    label: '4',
    payload: { num: 4 }
}).textButton({
    label: '5',
    payload: { num: 5 }
}).textButton({
    label: '6',
    payload: { num: 6 }
}).oneTime()

export function selectingDay() {
    let keyboard = Keyboard.builder();
    let now = new Date();
    let day = now.getDay();
    let week = now.getWeek()%2 == 0;

    for(let i = 1;i<=6;i++) {
        keyboard.textButton({
            label: week ? daysEven[i-1] : daysOdd[i-1],
            payload: {
                day: i,
                week: week,
            },
            color: day == i && week ? 'positive' : 'secondary'
        }).textButton({
            label: !week ? daysEven[i-1] : daysOdd[i-1],
            payload: {
                day: i,
                week: !week
            },
            color: day == i && !week ? 'positive' : 'secondary'
        }).row()
    }

    return keyboard;
}

export default { institutes, kurses, selectingDay }