import {jest, describe, it, expect} from '@jest/globals';
import {Card, simpleDeck, sortedStack, sortedStackByRank} from './card';

const SCHNAPSRANKS = {
    ACE: 'A',
    TEN: 'T',
    KING: 'K',
    QUEEN: 'Q',
    JACK: 'J'
} as const;

const SCHNAPSUITS = {
    HEARTS: 'H',
    DIAMONDS: 'D',
    CLUBS: 'C',
    SPADES: 'S'
} as const;
export type SchnapsRank = typeof SCHNAPSRANKS[keyof typeof SCHNAPSRANKS];
export type SchnapsSuit = typeof SCHNAPSUITS[keyof typeof SCHNAPSUITS];
const suits: SchnapsSuit[] = Object.values(SCHNAPSUITS);
const ranks: SchnapsRank[] = Object.values(SCHNAPSRANKS);
export const schnapsDeck = simpleDeck(ranks, suits);
export type SchnapsCard = Card<SchnapsRank, SchnapsSuit>;
describe(
    'Card',
    () => {
        it('test system starts', () => {
            expect(true).toBe(true);
        });
        it('builds deck', () => {
            expect(schnapsDeck.length).toBe(20);
        });
        it('random deck repeat', () => {
            const deck1 = simpleDeck(ranks, suits);
            const deck2 = simpleDeck(ranks, suits);
            expect(deck1).not.toEqual(deck2);
        });
        it('shuffles deck', () => {
            const deck1 = simpleDeck(ranks, suits);
            const deck2 = simpleDeck(ranks, suits);
            expect(deck1).not.toEqual(deck2);
            const shuffled1 = deck1.map(card => card.id);
            const shuffled2 = deck2.map(card => card.id);
            expect(shuffled1).not.toEqual(shuffled2);
        });
        it('sorts deck', () => {
            const deck = simpleDeck(ranks, suits);
            const sorted = sortedStack(deck);
            suits.forEach(suit => {
                expect(sorted.has(suit)).toBe(true);
                expect(sorted.get(suit)?.length).toBe(5);
            })
        })
        it ('sorts deck by rank', () => {
            const deck = simpleDeck(ranks, suits);
            const sorted = sortedStackByRank(deck);
            ranks.forEach(rank => {
                expect(sorted.has(rank)).toBe(true);
                expect(sorted.get(rank)?.length).toBe(4);
            })
        })
    })