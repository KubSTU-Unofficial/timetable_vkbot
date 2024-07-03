


declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_URI: string;
            TOKEN: string;
            KUBSTI_API: string;
        }
    }
}

export {};