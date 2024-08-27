declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_URI: string;
            TOKEN: string;
            KUBSTI_API: string;
        }
    }

    // Для правильной работы Date, с изменённым прототипом
    interface Date {
        getWeek(): number;
        stringDate(): string;
    }

    interface CommandName {
        buttons?: Array<{ title: string; emoji?: string } | string> | { title: string; emoji?: string } | string;
        command?: string;
    }
}

export {};
