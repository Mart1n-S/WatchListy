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
    title?: string; // pour les films
    name?: string; // pour les séries TV
    poster_path: string | null;
    release_date?: string; // pour les films
    first_air_date?: string; // pour les séries TV
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
//  Détails d’une série TV
// ==========================

export interface TmdbTvDetails {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    tagline: string | null;
    status: string;
    first_air_date: string;
    last_air_date?: string;
    number_of_seasons?: number;
    number_of_episodes?: number;
    episode_run_time?: number[];
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
    networks?: { id: number; name: string; logo_path: string | null }[];
}

// ==========================
//  Crédits TMDB (film ou série)
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

export interface TmdbTvFull {
    details: TmdbTvDetails;
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
//  Réponses paginées génériques TMDB
// ==========================

export interface TmdbPaginatedResponse<T> {
    page: number;
    total_pages: number;
    total_results: number;
    results: T[];
}

// ==========================
//  Détails simplifiés d’un média (film ou série)
// ==========================

export interface TmdbItemDetails {
    id: number;
    title?: string; // Films
    name?: string; // Séries TV
    poster_path?: string | null;
    release_date?: string; // Films
    first_air_date?: string; // Séries TV
    vote_average?: number;
}
