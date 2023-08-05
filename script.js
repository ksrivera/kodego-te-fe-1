//DOM
const seekBar = document.getElementById("seek-bar");
const song = document.getElementById("song");
const playBtn = document.getElementById("play-btn");
const songDuration = document.getElementById('song-duration');
const currentTime = document.getElementById('current-time');

//metadata of the loaded track
song.onloadedmetadata = () => {
    seekBar.max = song.duration;
    seekBar.value = song.currentTime;
    song.pause();
}

//not a fan of autoplay
window.onload = () => {
  song.pause();
}

//event listener for the mp3 player control
playBtn.addEventListener('click', () => {
    if(playBtn.classList.contains('fa-pause')){
        song.pause();
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
        
    } else {
        song.play();
        playBtn.classList.remove('fa-play');        
        playBtn.classList.add('fa-pause');
    }
})

//dynamically changing the value of the current time and song duration based on the track
if(song.play()) {
    setInterval(() => {
        seekBar.value = song.currentTime;
        songDuration.innerText = formatTime(song.duration); 
        currentTime.innerText = formatTime(song.currentTime);
    }, 300);
}

//event listener for browsing the track
seekBar.addEventListener('change', () => {
    song.currentTime = seekBar.value;
});

//formatting the current time and song duration in time:minute <00:00> format
const formatTime = (time) => {
    let min = Math.floor(time / 60);

    if (min < 10) min = `0${min}`; 
    
    let sec = Math.floor(time % 60);
    
    if(sec < 10) sec = `0${sec}`;
    
    return `${min} : ${sec}`;
}