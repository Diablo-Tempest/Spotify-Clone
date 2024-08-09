function sleep() {
    return new Promise(resolve => setTimeout(resolve, 200));
}

const play = document.getElementsByClassName('playButton');
for (let i = 0; i < play.length; i++) {
    play[i].addEventListener("mouseover", () => {
        play[i].src = "/assets/images/music-play-2.svg";
    });
    play[i].addEventListener("mouseout", () => {
        play[i].src = "/assets/images/music-play.svg";
    });
}

// event listener for volume button visibility

// const vol = document.querySelector('#vol');
// const vol_range = document.querySelector('#vol-range');
vol_range.style.transition = 'opacity 0.5s normal ease-out';
if (window.innerWidth <= 700) {
    vol_range.style.opacity = '1';
    vol_range.style.visibility = 'visible';
}
else{

    vol.addEventListener('mouseover', ()=>{
        vol_range.style.opacity = '1';   
        vol_range.style.visibility = 'visible';
    });
    vol.addEventListener('mouseout', ()=>{
        vol_range.style.opacity = '0';
    
    });

    vol_range.addEventListener('mouseover', ()=>{
        vol_range.style.opacity = '1';
        vol_range.style.visibility = 'visible';
    });
    vol_range.addEventListener('mouseout', async ()=>{
        vol_range.style.opacity = '0';
        await sleep();
        vol_range.style.visibility = 'hidden';
    });
}

