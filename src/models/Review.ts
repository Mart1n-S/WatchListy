import { ObjectId, Db } from "mongodb";

export interface Review {
    _id?: ObjectId;
    movieId: number;
    userId: string;
    userName: string;
    userImage?: string | null;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
}

// Index unique movieId + userId
export const createReviewIndexes = async (db: Db) => {
    await db.collection<Review>("reviews").createIndex(
        { movieId: 1, userId: 1 },
        { unique: true }
    );
};
