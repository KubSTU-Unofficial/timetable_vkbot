import { VK } from "vk-io";
import User from "../struct/User.js";
import { HearManager } from "@vk-io/hear";
import { SessionManager } from "@vk-io/session";
import { SceneManager } from "@vk-io/scenes";
import Group from "../struct/Group.js";

export default (function () {
    const bot = new VK({ token: process.env.TOKEN! });

    const hearManager = new HearManager();
    const sessionManager = new SessionManager();
    const sceneManager = new SceneManager();

    let users: User[] = [];
    let groups: Group[] = [];

    async function getUser(id:number) {
        let user = users.find(u => u.id == id);

        if(!user) {
            user = new User(id);
            await user.init();
            users.push(user);
        }

        return user;
    }

    bot.updates.start().catch(console.error);
    
    bot.updates.on('message_new', sessionManager.middleware);
    
    bot.updates.on('message_new', sceneManager.middleware);
    bot.updates.on('message_new', sceneManager.middlewareIntercept);

    bot.updates.on('message_new', async (ctx, next) => {
        ctx.state.user = await getUser(ctx.senderId);

        return next();
    });

    bot.updates.on('message_new', hearManager.middleware);

    hearManager.onFallback(async (context) => {
        await context.send('Команда не найдена!', {
            keyboard: context.state.user.getMainKeyboard()
        });
    });

    return {
        bot, hearManager, sessionManager, sceneManager, getUser,
        getGroup(name:string, instId:number) {
            let group = groups.find(g => g.name == name && g.instId == instId);

            if(!group) {
                group = new Group(name, instId);
                groups.push(group)
            }

            return group;
        }
    }
})();