import  {Card, simpleDeck} from '../card';

const DDPINOCHLERANKS = {
    ACE: 'A',
    TEN: 'T',
    KING: 'K',
    QUEEN: 'Q',
    JACK: 'J'
} as const;

const DDPINOCHLESUITS = {
    HEARTS: 'H',
    DIAMONDS: 'D',
    CLUBS: 'C',
    SPADES: 'S'
} as const;
export type DDPinochleRank = typeof DDPINOCHLERANKS[keyof typeof DDPINOCHLERANKS];
export type DDPinochleSuit = typeof DDPINOCHLESUITS[keyof typeof DDPINOCHLESUITS];
const suits: DDPinochleSuit[] = [...Object.values(DDPINOCHLESUITS)];
const ranks: DDPinochleRank[] = [...Object.values(DDPINOCHLERANKS)]
    .concat([...Object.values(DDPINOCHLERANKS)])
    .concat([...Object.values(DDPINOCHLERANKS)])
    .concat([...Object.values(DDPINOCHLERANKS)])
export const ddpinochleDeck = () => simpleDeck(ranks, suits);
export type DDPinochleCard = Card<DDPinochleRank, DDPinochleSuit>;
export type DDPinochleHand = DDPinochleCard[];