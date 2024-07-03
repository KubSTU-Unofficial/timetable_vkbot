import { StepScene } from "@vk-io/scenes";
import { institutes, kurses } from "../lib/Keyboards.js";

export default new StepScene('signup', [
    (context) => {
        if (context.scene.step.firstTime || !context.messagePayload) {
            return context.send('Выбери институт', {
                keyboard: institutes
            });
        }

        context.scene.state.instId = context.messagePayload.id;

        return context.scene.step.next();
    },
    (context) => {
        if (context.scene.step.firstTime || !context.messagePayload) {
            return context.send('Выбери свой курс', {
                keyboard: kurses
            });
        }

        context.scene.state.kurs = context.messagePayload.num;

        return context.scene.step.next();
    },
    (context) => {
        if (context.scene.step.firstTime || !context.text) {
            return context.send('Выбери свою группу');
        }

        context.scene.state.group = context.text;

        return context.scene.step.next();
    },
    async (context) => {
        console.log(context.scene.state);

        await context.send(`Готово!`);

        return context.scene.step.next();
    }
])