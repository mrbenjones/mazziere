import {jest, describe, it, expect} from '@jest/globals';
import {ddpinochleDeck} from "./pinochle";

describe(
    'Card',
    () => {
        it('test system starts', () => {
            expect(true).toBe(true);
        });
        it ('builds deck', () => {
            const deck1 = ddpinochleDeck();
            const deck2 = ddpinochleDeck();
            expect(deck1.length).toBe(80);
            expect(deck2.length).toBe(80);
            expect(deck1).not.toEqual(deck2);
        });
    }
)