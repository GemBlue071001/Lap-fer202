export interface Comment {
    rating: number;
    comment: string;
    author: string;
    date: string;
}

export interface Orchid {
    id: string;
    name: string;
    rating: number;
    isSpecial: boolean;
    isNatural: boolean;
    image: string;
    color: string;
    numberOfLikes: number;
    origin: string;
    category: string;
    feedback?: Comment[];
}

