
function Sound(source, volume, loop) {
    this.source = source;
    this.volume = volume;
    this.loop = loop;
    var son;
    this.son = son;
    this.finish = false;
    this.stop = function () {
        document.body.removeChild(this.son);
    }
    this.start = function () {
        if (this.finish) return false;
        this.son = document.createElement("embed");
        this.son.setAttribute("src", this.source);
        this.son.setAttribute("hidden", "true");
        this.son.setAttribute("volume", this.volume);
        this.son.setAttribute("autostart", "true");
        this.son.setAttribute("loop", this.loop);
        document.body.appendChild(this.son);
    }
    this.remove = function () {
        document.body.removeChild(this.son);
        this.finish = true;
    }
    this.init = function (volume, loop) {
        this.finish = false;
        this.volume = volume;
        this.loop = loop;
    }
}


function bruh() {

    // Sound("/Queen – Bohemian Rhapsody (Official Video Remastered) (320 kbps).mp3", 1, false);
}
const PLAY = 0;
const PAUSE = 1;
const STOP = 2;

const playIcon = document.querySelector(".play-icon");
const pauseIcon = document.querySelector(".pause-icon");
const stopIcon = document.querySelector(".stop-icon");
const playPauseButton = document.getElementById("play-pause-button");



// Add a click event listener to toggle between play and pause icons
playPauseButton.addEventListener("click", function () {
    var state = getButtonIcon();
    if (state === PLAY){
        play();
        setButtonIcon(PAUSE);
    }else if(state == PAUSE){
        pause();
        setButtonIcon(PLAY);
    }else if (state == STOP){
        reset();
        setButtonIcon(PLAY);
    }
});

function setButtonIcon(val){
    if (val == PLAY){
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        stopIcon.style.display = "none";
    }else if (val == PAUSE){
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        stopIcon.style.display = "none";
    }else if (val == STOP){
        playIcon.style.display = "none";
        pauseIcon.style.display = "none";
        stopIcon.style.display = "block";
    }
}

setButtonIcon(PLAY);

function getButtonIcon(){
    if (playIcon.style.display == "block"){
        return PLAY;
    }else if (pauseIcon.style.display == "block" ){
        return PAUSE;
    }else if (stopIcon.style.display == "block" ){
        return STOP;
    }
}






var guess = 0;
var guessTimes = [0.5, 1, 2, 5, 10];
var maxTimeToPlay = 10;
var songIndex = 0;


async function updateTick(){
    if (curAud().currentTime >= guessTimes[guess]){
        pause();
        setButtonIcon(PLAY);
        guess ++;
    }
    if (curAud().currentTime >= maxTimeToPlay){
        pause();
        curAud().currentTime = maxTimeToPlay;
        setButtonIcon(STOP);
    }
    setProgressBarValue(
    (curAud().currentTime/maxTimeToPlay) * 100)
}

var songs = null;
async function bruh(){
    var tmpsongs = await getSongs();
    for(var i = 0; i < tmpsongs.length; i ++){
        var song = tmpsongs[i];
        song.push( new Audio('/songs/' + song[0]));
        song.push(i);
    }
    songs = tmpsongs;

    setInterval(updateTick, 100);
    reset();
}

bruh()

async function getSongs(){
    return await (await fetch("/songs")).json();
}

function curAud(){
    return songs[songIndex][2];
}

function play(){
    curAud().currentTime = 0;
    curAud().play();
}

function pause(){
    curAud().pause();
}

function resetForNext(){
    songIndex = getRandomInt(0, songs.length);
    pause();
    curAud().currentTime = 0;
    guess = 0;
}

function reset(){
    guess = 0;
    songIndex = getRandomInt(0, songs.length);
    curAud().currentTime = 0;
    setStreak(0);
}

// Get references to the slider and its thumb
const slider = document.getElementById("progress-slider");
const sliderThumb = document.querySelector(".slider::-webkit-slider-thumb");

// Add a change event listener to update the slider's gradient background
slider.addEventListener("input", updateSliderGradient);

// Function to update the slider's gradient background based on its value
function updateSliderGradient() {
    const value = slider.value; // Get the current slider value
    const colorStop = `${value}%`; // Calculate the color stop position

    // Set the gradient background based on the slider's value
    slider.style.background = `linear-gradient(to right, red 0%, red ${colorStop}, grey ${colorStop}, grey 100%)`;
}

// Initial update of the slider's gradient background
updateSliderGradient();



const streakCountElement = document.getElementById("streak-count");

// Functions to manipulate the streak counter
function incrementStreak() {
    const currentStreak = parseInt(streakCountElement.textContent, 10);
    streakCountElement.textContent = currentStreak + 1;
}

function decrementStreak() {
    const currentStreak = parseInt(streakCountElement.textContent, 10);
    if (currentStreak > 0) {
        streakCountElement.textContent = currentStreak - 1;
    }
}

function setStreak(val) {
    streakCountElement.textContent = val;
}


function setProgressBarValue(value) {
    slider.value = value;
    updateSliderGradient(); // Update the gradient background
}

const searchInput = document.getElementById("search-input");
const searchList = document.getElementById("search-list");


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


const correctThing = document.getElementById("correct");

function guessIndex(index){
    if (songIndex == index){
        incrementStreak();
        resetForNext();
        correctThing.innerText = "";
    }else{
        correctThing.innerText = "Wrong! it was: " + songs[songIndex][1];
        setStreak(0);
        reset();
    }
}


// Function to filter and display items based on user input
function displayItems() {
    const inputValue = searchInput.value.toLowerCase();
    searchList.innerHTML = "";

    const filteredItems = songs.filter(item => item[1].toLowerCase().includes(inputValue));

    for(var i = 0; i < Math.min(3, filteredItems.length); i ++){
        const item = filteredItems[i];

        const listItem = document.createElement("div");
        listItem.classList.add("search-list-item");
        listItem.textContent = item[1];

        listItem.addEventListener("click", () => {
            searchInput.value = "";
            searchList.style.display = "none";
            guessIndex(item[3]);
        });

        searchList.appendChild(listItem);
    }

    if (filteredItems.length === 0) {
        searchList.style.display = "none";
    } else {
        searchList.style.display = "block";
    }
}

hideItems()
function hideItems(){
    searchInput.value = "";
    setTimeout(hideItems2, 100);
}

function hideItems2(){
    searchList.style.display = "none";
}

// Add an input event listener to the search input field
searchInput.addEventListener("input", displayItems);
searchInput.addEventListener("focusin", displayItems);
searchInput.addEventListener("focusout", hideItems);