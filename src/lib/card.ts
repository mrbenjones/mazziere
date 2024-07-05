export type Card<T,S> = {
    id: string;
    rank: T;
    suit: S;
}

/**
 * Shuffle an array of items
 * @param array
 */
export function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Create a simple deck of cards with ranks and suits
 * @param ranks
 * @param suits
 */
export function simpleDeck<T,S>(ranks: T[], suits: S[]): Card<T,S>[] {
    return ranks.flatMap(rank => suits.map(suit => ({ id: `${rank}${suit}`, rank, suit })));
}