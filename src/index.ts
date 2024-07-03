import { readdirSync } from "fs";
import Cache from "./lib/Cache.js";
// import Event from "./struct/Event.js";
// import { AllowArray } from "vk-io/lib/types.js";
import Command from "./struct/Command.js";
import { StepScene } from "@vk-io/scenes";

// TODO: Это надо как-то подправить
// async function initEvents() {
//     for (let dirent of readdirSync("./dist/events", {withFileTypes: true})) {
//         if (!dirent.name.endsWith(".js")) continue;

//         console.log(`[loader] [+] Ивент ${dirent.name}`);
    
//         let eventClass = (await import("./events/" + dirent.name)).default;
//         let event:Event = new eventClass();

//         
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         Cache.bot.updates.on(event.name as AllowArray<any>, event.functs);
//     }
// }

async function loadCommands() {
    for (let dirent of readdirSync("./dist/commands/", {withFileTypes: true})) {
        if (!dirent.name.endsWith(".js")) continue;

        console.log(`[loader] [+] Команда ${dirent.name}`);
    
        let commandClass = (await import("./commands/" + dirent.name)).default;
        let command:Command = new commandClass();

        Cache.hearManager.hear(command.condition, command.exec);
    }
}

async function initScenes() {
    let scenes:StepScene[] = []

    for (let dirent of readdirSync("./dist/scenes/", {withFileTypes: true})) {
        if (!dirent.name.endsWith(".js")) continue;

        console.log(`[loader] [+] Сцена ${dirent.name}`);

        scenes.push((await import("./scenes/" + dirent.name)).default);

    }

    Cache.sceneManager.addScenes(scenes);
}

// initEvents();
loadCommands();
initScenes();