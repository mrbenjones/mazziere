import { v4 as uuidv4 } from 'uuid';
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

function* buildDeck<T,S> (ranks: T[], suits: S[]): Generator<Card<T,S>> {
    for (const rank of ranks) {
        for (const suit of suits) {
            yield { id: uuidv4(), rank, suit };
        }
    }
}
/**
 * Create a simple deck of cards with ranks and suits
 * @param ranks
 * @param suits
 */
export function simpleDeck<T,S>(ranks: T[], suits: S[]): Card<T,S>[] {
    return [...buildDeck(ranks, suits)];
}

/**
 * Sort a stack of cards by suit
 * @param deck
 */
export function sortedStack<T,S>(stack: Card<T,S>[]): Map<S,Card<T,S>[]> {
    return stack.reduce((hand, card) => {
        const suit = card.suit;
        const cards = hand.get(suit) || [];
        cards.push(card);
        hand.set(suit, cards);
        return hand
    }, new Map<S, Card<T,S>[]>)
}

/**
 * Sort a stack of cards by rank
 * @param stack
 */
export function sortedStackByRank<T,S>(stack: Card<T,S>[]): Map<T,Card<T,S>[]> {
    return stack.reduce((hand, card) => {
        const rank = card.rank;
        const cards = hand.get(rank) || [];
        cards.push(card);
        hand.set(rank, cards);
        return hand
    }, new Map<T, Card<T,S>[]>)
}