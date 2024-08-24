const apiKey = '3383ed84'; 
const movieContainer = document.getElementById('content');
let currentPage = 1; 
const moviesPerPage = 5; 

async function fetchMovies(page) {
    const movieIDs = [
        'tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 'tt0050083',
        'tt0108052', 'tt0137523', 'tt0120815', 'tt0133093', 'tt1375666',
        'tt0110912', 'tt0180093', 'tt0053198', 'tt0099685', 'tt0076759',
        'tt0095327', 'tt0109830', 'tt0073486', 'tt0060196', 'tt0088763',
        'tt0120689', 'tt0114369', 'tt0107290', 'tt0095765', 'tt0088258',
        'tt0077683', 'tt0075148', 'tt0077889', 'tt0078935', 'tt0077632',
        'tt0074977', 'tt0074676', 'tt0816692', 'tt0137523', 'tt0848228',
        'tt0167260', 'tt0816692', 'tt0848228', 'tt0120737', 'tt0133093',
        'tt0137523', 'tt0109830', 'tt0110912', 'tt0118715', 'tt0099685',
        'tt0080684', 'tt0133093', 'tt0093779', 'tt0119698', 'tt0133093'
    ];
    
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const currentMovieIDs = movieIDs.slice(startIndex, endIndex);
    
    const requests = currentMovieIDs.map(id =>
        fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
    );
    
    try {
        const responses = await Promise.all(requests);
        const movies = await Promise.all(responses.map(res => res.json()));
        
        const processedMovies = movies.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            rating: movie.imdbRating,
            imageUrl: movie.Poster,
            url: `https://www.imdb.com/title/${movie.imdbID}/`
        }));
        
        renderMovies(processedMovies);
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

function renderMovies(movies) {
    const source = document.getElementById('movieCard').innerHTML;
    const template = Handlebars.compile(source);
    const context = { movies: movies };
    const html = template(context);
    movieContainer.innerHTML += html;
}

fetchMovies(currentPage);

document.getElementById('loadMoreButton').addEventListener('click', () => {
    currentPage++;
    fetchMovies(currentPage);
});

document.getElementById('yearText').textContent = new Date().getFullYear();
