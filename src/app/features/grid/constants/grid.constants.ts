export const SCHEMA_ELEMENTS_COLOR_CLASS = {
  error: "error",
  valid: "valid",
  default: "default"
} as const;

export const STROKES_COLORATION_SEQUENCE = [
  { color: "custom",  duration: 500 },
  { color: SCHEMA_ELEMENTS_COLOR_CLASS.default, duration: 300 },
  { color: "custom",  duration: 2000 }
] as const;

export const SEQUENCE_ANIMATION_DRAWING_SUCCESS = {
  stepCardFlip: 600,
  stepAnimSVG: 1300,
  stepDisplayMsgSuccess: 1000,
  stepDelayBeforeMsgSuccessClose: 4000,
};