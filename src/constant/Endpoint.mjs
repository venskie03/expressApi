export const MovieApi = {
    nowPlayingMovies: "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
    getGenresID: "https://api.themoviedb.org/3/genre/movie/list?language=en",
    popularMovies: "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    getMoviedetails: (id) => `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    getMoviesByGenre: (id) => `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=2&sort_by=popularity.desc&with_genres=${id}`,
    searchMoviesByName: (params) => `https://api.themoviedb.org/3/search/movie?query=${params}&include_adult=false&language=en-US&page=1`,
    getTopratedMovies: "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
}
