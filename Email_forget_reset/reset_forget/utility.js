const dotenv= require('dotenv');
dotenv.config();

const headers= {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
  }
  
  const tmdbBASEURL="https://api.themoviedb.org/3/"
  const imageBASEURL= "https://image.tmdb.org/t/p/original/"
  // const nowPlaying ="movie/now_playing?language=en-US&page=1";
  // const toprated= "movie/top_rated"
  const TMDB_ENDPOINT = {
    // Home Page
    fetchcurrentMovies    : "/movie/now_playing",
    fetchTrending      : "/trending/all/week",
    fetchPopular       : "/trending/all/week",
    fetchUpcoming      : "/movie/upcoming?include_video=true",
    fetchTopRated      : "/movie/top_rated?include_video=true",
  
    fetchActionMovies  : '/discover/movie?language=en-US&with_genres=28',
    fetchComedyMovies  : '/discover/movie?language=en-US&with_genres=35',
    fetchHorrorMovies  : '/discover/movie?language=en-US&with_genres=27',
    fetchRomanceMovies : '/discover/movie?language=en-US&with_genres=10749',
    fetchAnimeMovies   : '/discover/movie?language=en-US&with_genres=16',
  
    fetchMovieVideos   : (id) => `/movie/${id}/videos`,
    fetchMovieDetails  : (id) => `/movie/${id}`,
  
    fetchActionTvShows : '/discover/tv?language=en-US&with_genres=10759',
    fetchComedyTvShows : '/discover/tv?language=en-US&with_genres=35',
    fetchMysteryTvShows: '/discover/tv?language=en-US&with_genres=9648',
    fetchDramaTvShows  : '/discover/tv?language=en-US&with_genres=18',
    fetchCrimeTvShows  : '/discover/tv?language=en-US&with_genres=80',
  
    fetchTvShowVideos  : (id) => `/tv/${id}/videos`,
    fetchTvShowDetails : (id) => `/tv/${id}`
  };

  async function getMediaList(endpoint) {
  
    const url = tmdbBASEURL + endpoint;
  
    const response = await fetch(endpoint, {
      method: "GET",
      headers: headers
      
    })
    const data= response.json();
    return data;
  }

  module.exports={
    getMediaList, TMDB_ENDPOINT
  }