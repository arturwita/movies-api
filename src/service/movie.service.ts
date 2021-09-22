import { ParsedQuery } from "../controller/dto/query.dto";
import { ContainerDependencies } from "../dependency-injection/container";
import { MovieRepository } from "../repository/movie.repository";
import { Movie } from "../dto/movie.dto";
import { Exception } from "../error/exception";
import { HTTP_ERROR_CODE } from "../error/error-codes";

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
        throw new Exception(400, "Invalid movie schema", HTTP_ERROR_CODE.BAD_REQUEST);
    }
}
