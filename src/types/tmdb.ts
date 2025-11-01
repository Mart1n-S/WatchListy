// ==========================
//  Types de base TMDB
// ==========================

export interface TmdbGenre {
    id: number;
    name: string;
}

export interface TmdbImage {
    file_path: string;
    width: number;
    height: number;
    aspect_ratio: number;
}

export interface TmdbVideo {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official?: boolean;
    published_at?: string;
}

export interface TmdbCredit {
    id: number;
    name: string;
    character?: string;
    job?: string;
    profile_path: string | null;
}

export interface TmdbRecommendation {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    overview: string;
    vote_average: number;
}

export interface TmdbProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}

// ==========================
//  Détails d’un film
// ==========================

export interface TmdbMovieDetails {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    tagline: string | null;
    status: string;
    release_date: string;
    runtime: number | null;
    poster_path: string | null;
    backdrop_path: string | null;
    genres: TmdbGenre[];
    vote_average: number;
    vote_count: number;
    popularity: number;
    original_language: string;
    homepage: string | null;
    production_companies?: TmdbProductionCompany[];
    spoken_languages?: { iso_639_1: string; name: string }[];
    budget?: number;
    revenue?: number;
}

// ==========================
//  Crédits du film
// ==========================

export interface TmdbCredits {
    cast: TmdbCredit[];
    crew: TmdbCredit[];
}

// ==========================
//  Ensemble complet pour la page détail
// ==========================

export interface TmdbMovieFull {
    details: TmdbMovieDetails;
    credits: TmdbCredits;
    videos: {
        results: TmdbVideo[];
    };
    recommendations: {
        results: TmdbRecommendation[];
    };
    fetchedAt: string;
}

// ==========================
//  Réponses génériques TMDB
// ==========================

export interface TmdbPaginatedResponse<T> {
    page: number;
    total_pages: number;
    total_results: number;
    results: T[];
}
