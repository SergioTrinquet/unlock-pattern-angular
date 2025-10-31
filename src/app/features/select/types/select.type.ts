import { DOTS_SCHEMA_CONFIGS } from "../constants/select.constants";

export type SchemaNbDotsConfig = typeof DOTS_SCHEMA_CONFIGS[number];
type SchemaNbDotsKeys = keyof typeof DOTS_SCHEMA_CONFIGS[number];
export type SchemaNbDots<T extends SchemaNbDotsKeys> = SchemaNbDotsConfig[T];