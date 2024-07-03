import { ContextDefaultState, MessageContext } from "vk-io";

export default abstract class Event {
    abstract name:string;

    abstract functs:((ctx:MessageContext<ContextDefaultState> & object, next: () => Promise<unknown>) => unknown)[];
}