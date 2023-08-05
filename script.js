//FRONTEND (FIRST PART) DOM
const seekBar = document.getElementById('seek-bar')
const song = document.getElementById('song')
const playBtn = document.getElementById('play-btn')
const songDuration = document.getElementById('song-duration')
const currentTime = document.getElementById('current-time')

//API INTEGRATION DOM (SECOND FORM)
const lyrics = document.getElementById('lyrics')
const relatedArtists = document.getElementById('related-artists')
const otherAlbums = document.getElementById('other-albums')
const content = document.getElementById('content')

//metadata of the loaded track
song.onloadedmetadata = function () {
  seekBar.max = song.duration
  seekBar.value = song.currentTime
  song.pause()
}

//event listener for the mp3 player control
playBtn.addEventListener('click', () => {
  if (playBtn.classList.contains('fa-pause')) {
    song.pause()
    playBtn.classList.remove('fa-pause')
    playBtn.classList.add('fa-play')
  } else {
    song.play()
    playBtn.classList.remove('fa-play')
    playBtn.classList.add('fa-pause')
  }
})

//dynamically changing the value of the current time and song duration based on the track
if (song.play()) {
  setInterval(() => {
    seekBar.value = song.currentTime
    songDuration.innerText = formatTime(song.duration)
    currentTime.innerText = formatTime(song.currentTime)
  }, 300)
}

//event listener for browsing the track
seekBar.addEventListener('change', () => {
  song.currentTime = seekBar.value
})

//formatting the current time and song duration in time:minute <00:00> format
const formatTime = (time) => {
  let min = Math.floor(time / 60)

  if (min < 10) min = `0${min}`

  let sec = Math.floor(time % 60)

  if (sec < 10) sec = `0${sec}`

  return `${min} : ${sec}`
}

//API INTEGRATION
const lyricsConfig = {
  method: 'GET',
  url: 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/',
  params: { id: '7076626' },
  headers: {
    'X-RapidAPI-Key': '00183be6b6mshd6855c57a934978p1e2b63jsn42e9090d124d',
    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com',
  },
}

//function go get the lyrics of the current track
const getLyrics = async () => {
  try {
    const response = await axios.request(lyricsConfig)
    return response.data.lyrics.lyrics.body.html
  } catch (error) {
    console.error(error)
  }
}

const showLyrics = async () => {
  const lyrics = await getLyrics()
  console.log(lyrics)
  lyricsContent = lyrics
}

const otherAlbumsConfig = {
  method: 'GET',
  url: 'https://spotify23.p.rapidapi.com/artist_albums/',
  params: {
    id: '06HL4z0CvFAxyc27GXpf02',
    offset: '0',
    limit: '100',
  },
  headers: {
    'X-RapidAPI-Key': '102666777bmshe8515faad7a1171p1d295cjsnda8bb99506c1',
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
  },
}

//function to get current artist other available albums
const getAlbums = async () => {
  try {
    const response = await axios.request(otherAlbumsConfig)
    const data = response.data.data.artist.discography.albums.items

    return data
  } catch (error) {
    console.error(error)
  }
}

const relatedArtistsConfig = {
  method: 'GET',
  url: 'https://spotify23.p.rapidapi.com/artist_related/',
  params: {
    id: '06HL4z0CvFAxyc27GXpf02',
  },
  headers: {
    'X-RapidAPI-Key': '102666777bmshe8515faad7a1171p1d295cjsnda8bb99506c1',
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
  },
}

const getRelatedArtists = async () => {
  try {
    const response = await axios.request(relatedArtistsConfig)

    //console.log(response.data.data)

    const data = response.data.artists;

    return data
  } catch (error) {
    console.error(error)
  }
}

//EVENT LISTENERS
window.addEventListener('load', async () => {
  content.innerHTML = await getLyrics()
  lyrics.classList.add('font-black')
  relatedArtists.classList.remove('font-black')
  otherAlbums.classList.remove('font-black')

  content.classList.add('mt-3')
  content.classList.add('text-lg')
  content.classList.add('pt-3')
})

otherAlbums.addEventListener('click', async () => {
  otherAlbums.classList.add('font-black')
  lyrics.classList.remove('font-black')
  relatedArtists.classList.remove('font-black')

  content.classList.add('mt-3')
  content.classList.add('text-lg')
  content.classList.add('pt-3')

  const data = await getAlbums()

  const html = data.map((item) => {
    const imgUrl = item.releases.items[0].coverArt.sources[0].url
    const title = item.releases.items[0].name
    const year = item.releases.items[0].date.year

    return `<div class='pb-4'>
                  <img class='rounded-md h-[250px] w-[250px]' src='${imgUrl}'>
                  <h3 class='text-sm '>${title}</h3>
                  <h3 class='text-sm italic'>${year}</h3>
            </div>`
  })
  content.innerHTML = html.join('')
})

relatedArtists.addEventListener('click', async () => {
  otherAlbums.classList.remove('font-black')
  lyrics.classList.remove('font-black')
  relatedArtists.classList.add('font-black')

  content.classList.add('mt-3')
  content.classList.add('text-lg')
  content.classList.add('pt-3')


  const data = await getRelatedArtists()

  const html = data.map((item) => {
    const imgUrl = item.images[0].url;
    const name = item.name

    console.log(item)
    return `<div class='pb-4'>
                  <img class='rounded-md h-[250px] w-[250px]' src='${imgUrl}'>
                  <h3 class='text-sm '>${name}</h3>
            </div>`
  })

  content.innerHTML = html.join('')
})
