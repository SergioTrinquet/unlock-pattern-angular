import { MSG_CSS_CLASS } from "../constants/message.constants";

/* V1 */
type partialMessage = {
    className?: typeof MSG_CSS_CLASS.valid | typeof MSG_CSS_CLASS.invalid,
    anim?: boolean

    , delay?: number // in ms
}
type withText = {
    text: string,
    showButtons?: never
}
type withButtons = {
    text?: never,
    showButtons: boolean
}
export type message = partialMessage & withText | partialMessage & withButtons;


/* V2 */
/* type classNames = {
    valid: string,
    invalid: string
}

type baseMessage = {
    text: string,
    showButtons: boolean,
    // className?: 'valid' | 'invalid',
    className?: keyof classNames,
    anim?: boolean
}
type partialMessage = Omit<baseMessage, "text" | "showButtons">;
type withText = partialMessage & { text: string; showButtons?: never };
type withButtons = partialMessage & { showButtons: boolean; text?: never };
type message =  withText | withButtons; */
