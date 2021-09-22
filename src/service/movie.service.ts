import { ParsedQuery } from "../controller/dto/query.dto";
import { ContainerDependencies } from "../dependency-injection/container";
import { MovieRepository } from "../repository/movie.repository";
import { Movie } from "../dto/movie.dto";

export class MovieService {
    movieRepository: MovieRepository;

    constructor({ movieRepository }: ContainerDependencies) {
        this.movieRepository = movieRepository;
    }

    getMovies(_query: ParsedQuery): Movie[] {
        return this.movieRepository.getMovies();
    }

    addMovie(): string {
        this.validate();
        return "TODO";
    }

    validate(): void {
        return;
    }
}
