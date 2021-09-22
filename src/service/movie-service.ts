import { ParsedQuery } from "../controller/dto/query.dto";

export class MovieService {
    getMovies(_query: ParsedQuery): string {
        return "TODO";
    }

    addMovie(): string {
        this.validate();
        return "TODO";
    }

    validate(): void {
        return;
    }
}
