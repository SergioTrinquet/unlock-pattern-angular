export const MSG_CSS_CLASS = {
    default: 'msg',
    valid: 'valid',
    invalid: 'invalid',
    animation: 'anim-up'
} as const;

export const MSG_LABELS = {
    creation: "Créez votre schéma de déverrouillage",
    draw: "Dessinez le schéma de déverrouillage",
    valid: "Schéma valide",
    invalid: "Schéma invalide",
    notEnoughPoints: ": Pas assez de points !",
    maxPointsReached: "Nombre de points max. atteint"
};

export const DELAY_TO_DISPLAY = {
    labelAfterNotEnoughDots: 2000,
    buttonsAfterValidSchema: 1500,
    labelAfterInvalidSchema: 1500
}