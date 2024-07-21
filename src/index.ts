import { readdirSync } from "fs";
import mongoose from "mongoose";
import Cache from "./lib/Cache.js";
// import Event from "./struct/Event.js";
// import { AllowArray } from "vk-io/lib/types.js";
import Command from "./struct/Command.js";
import { StepScene } from "@vk-io/scenes";

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI); // Подключаем MongoDB

// Сделано для определения чётности недели
// Returns the ISO week of the date.
// Source: https://weeknumber.net/how-to/javascript
Date.prototype.getWeek = function () {
  let date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  let week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
};

Date.prototype.stringDate = function () {
  return `${this.getDate()}.${this.getMonth() + 1}.${this.getFullYear()}`;
};

// TODO: Это надо как-то подправить... может быть...
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
  for (let dirent of readdirSync("./dist/commands/", { withFileTypes: true })) {
    if (!dirent.name.endsWith(".js")) continue;

    console.log(`[loader] [+] Команда ${dirent.name}`);

    let commandClass = (await import("./commands/" + dirent.name)).default;
    let command: Command = new commandClass();

    Cache.hearManager.hear(command.getCommandsName(), command.exec);
  }
}

async function initScenes() {
  let scenes: StepScene[] = [];

  for (let dirent of readdirSync("./dist/scenes/", { withFileTypes: true })) {
    if (!dirent.name.endsWith(".js")) continue;

    console.log(`[loader] [+] Сцена ${dirent.name}`);

    scenes.push((await import("./scenes/" + dirent.name)).default);
  }

  Cache.sceneManager.addScenes(scenes);
}

// initEvents();
loadCommands();
initScenes();
