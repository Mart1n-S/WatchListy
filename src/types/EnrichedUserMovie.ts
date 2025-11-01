import type { UserMovie } from "@/models/UserMovie";

/**
 * Version enrichie d'un film ou série utilisateur,
 * contenant les infos principales depuis TMDB.
 */
export interface EnrichedUserMovie extends UserMovie {
    title: string;
    poster_path: string | null;
    release_date?: string;
    vote_average?: number;
}
