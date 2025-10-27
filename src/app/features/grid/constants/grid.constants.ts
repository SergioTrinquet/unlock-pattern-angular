export const SCHEMA_ELEMENTS_COLOR_CLASS = {
    error: "error",
    valid: "valid",
    default: "default"
} as const;

/*  export const STROKES_COLORATION_SEQUENCE = [
    { color: "custom",  duration: 500 },
    { color: SCHEMA_ELEMENTS_COLOR_CLASS.default, duration: 300 },
    { color: "custom",  duration: 2000 }
] as const; */
  export const STROKES_COLORATION_SEQUENCE = [
    { color: "custom",  duration: 4000 },
    { color: SCHEMA_ELEMENTS_COLOR_CLASS.default, duration: 800 },
    { color: "custom",  duration: 6000 }
] as const;



/// ? EN COURS DE DEV ///
export const ANIMATIONS = [
    { class: "pulse", customProperty: "--time-pulse", duration: 500 },
    { class: "vibrate", customProperty: "--time-vibrate", duration: 400 },
    { class: "shrink", customProperty: "--time-shrink", duration: 400 },
] as const;