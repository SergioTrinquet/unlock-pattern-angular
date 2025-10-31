import { SchemaNbDotsConfig } from '../types/select.type';

export const DEFAULT_SELECT_VALUE = 'Choisissez le nombre de points';
export const DELETE_SCHEMA_LABEL = 'Supprimer le schéma enregistré';
export const DOTS_SCHEMA_CONFIGS = [
    { nbDotPerLC: 3, nbDotMin: 5, nbDotMax: 8 }, 
    { nbDotPerLC: 4, nbDotMin: 6, nbDotMax: 12 }
] as const;
export const SELECT_OPTIONS = ({nbDotPerLC, nbDotMin, nbDotMax}:SchemaNbDotsConfig ) => `${nbDotPerLC * nbDotPerLC} points (schéma entre ${nbDotMin} et ${nbDotMax} points)`;