import { StepScene } from "@vk-io/scenes";
import { institutes, kurses } from "../lib/Keyboards.js";
import ScheduleModel from "../shared/models/ScheduleModel.js";
import { Keyboard } from "vk-io";
import Cache from "../lib/Cache.js";

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
    async (context) => {
        if (context.scene.step.firstTime || !context.text) {
            let now: Date     = new Date();
            let groupDate     = (now.getFullYear() - context.scene.state.kurs + 1 - ( now.getMonth() >= 6 ? 0 : 1)).toString().substring(2);
            let schedules     = await ScheduleModel.find({inst_id: context.scene.state.instId!, group: { $regex: `^${groupDate}-`}}).exec();
            let groups        = schedules.map(s => s.group);

            if(!groups || groups!.length == 0) {
                context.send('Ошибка!');

                return context.scene.step.reenter();
            }

            let keyboard = Keyboard.builder().oneTime();

            for(let i = 0;i<groups.length;i++) {
                if(i%3==0 && i != 0) keyboard.row();
                
                keyboard.textButton({
                    label: groups[i].substring(3),
                    payload: { group: groups[i] }
                });
            }

            return context.send('Выбери свою группу', { keyboard });
        }

        context.scene.state.group = context.messagePayload.group;

        return context.scene.step.next();
    },
    async (context) => {
        console.log(context.scene.state);

        let user = await Cache.getUser(context.senderId);

        user.updateData({group: context.scene.state.group, instId: context.scene.state.instId});

        await context.send(`Готово!`, {keyboard: user.getMainKeyboard()});

        return context.scene.step.next();
    }
])