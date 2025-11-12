export const SQUARE_COLUMNS_CLASSES = [
        { direction: "up", speed: "" },   
        { direction: "down", speed: "" },
        { direction: "up", speed: "slow" },
        { direction: "down", speed: "slow" }
    ];
export const GRID = {
    side: 200,
    margin: 40
};
export const DOT_RADIUS = 6;
export const NB_SQUARES_PER_COLUMN = 10;
export const STRIKE_PATTERNS = [
    [0, 3, 4, 5, 8],
    [7, 6, 4, 1, 2],
    [5, 8, 7, 4, 3, 6],
    [0, 1, 4, 7, 8],
    [2, 4, 7, 6, 3],
    [6, 7, 4, 5, 2],
    [2, 5, 4, 3, 0],
    [6, 7, 5, 1, 0],
    [0, 4, 8, 5, 2],
    [6, 4, 2, 5, 8]
] as const;