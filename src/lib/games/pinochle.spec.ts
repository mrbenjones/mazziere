import {jest, describe, it, expect} from '@jest/globals';
import {
    DDMeldStrain,
    ddpinochleDeal,
    ddpinochleDeck,
    DDPINOCHLESUITS, getAllMeld, getMeldPoints,
    getTypeOneMeld, getTypeThreeMeld, getTypeTwoMeld,
    handFromString,
    sortedSuits,
    startingMeld
} from "./pinochle";
function isAscendingLength<A>(arrOfArr: A[][] ) {
    for (let i = 0; i < arrOfArr.length - 1; i++) {
        if (arrOfArr[i].length > arrOfArr[i+1].length) {
            return false;
        }
    }
    return true
}
describe(
    'Card',
    () => {
        it('utility function isAscendingLength', () => {
            const arrOfArr: number[][] = [[1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12]];
            expect(isAscendingLength(arrOfArr)).toBe(true);
            const arrOfArr2: number[][] = [[1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12], [13, 14, 15]];
            expect(isAscendingLength(arrOfArr2)).toBe(false);
        })
        it('test system starts', () => {
            expect(true).toBe(true);
        });
        it('builds deck', () => {
            const deck1 = ddpinochleDeck();
            const deck2 = ddpinochleDeck();
            expect(deck1.length).toBe(80);
            expect(deck2.length).toBe(80);
            expect(deck1).not.toEqual(deck2);
        });
        it('shuffles deck', () => {
            const deck1 = ddpinochleDeck();
            const deck2 = ddpinochleDeck();
            expect(deck1).not.toEqual(deck2);
            const shuffled1 = deck1.map(card => card.id);
            const shuffled2 = deck2.map(card => card.id);
            expect(shuffled1).not.toEqual(shuffled2);
        });
        it('deals deck', () => {
            const hands = ddpinochleDeal();
            expect(hands.length).toBe(4);
            hands.forEach(hand => {
                expect(hand.length).toBe(20);
            })
        })
        it('sorts hand', () => {
            const hands = ddpinochleDeal();
            hands.forEach(hand => {
                const sorted = sortedSuits(hand);
                expect(sorted.length).toBe(4);
                sorted.forEach(suit => {
                    expect(suit.length).toBeLessThan(20);
                })
                expect(isAscendingLength(sorted)).toBe(true);
            })
        })


        describe('handFromString', () => {
            it('singleHandValue', () => {
                const input = 'SAATQQJJHAAAJCJJQTDJQKKA';
                const result = handFromString(input);
                expect(result.length).toBe(1);
                expect(result[0].length).toBe(20);
                const sorted = sortedSuits(result[0]);
                expect(sorted[0].length).toBe(4);
            });
            it('meldValue', ()=>{
                const input = 'SAATQQJJHAAAJCJJQTDJQKKA|HQKKA';
                const result = handFromString(input);
                const meld = getTypeOneMeld(result[0])
                expect(meld.get(DDPINOCHLESUITS.HEARTS).length).toBe(1);
            });
            it('rope', ()=>{
                const input = 'SAAAKKQQJJT|HQKKA';
                const result = handFromString(input);
                const meld = getTypeOneMeld( result[0])
                expect(meld.get(DDPINOCHLESUITS.SPADES).length).toBe(2);
                const meld2 = getTypeOneMeld( result[1])
                expect(meld2.get(DDPINOCHLESUITS.HEARTS).length).toBe(1);
                console.log(meld2)
                expect(meld2.get(DDPINOCHLESUITS.HEARTS)[0]).toBe('TRUMP_MARRIAGE');
            });
        });
        it ('acesAround', () => {
            const input = 'SAATQQJHAATQJDATQJCAAQJ'
            const result = handFromString(input);
            const meld = getTypeThreeMeld(result[0]);
            expect(meld.get('ALL').length).toBe(3);
            const meld2 = getTypeTwoMeld( result[0]);
            expect(meld2.get('ALL').length).toBe(1);
        })
        it ('fullMeld', () => {
            const input = 'SATKQJJHATKJCTKKQQDAAAQJ'
            const result = handFromString(input)[0];
            const meld = getAllMeld(result);
            console.log(meld.get('ALL'))
            console.log('HEARTS', meld.get(DDPINOCHLESUITS.HEARTS))
            console.log('DIAMONDS', meld.get(DDPINOCHLESUITS.DIAMONDS))
            console.log('SPADES', meld.get(DDPINOCHLESUITS.SPADES))
            console.log('CLUBS', meld.get(DDPINOCHLESUITS.CLUBS))
            expect(meld.get('ALL').length).toBe(1);
        })
        it ('fullMeld', () => {
            const input = 'SATKQJJHATKJCATKKQQDAAAQJ'
            const result = handFromString(input)[0];
            const meld = getAllMeld(result);
            console.log(meld)
            console.log(getMeldPoints(meld))
        })
        it ('sampleMeld', () => {
            const hand='SJJQKTAHJKTACQQKKTDJQAAA'
            const meld = getMeldPoints(getAllMeld(handFromString(hand)[0]))
            console.log(handFromString(hand)[0])
            console.log(getAllMeld(handFromString(hand)[0]))
            expect(meld.get('S')).toBe(23);
            expect(meld.get('H')).toBe(10);
            expect(meld.get('D')).toBe(10);
            expect(meld.get('C')).toBe(14);
        })
    });