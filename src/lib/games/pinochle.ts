import {Card, shuffle, simpleDeck, sortedStack, sortedStackByRank} from '../card';
import {v4 as uuid4} from 'uuid';

export const DDPINOCHLERANKS = {
    ACE: 'A',
    TEN: 'T',
    KING: 'K',
    QUEEN: 'Q',
    JACK: 'J'
} as const;

export const DDPINOCHLESUITS = {
    HEARTS: 'H',
    DIAMONDS: 'D',
    CLUBS: 'C',
    SPADES: 'S'
} as const;


const DDMELDTYPE = {
    RUN: 'RUN',
    MARRIAGE: 'MARRIAGE',
    TRUMP_MARRIAGE: 'TRUMP_MARRIAGE',
    ACES_AROUND: 'ACES_AROUND',
    KINGS_AROUND: 'KINGS_AROUND',
    QUEENS_AROUND: 'QUEENS_AROUND',
    JACKS_AROUND: 'JACKS_AROUND',
    PINOCHLE: 'PINOCHLE'
} as const;

export type DDPinochleRank = typeof DDPINOCHLERANKS[keyof typeof DDPINOCHLERANKS];
export type DDPinochleSuit = typeof DDPINOCHLESUITS[keyof typeof DDPINOCHLESUITS];
export type DDMeldType = typeof DDMELDTYPE[keyof typeof DDMELDTYPE];
export type DDMeldStrain = DDPinochleSuit | 'ALL';
export type DDMeldMap = Map<DDMeldStrain, DDMeldType[]>
const DDPinochleSuitValues = new Set(Object.values(DDPINOCHLESUITS));
const DDPinochleRankValues = new Set(Object.values(DDPINOCHLERANKS));

export function sortedSuits(hand: DDPinochleCard[]): DDPinochleCard[][] {
    const sortedSuits = []
    Object.values(DDPINOCHLESUITS).forEach(suit => {
        sortedSuits.push([...hand.filter(card => card.suit === suit)])
    })
    return sortedSuits.sort((a, b) => a.length - b.length)
}

const allSuits: DDPinochleSuit[] = [...Object.values(DDPINOCHLESUITS)];
const allRanks: DDPinochleRank[] = [...Object.values(DDPINOCHLERANKS)]
    .concat([...Object.values(DDPINOCHLERANKS)])
    .concat([...Object.values(DDPINOCHLERANKS)])
    .concat([...Object.values(DDPINOCHLERANKS)])
export const ddpinochleDeck = () => simpleDeck(allRanks, allSuits);
export type DDPinochleCard = Card<DDPinochleRank, DDPinochleSuit>;
export type DDPinochleHand = DDPinochleCard[];

/**
 * Randomize a hand...then hand out 4 packs of cards to each player
 */
export function ddpinochleDeal(): DDPinochleCard[][] {
    const startingDeck: DDPinochleCard[] = shuffle(ddpinochleDeck());
    const hands: DDPinochleHand[] = [[], [], [], []];
    for (let round = 0; round < 5; round++) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                hands[j].push(startingDeck.pop() as DDPinochleCard);
            }
        }
    }
    return hands
}

/**
 * Determine if a card is a counter
 * @param card
 */
export function isCounter(card: DDPinochleCard): boolean {
    return card.rank === 'K' || card.rank === 'A' || card.rank === 'T'
}


export type Meld = Map<DDMeldStrain, DDMeldType[]>;

/**
 * Tracker for type 1 meld.
 * <ul>
 *     <li>meld:Meld: current meld count </li>
 *     <li>sortedSuit: Map<DDPinochleRank, DDPinochleCard[]>: current suit with candidates.</li>
 *     <li>suits: list of all suits</li>
 * </ul>
 * No point architecture - take one of these and return one of these.
 */
export type TypeOneMeldTracker = {
    meld: Meld;
    suits: DDPinochleCard[][];
}

/**
 * Advance the meld tracker, by the following rules:
 * <ul>
 *     <li>If there are no kings in the sortedSuit, sort the next suit from suits (pop it), and
 *     add it to the sortedSuit, and recurse.</li>
 *     <li>If there is one king in the sorted suit, do the following:
 *     <ul>
 *         <li>If there is a full rope in the sorted suit, take out A,K,Q,J,T, add a run, and return the result.</li>
 *         <li> If there is no full rope, but there is a K and Q in the sorted suit, take out K,Q, and return the result with new meld.</li>
 *         <li> If there is no Queen, take out the King, and return the result.</li>
 *     </ul>
 *     </ul>
 *  Testing NOTE: test the number of times this is called.
 * @param acc
 */
