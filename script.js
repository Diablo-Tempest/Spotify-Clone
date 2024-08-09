const hamburger = document.querySelector('#hamburger');
const play_bar = document.getElementById('play-bar');
const left = document.querySelector('.left');
const cancel = document.querySelector('#cancel');
const song_play = document.getElementById('song-play');
const previous_song_play = document.getElementById('previous-song-play');
const next_song_play = document.getElementById('next-song-play');
const vol = document.querySelector('#vol');
const vol_range = document.querySelector('#vol-range');
let currentSong = new Audio();
let songs;
let current_folder;
function sleep() {
    return new Promise(resolve => setTimeout(resolve, 200));
}

function formatTime(secondsInput) {
    if (isNaN(secondsInput) || secondsInput<0) {
        return '-';
    }
    const seconds = Math.round(parseFloat(secondsInput)); // Convert to number and round

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) { 
    current_folder = folder;
    let songList = await fetch(`/songs/${current_folder}/`);
    let response = await songList.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith('mp3')){
            let temp = element.href.split(`${current_folder}/`)[1];
            songs.push(decodeURI(temp.split('.mp3')[0]));
        }
    }

    // show the songs in playlists 

    let songUl = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUl.innerHTML='';
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> ${song} </li>`;
    }

    // attach event listener to each song
    
    play_bar.style.transition = 'opacity 0.5s normal ease-out';
    Array.from(document.querySelector(".songList").getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', async () => {
            if (play_bar.style.opacity === '0') {
                play_bar.style.opacity = '1';
                play_bar.style.visibility = 'visible';
            }
            currentSong.pause()
            document.querySelector('#song-play').src = '/assets/images/play.svg';
            await sleep();
            playMusic(e.innerText);
        });
    });
}

const playMusic = (music)=>{
    currentSong.src = `songs/${current_folder}/` + music + '.mp3';
    currentSong.play();
    document.querySelector('#song-play').src = '/assets/images/paused.svg';
    document.querySelector('#song-info').innerHTML = `<marquee>${music}</marquee>`;
    document.querySelector('#song-time').innerHTML = "- / -";
}
async function displayAlbums() {
    let songList = await fetch(`/songs/`);
    let response = await songList.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
    
        if (e.href.includes('/songs/') && !(e.href.includes('.htaccess'))) {
            let folder = e.href.split('/')[4];

            // get the meta data of the folder
            let songList = await fetch(`/songs/${folder}/info.json`);
            let response = await songList.json();
            cardContainer = document.querySelector('.cardContainer');
            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folder}" class="card">
                <img
                    src="/assets/CardBanner/${folder}.jpeg"
                    alt=""
                />
                <div class="play-button">
                    <img class="playButton" src="/assets/images/music-play.svg" alt="">
                </div>
                <div class="desc">
                    <h3>${response.title}</h3>
                    <p>${response.description}</p>
                </div>
            </div>`
        }
    }
    // load the playlists when a card is clicked
    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async (item) => {
            await getSongs(`${item.currentTarget.dataset.folder}`);

            // event for menu opening when a banner is clicked
            if (window.innerWidth <= 700){
                left.style.left = '-1%';
                cancel.style.display = 'block';
                hamburger.style.display = 'none';
                left.style.transition = 'left 0.3s normal ease-out';
            }

        })
    });
}
async function main(){

    // display all the albums in the page
    displayAlbums();
   
    //previous song
    previous_song_play.addEventListener('click', async ()=>{
        console.log(currentSong.src.split('/'));
        let index = songs.indexOf(decodeURI(currentSong.src.split('/')[5].split('.mp3')[0]));
        console.log(index);
        if(index === 0){
            currentSong.pause()
            document.querySelector('#song-play').src = '/assets/images/play.svg';
            await sleep();
            playMusic(songs[index]);
        }
        else{
            currentSong.pause()
            document.querySelector('#song-play').src = '/assets/images/play.svg';
            await sleep();
            playMusic(songs[index-1]);
        }
        
    });
    
    //next song
    next_song_play.addEventListener('click', async ()=>{
        let index = songs.indexOf(decodeURI(currentSong.src.split('/')[5].split('.mp3')[0]));
        if (index === songs.length-1) {
            currentSong.pause()
            document.querySelector('#song-play').src = '/assets/images/play.svg';
            await sleep();
            playMusic(songs[index]);
        }
        else {
            currentSong.pause()
            document.querySelector('#song-play').src = '/assets/images/play.svg';
            await sleep();
            playMusic(songs[index + 1]);
        }
    });

    // event listener for volume button functionality
    
    if (window.innerWidth <= 700) {
        vol_range.style.opacity = '1';
        vol_range.style.visibility = 'visible';
    }
    vol_range.getElementsByTagName('input')[0].addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value)/100;
        if (e.target.value>=60) {
            console.log(e.target.value);
            vol.src = '/assets/images/volume-max.svg';
        }
        else if (e.target.value > 0 && e.target.value < 60) {
            vol.src = '/assets/images/volume-min.svg';
        }
        else if(e.target.value == 0){
            vol.src = '/assets/images/volume-out.svg';
        }
    });
    
    // event listener for volume button
    vol.addEventListener('click', () => {
        
        if (currentSong.volume === 0) {
            currentSong.volume = 0.1;
            vol_range.getElementsByTagName('input')[0].value = currentSong.volume * 100;
            vol.src = '/assets/images/volume-min.svg';
        }
        else {
            currentSong.volume = 0;
            vol_range.getElementsByTagName('input')[0].value = 0;
            vol.src = '/assets/images/volume-out.svg';
        }

    });

    //media controls trough space-bar key and play/pause key
    document.querySelector('body').addEventListener("keydown", (event) => {
        if (event.code === "Space" || event.code === "MediaPlayPause") {
            event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
            if (currentSong.paused) {
                song_play.src = '/assets/images/paused.svg';
                currentSong.play();
            }
            else {
                song_play.src = '/assets/images/play.svg';
                currentSong.pause();
            }
        }
    });
    //media controls trough clicks
    song_play.addEventListener('click', ()=>{
        if (currentSong.paused) {
            song_play.src = '/assets/images/paused.svg';
            currentSong.play();
        }
        else{
            song_play.src = '/assets/images/play.svg';
            currentSong.pause()
        }
    });

    // listen for timeupdate event
    currentSong.addEventListener('timeupdate', ()=>{
        document.querySelector('#song-time').innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector('.circle').style.left = (currentSong.currentTime/currentSong.duration)*98.5 + '%';
        if (formatTime(currentSong.currentTime) === formatTime(currentSong.duration)) {
            song_play.src = '/assets/images/play.svg';
            document.querySelector('.circle').style.left = '0%';
        }
    });
    
    // add an event listener to seekbar
    document.querySelector('.seekbar').addEventListener('click', (e)=>{
        let seek = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector('.circle').style.left = seek + '%';
        currentSong.currentTime = (currentSong.duration * seek)/100
    });

    // hamburger
    
    hamburger.addEventListener('click', ()=>{
        left.style.left = '-1%';
        cancel.style.display = 'block';
        hamburger.style.display = 'none';
        left.style.transition = 'left 0.3s normal ease-out';
    });
    cancel.addEventListener('click', ()=>{
        left.style.left = '-100%';
        cancel.style.display = 'none';
        hamburger.style.display = 'block';
        left.style.transition = 'left 0.3s normal ease-in';
    });

    
}
main();