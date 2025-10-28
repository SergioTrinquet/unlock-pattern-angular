import { STROKE } from "../../../app.constants";
import vars from '../../../../styles/variables.json';

export type Dot = {
    top: number,
    left: number
}

export type Canvas = {
    height: number,
    width: number
} & Partial<Dot>

export type Stroke = {
    start: CoordStrokeExtremity,
    end: NullableObject<CoordStrokeExtremity>
}
type NullableObject<T extends object> = { [K in keyof T]: T[K] | null };

export type CoordStrokeExtremity = { x: number, y: number }

export type StrokeColor = keyof typeof STROKE.color;

export type StrokeColorationSequence = {
    color: StrokeColor,  
    duration: number
}

export type CssVarsKeys = keyof typeof vars;
export type CssVarsValue<K extends CssVarsKeys> =  typeof vars[K];

