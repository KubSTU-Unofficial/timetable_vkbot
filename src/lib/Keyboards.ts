import { Keyboard } from "vk-io";

export const institutes = Keyboard.builder().textButton({
    label: 'ИНГиЭ',
    payload: { id: 495 }
}).textButton({
    label: 'ИКСиИБ',
    payload: { id: 516 }
}).textButton({
    label: 'ИПиПП',
    payload: { id: 490 }
}).textButton({
    label: 'ИЭУиБ',
    payload: { id: 29 }
}).row().textButton({
    label: 'ИСиТИ',
    payload: { id: 538 }
}).textButton({
    label: 'ИМРИТиТС',
    payload: { id: 539 }
}).textButton({
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

export default { institutes }