import { SCHEMA_ELEMENTS_COLOR_CLASS } from "./features/grid/constants/grid.constants";

export const COOKIE_NAME_PREFIX = "cookieSchema";
export const STROKE = {
    color:{
        [SCHEMA_ELEMENTS_COLOR_CLASS.default]: "rgb(255, 217, 217)",
        [SCHEMA_ELEMENTS_COLOR_CLASS.error]: "rgba(255, 94, 94, 1)",
        [SCHEMA_ELEMENTS_COLOR_CLASS.valid]: "#4dfd4dff"
    },
    width: 6,
};