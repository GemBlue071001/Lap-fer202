export interface Comment {
    userId: number;
    content: string;
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
    comments?: Comment[];
}

