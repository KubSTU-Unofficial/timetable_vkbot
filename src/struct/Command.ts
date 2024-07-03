import { Context, ContextDefaultState, MessageContext } from "vk-io";
import { HearConditions } from "@vk-io/hear";

export default abstract class Command {
    abstract condition: HearConditions<Context<object, ContextDefaultState, string, string>>;
    abstract exec(msg: MessageContext<ContextDefaultState> & object, next: () => Promise<unknown>):unknown;
}