import { STRIKE_PATTERNS, NB_SQUARES_PER_COLUMN } from "../constants/background.constants";

type TupleOfLength<T extends readonly any[], N extends number> = T['length'] extends N 
                                                                    ? T 
                                                                    : never;

export type NbStrikePatterns = TupleOfLength<typeof STRIKE_PATTERNS, typeof NB_SQUARES_PER_COLUMN>;