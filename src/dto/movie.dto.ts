import { z } from "zod";

const maxStringCharacters = 255;
const minStringCharacters = 1;

export const MovieSchema = z.object({
    genres: z.array(z.string()).nonempty(),
    title: z.string().min(minStringCharacters).max(maxStringCharacters),
    director: z.string().min(minStringCharacters).max(maxStringCharacters),
    year: z.number().int().min(1900),
    runtime: z.number().int().min(1),
    actors: z.string().optional(),
    plot: z.string().optional(),
    posterUrl: z.string().optional(),
});

type MovieId = { id: number };

export type MovieInput = z.infer<typeof MovieSchema>;

export type Movie = MovieInput & MovieId;

export type DbMovie = Omit<Movie, "runtime" | "year"> & {
    runtime: string;
    year: string;
};