export function advanceTypeOne(acc: TypeOneMeldTracker): TypeOneMeldTracker {
    let {meld, suits} = {...acc};

    if (suits.length === 0) {
        return {
            meld: meld,
            suits: suits
        }
    }
    const sortedSuit = sortedStackByRank(suits[0]);
    // we've taken a suit off the stack, aand we will proces it.
    while ((sortedSuit.get('K') || []).length > 0) {
        const king = sortedSuit.get('K')?.pop();
        const queen = sortedSuit.get('Q')?.pop();
        const jack = sortedSuit.get('J')?.pop();
        const ten = sortedSuit.get('T')?.pop();
        const ace = sortedSuit.get('A')?.pop();
        const currentSuit = king?.suit;

        if (king && queen && jack && ten && ace) {
            meld.set(currentSuit as DDMeldStrain, [...meld.get(currentSuit) || [], 'RUN']);
        } else if (king && queen) {
            [...DDPinochleSuitValues].filter(suit => suit !== currentSuit)
                .forEach(suit => {
                    meld.set(suit as DDMeldStrain, [...meld.get(suit) || [], 'MARRIAGE']);
                })
            meld.set(currentSuit as DDMeldStrain, [...meld.get(currentSuit) || [], 'TRUMP_MARRIAGE']);
        }
    }
    return {
        meld: meld,
        suits: suits.slice(1)
    }
}

export function startingMeld(): Meld {
    const meld = new Map<DDMeldStrain, DDMeldType[]>();
    allSuits.forEach(suit => {
        meld.set(suit, []);
    })
    return meld;
}

export function getTypeOneMeld(stack: DDPinochleCard[], meld: Meld = startingMeld()): Meld {
    const suits = sortedSuits(stack);
    let acc = {
        meld: meld || startingMeld(),
        suits: suits
    }
    while (acc.suits.length > 0) {
        acc = advanceTypeOne(acc);
    }
    return acc.meld;
}

export function getTypeTwoMeld(stack: DDPinochleCard[], meld: Meld = startingMeld()): Meld {
    const stackBySuits = sortedStack(stack)
    const queens = stack.filter(card => card.rank === 'Q' && card.suit === 'S')
    const jacks = stack.filter(card => card.rank === 'J' && card.suit === 'D')
    for (let i = 0; i < Math.min(queens.length, jacks.length); i++) {
        meld.set('ALL', [...meld.get('ALL') || [], 'PINOCHLE'])
    }
    return meld
}

export function getTypeThreeMeld(stack: DDPinochleCard[], meld: Meld = startingMeld()): Meld {
    const stackBySuits = sortedStack(stack)
    const meldCounts = new Map<DDMeldType, number>(
        [[DDMELDTYPE.ACES_AROUND, 4],
            [DDMELDTYPE.KINGS_AROUND, 4],
            [DDMELDTYPE.QUEENS_AROUND, 4],
            [DDMELDTYPE.JACKS_AROUND, 4]]
    );
    // go through suits and truncate count at order
    for (const suit of DDPinochleSuitValues) {
        meldCounts.set(DDMELDTYPE.ACES_AROUND, Math.min(meldCounts.get(DDMELDTYPE.ACES_AROUND) as number, (stackBySuits.get(suit)?.filter(card => card.rank === 'A') || []).length))
        meldCounts.set(DDMELDTYPE.KINGS_AROUND, Math.min(meldCounts.get(DDMELDTYPE.KINGS_AROUND) as number, (stackBySuits.get(suit)?.filter(card => card.rank === 'K') || []).length))
        meldCounts.set(DDMELDTYPE.QUEENS_AROUND, Math.min(meldCounts.get(DDMELDTYPE.QUEENS_AROUND) as number, (stackBySuits.get(suit)?.filter(card => card.rank === 'Q') || []).length))
        meldCounts.set(DDMELDTYPE.JACKS_AROUND, Math.min(meldCounts.get(DDMELDTYPE.JACKS_AROUND) as number, (stackBySuits.get(suit)?.filter(card => card.rank === 'J') || []).length))
    }
    for (const [type, count] of meldCounts) {
        for (let i = 0; i < count; i++) {
            meld.set('ALL', [...meld.get('ALL') || [], type])
        }
    }
    return meld
}

/**
 *
 */
export type HandParseState = {
    suit: DDPinochleSuit;
    cards: DDPinochleCard[][];
    input: string
}

/**
 * Suits are 'S', 'H', 'D', 'C' ranks are 'A', 'T', 'K', 'Q', 'J'
 * Each suit changes the current suit.  A '|' changes the current hand.
 * @param acc
 */
function advanceStringParse(acc: HandParseState): HandParseState {
    let {suit, cards, input} = {...acc};
    const tokens = ['S', 'H', 'D', 'C', 'A', 'T', 'K', 'Q', 'J', '|'];
    let idx = 0;
    while (tokens.indexOf(input.charAt(idx)) == -1 && idx < input.length) {
        idx++;
    }
    const token = input.charAt(idx)
    // input length is the measure of whether parsing is done.  Add cards, change suits, and
    // change hands then advance length.
    if (token === '|') {
        cards.push([]);
    }
    if (DDPinochleSuitValues.has(token as DDPinochleSuit)) {
        suit = token as DDPinochleSuit;
    }
    if (DDPinochleRankValues.has(token as DDPinochleRank)) {
        cards[cards.length - 1].push({id: uuid4(), rank: token as DDPinochleRank, suit: suit});
    }
    return {
        suit: suit,
        cards: cards,
        input: input.substring(idx + 1)
    }
}

export function handFromString(input: string): DDPinochleCard[][] {
    let state: HandParseState = {
        suit: 'S',
        cards: [[]],
        input: input
    }
    while (state.input.length > 0) {
        state = advanceStringParse(state);
    }
    return state.cards;
}