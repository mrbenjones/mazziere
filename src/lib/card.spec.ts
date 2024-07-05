import {jest, describe, it, expect} from '@jest/globals';
import {Card, simpleDeck} from './card';

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
        it ('builds deck', () => {
            expect(schnapsDeck.length).toBe(20);
        });
    }
)