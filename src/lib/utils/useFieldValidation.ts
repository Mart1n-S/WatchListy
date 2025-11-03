import { useCallback, useEffect } from "react";
import { type ZodObject, type ZodRawShape, ZodError } from "zod";

/**
 * Hook réutilisable de validation champ par champ :
 * - Affiche les erreurs à la perte de focus réelle
 * - Supprime les erreurs dès que le champ redevient valide
 * - Gère les validations croisées (ex: password/confirmPassword)
 */
export function useFieldValidation<
    S extends ZodObject<ZodRawShape>,
    Values extends Record<string, unknown> = S["_input"]
>(
    schema: S,
    values: Values,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    t: (key: string) => string,
    crossFields: (keyof Values)[] = []
) {
    /** Validation d’un champ individuel (appelé au focusout) */
    const validateField = useCallback(
        <K extends keyof Values>(field: K) => {
            try {
                if (crossFields.includes(field)) {
                    // Valide tout le schéma pour déclencher superRefine
                    schema.parse(values);
                } else {
                    const singleSchema = schema.pick({
                        [field as string]: true,
                    } as Record<string, true>);
                    singleSchema.parse({ [field]: values[field] });
                }

                setErrors((prev) => ({ ...prev, [field as string]: "" }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const issue = error.issues.find(
                        (i) => i.path[0] === (field as string)
                    );
                    if (issue) {
                        setErrors((prev) => ({
                            ...prev,
                            [field as string]: t(issue.message),
                        }));
                    }
                }
            }
        },
        [schema, values, t, crossFields, setErrors]
    );

    /** Écouteur global pour la perte de focus réelle (focusout) */
    useEffect(() => {
        const handleFocusOut = (e: FocusEvent) => {
            const target = e.target as HTMLInputElement | null;
            const nameOrId = target?.name || target?.id;
            if (!nameOrId) return;
            const field = nameOrId as keyof Values;
            if (Object.prototype.hasOwnProperty.call(values, field)) {
                validateField(field);
            }
        };

        document.addEventListener("focusout", handleFocusOut, true);
        return () => document.removeEventListener("focusout", handleFocusOut, true);
    }, [validateField, values]);

    /** Pendant la saisie : supprime l’erreur si le champ devient valide */
    const handleChangeValidation = useCallback(
        <K extends keyof Values>(field: K, nextValue: Values[K]) => {
            try {
                const singleSchema = schema.pick({
                    [field as string]: true,
                } as Record<string, true>);
                singleSchema.parse({ [field]: nextValue });
                setErrors((prev) => ({ ...prev, [field as string]: "" }));
            } catch {
                // ignore : l’erreur s’affichera au blur
            }

            // Validation croisée (ex: confirmPassword)
            if (crossFields.includes(field)) {
                try {
                    schema.parse({ ...values, [field]: nextValue });
                    setErrors((prev) => {
                        const updated = { ...prev };
                        for (const f of crossFields) delete updated[f as string];
                        return updated;
                    });
                } catch {
                    // ignore
                }
            }
        },
        [schema, values, crossFields, setErrors]
    );

    return { validateField, handleChangeValidation };
}
