import { AppDispatch } from "../store";
import { setGenres } from "../slices/genresSlice";

export const fetchGenres = () => async (dispatch: AppDispatch) => {
    try {
        // Vérifie le cache local (pour éviter des appels API inutiles)
        const cached = localStorage.getItem("genres");
        if (cached) {
            dispatch(setGenres(JSON.parse(cached)));
            return;
        }

        // Appel de ton API interne sécurisée
        const res = await fetch("/api/tmdb/genres", { cache: "force-cache" });

        if (!res.ok) {
            throw new Error("Erreur lors de la récupération des genres");
        }

        const data = await res.json();
        dispatch(setGenres(data));
        localStorage.setItem("genres", JSON.stringify(data));
    } catch (error) {
        console.error("Erreur fetchGenres:", error);
    }
};
