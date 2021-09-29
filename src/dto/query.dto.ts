export interface QueryParams {
    duration?: string;
    genres?: string;
}

export interface ParsedQuery {
    duration: number | null;
    genres: string[] | null;
}
