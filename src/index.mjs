import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

const app = express()

app.use(express.json())

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_API_KEY = process.env.TMDB_API_KEY

const PORT = process.env.PORT || 3000;


const fetchFromTmdb = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${TMDB_API_KEY}`,
            Accept: 'application/json',
        },
            params,
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching from TMDB:', error.response?.data || error.message);
        return null;
    }
};


app.get('api/v1/movies/popular', async (req, res) => {
    let movies = [];
    for (let page = 1; page <= 5; page++) {
        const data = await fetchFromTmdb('/movie/popular?language=en-US', { page });
        if (data) {
            movies = [...movies, ...data.results.map(movie => ({
                ...movie,
                profile_picture_url: `${TMDB_IMAGE_URL}${movie.poster_path}`,
                streaming_site_1: `https://vidsrc.xyz/embed/movie/${movie.id}`,
                streaming_site_2: `https://www.2embed.stream/embed/movie/${movie.id}`,
                streaming_site_3: `https://multiembed.mov/directstream.php?video_id=${movie.id}&tmdb=1`,
            }))];
        }
    }
    res.json(movies);
});

app.get('api/v1/movies/now_playing', async (req, res) => {
    let movies = [];
    for (let page = 1; page <= 5; page++) {
        const data = await fetchFromTmdb('/movie/now_playing?language=en-US', { page });
        if (data) {
            movies = [...movies, ...data.results.map(movie => ({
                ...movie,
                profile_picture_url: `${TMDB_IMAGE_URL}${movie.poster_path}`,
                streaming_site_1: `https://vidsrc.xyz/embed/movie/${movie.id}`,
                streaming_site_2: `https://www.2embed.stream/embed/movie/${movie.id}`,
                streaming_site_3: `https://multiembed.mov/directstream.php?video_id=${movie.id}&tmdb=1`,
            }))];
        }
    }
    res.json(movies);
});

app.get('api/v1/movies/top-rated', async (req, res) => {
    let movies = [];
    for (let page = 1; page <= 5; page++) {
        const data = await fetchFromTmdb('/movie/top_rated?language=en-US', { page });
        if (data) {
            movies = [...movies, ...data.results.map(movie => ({
                ...movie,
                profile_picture_url: `${TMDB_IMAGE_URL}${movie.poster_path}`,
                streaming_site_1: `https://vidsrc.xyz/embed/movie/${movie.id}`,
                streaming_site_2: `https://www.2embed.stream/embed/movie/${movie.id}`,
                streaming_site_3: `https://multiembed.mov/directstream.php?video_id=${movie.id}&tmdb=1`,
            }))];
        }
    }
    res.json(movies);
});

app.get('api/v1/movies/genres', async (req, res) => {
    try {
        const data = await fetchFromTmdb('/genre/movie/list', { language: 'en' });

        if (!data || !data.genres) {
            return res.status(500).json({ error: 'Failed to fetch genres or genres are missing from response' });
        }

        res.json(data.genres);
    } catch (error) {
        console.error('Error fetching genres:', error.message || error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('api/v1/movies/genres/:genreId', async (req, res) => {
    const { genreId } = req.params;
    let { page = 1 } = req.query; 
    page = Number(page); // Ensure page is a number

    let movies = [];
    for (let i = page; i < page + 5; i++) {
        const data = await fetchFromTmdb('/discover/movie', {
            include_adult: false,
            include_video: false,
            language: 'en-US',
            page: i,
            sort_by: 'popularity.desc',
            with_genres: genreId,
        });

        if (data) {
            movies = [...movies, ...data.results.map(movie => ({
                ...movie,
                profile_picture_url: `${TMDB_IMAGE_URL}${movie.poster_path}`,
            }))];
        }
    }

    res.json(movies);
});


app.get('api/v1/movies/search', async (req, res) => {
    const query = req.query.query; 
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    let movies = [];
    for (let page = 1; page <= 5; page++) {
        const data = await fetchFromTmdb('/search/movie', {
            query, 
            include_adult: false,
            language: 'en-US',
            page,
        });

        if (data) {
            movies = [...movies, ...data.results.map(movie => ({
                ...movie,
                profile_picture_url: `${TMDB_IMAGE_URL}${movie.poster_path}`,
            }))];
        }
    }

    res.json(movies);
});



app.get('api/v1/movies/:id', async (req, res) => {
    const movieId = req.params.id;
    
    if (!movieId) {
        return res.status(400).json({ error: 'Movie ID is required' });
    }

    try {
        const data = await fetchFromTmdb(`/movie/${movieId}`, { language: 'en' });

        if (!data) {
            return res.status(404).json({ error: 'Movie not found' });
        }


        data.profile_picture_url = `${TMDB_IMAGE_URL}${data.poster_path}`;
        data.streaming_site_1 = `https://vidsrc.xyz/embed/movie/${data.id}`;
        data.streaming_site_2 = `https://www.2embed.stream/embed/movie/${data.id}`;
        data.streaming_site_3 = `https://multiembed.mov/directstream.php?video_id=${data.id}&tmdb=1`;

        res.json(data);

    } catch (error) {
        console.error('Error fetching movie details:', error.message || error);
        res.status(500).json({ error: 'Internal server error while fetching movie details' });
    }
});

app.get('/', (request, response) => {
    response.send({ 'created_by': 'KEVIN KYLE GANADOS', 'msg': 'TEST USING EXPRESS.JS' })
})


app.listen(PORT, () => {
    console.log('RUNNING PORT', PORT)
});

