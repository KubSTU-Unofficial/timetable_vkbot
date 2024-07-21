import { StepScene } from "@vk-io/scenes";
import { selectingDay } from "../lib/Keyboards.js";
import Cache from "../lib/Cache.js";

export default new StepScene('daySelector', [
    async (context) => {
        if (context.scene.step.firstTime || !context.messagePayload) {
            return context.send('Выбери день', {
                keyboard: selectingDay()
            });
        }

        let day   = context.messagePayload.day;
        let week  = context.messagePayload.week;
        
        // Получаем дату выбранного дня
        let date  = new Date();

        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (date.getDay() || 7) + day + (((date.getWeek()%2 == 0) == week) ? 0 : 7) );

        let user = await Cache.getUser(context.senderId);
        let text = await user.group!.getTextSchedule(date, { showDate: true });

        context.send(text, {
            keyboard: user.getMainKeyboard()
        });

        return context.scene.step.next();
    }
])