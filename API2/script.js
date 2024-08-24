const clientId = '7bd0a1332fab4e4983aa13ab2ccddcc6';  
const clientSecret = '97b18e06d7434044a4db34147faf93c3'; 
const playlistId = '3APN21v6MQ1kWdVhksknp2';  

let songTemplate = Handlebars.compile(document.getElementById("songCard").innerHTML);

let offset = 0;
const limit = 10;

async function getToken() {
    const encodedCredentials = btoa(`${clientId}:${clientSecret}`);
    
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${encodedCredentials}`
            },
            body: new URLSearchParams({ grant_type: 'client_credentials' })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response from Spotify:', errorData);
            throw new Error(`Failed to obtain access token: ${errorData.error} - ${errorData.error_description}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error.message);
    }
}

async function fetchTopSongs(token) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response from Spotify:', errorData);
            throw new Error(`Failed to fetch songs: ${errorData.error} - ${errorData.error_description}`);
        }

        const data = await response.json();

        if (!data.items || !Array.isArray(data.items)) {
            console.error('Invalid response structure:', data);
            throw new Error('Unexpected response structure from Spotify API');
        }

        offset += limit;

        let tracksArr = data.items.map(item => ({
            name: item.track.name,
            artist: item.track.artists.map(artist => artist.name).join(', '),
            imageUrl: item.track.album.images[0]?.url || 'default-image-url.jpg',
            spotifyUrl: item.track.external_urls.spotify
        }));

        return { tracks: tracksArr };
    } catch (error) {
        console.error('Error fetching songs:', error.message);
    }
}

function renderSongs(songList) {
    const container = document.getElementById('content');
    const html = songTemplate(songList);
    container.insertAdjacentHTML('beforeend', html);
}

async function initialLoad() {
    const token = await getToken();
    if (token) {
        const songList = await fetchTopSongs(token);
        if (songList) {
            renderSongs(songList);
        }
    }
}

document.getElementById('loadMoreButton').addEventListener('click', async () => {
    await initialLoad();
});

initialLoad();
document.getElementById('yearText').innerHTML = new Date().getFullYear();
