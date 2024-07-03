import { VK } from "vk-io";
import User from "../struct/User.js";
import { HearManager } from "@vk-io/hear";
import { SessionManager } from "@vk-io/session";
import { SceneManager } from "@vk-io/scenes";

export default (function () {
    const bot = new VK({ token: process.env.TOKEN! });

    const hearManager = new HearManager();
    const sessionManager = new SessionManager();
    const sceneManager = new SceneManager();

    bot.updates.start().catch(console.error);
    
    bot.updates.on('message_new', sessionManager.middleware);
    
    bot.updates.on('message_new', sceneManager.middleware);
    bot.updates.on('message_new', sceneManager.middlewareIntercept);

    bot.updates.on('message_new', hearManager.middleware);

    hearManager.onFallback(async (context) => {
        await context.send('Команда не найдена!');
    });

    let users: User[] = [];

    return {
        bot, hearManager, sessionManager, sceneManager,
        getUser(id:number) { 
            let user = users.find(u => u.id == id);

            if(!user) {
                user = new User(id);
                users.push(user);
            }

            return user;
        }
    }
})();