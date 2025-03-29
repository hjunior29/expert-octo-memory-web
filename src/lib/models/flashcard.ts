export class Flashcard {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    title?: string;
    question?: string;
    answer?: string;
    topicId?: number;
    tags?: string[];
    difficulty?: string;
    lastReviewed?: Date;
    reviewCount?: number;
}

export type FlashcardGenerate = {
    files?: { name: string, base64: string }[];
    link?: string;
    text?: string;
    topic?: string;
}
