const CORRECT_PASSCODE = "1015"; // Your anniversary date MM/DD -> MMDD
let spotifyVisited = false;
let currentPasscodeAttempt = "";

const songsData = [
    {
        title: "Something About You",
        artist: "Eyedress",
        quote: "She looks just like a dream. The prettiest girl I've ever seen",
        link: "https://open.spotify.com/track/6RiiSy9GzSwiyDEJDiMuKe?si=5530598a886e4c52",
        albumArt: "something-about-you.jpg" // <<<< UPDATED
    },
    {
        title: "Captivated",
        artist: "IV Of Spades", 
        quote: "Oh, my love. You don't have to listen to a word they say 'cause all that really matters is that I love you.",
        link: "https://open.spotify.com/track/39SQ0CjIineoa2mbiJpZdk?si=8294d7edf87d4930", // Note: This link is still for JVKE's version. You might want to find IV Of Spades' version link.
        albumArt: "captivated.jpg" // <<<< UPDATED
    },
    {
        title: "Like You Do",
        artist: "Joji",
        quote: "You're the one I can't lose, no one loves me like you do.",
        link: "https://open.spotify.com/track/4vgU9MGJwhgBEtlO8mMN49?si=b29ea7036c57486b",
        albumArt: "like-you-do.jpg" // <<<< UPDATED
    },
    {
        title: "Only You", 
        artist: "The Platters", 
        quote: "You're my dream come true, my one and only you.", 
        link: "https://open.spotify.com/track/5whvZmQ6Apf4TGpBeNcpBx?si=d8db1ac1f21b452c", 
        albumArt: "only-you.jpg" // <<<< UPDATED
    }
];

// Utility to show/hide screens
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'spotify-screen') {
        spotifyVisited = true; // Mark Spotify as visited
    }
}

// --- New Passcode Logic ---
const passcodeDisplayDots = document.querySelectorAll('#passcode-display-container .passcode-dot');
const numpadButtons = document.querySelectorAll('#numpad-container .numpad-button');
const passcodeError = document.getElementById('passcode-error');

function updatePasscodeDisplay() {
    passcodeDisplayDots.forEach((dot, index) => {
        if (index < currentPasscodeAttempt.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function handleNumpadInput(value) {
    passcodeError.style.display = 'none'; // Hide error on new input

    if (value === 'backspace') {
        if (currentPasscodeAttempt.length > 0) {
            currentPasscodeAttempt = currentPasscodeAttempt.slice(0, -1);
        }
    } else {
        if (currentPasscodeAttempt.length < 4) {
            currentPasscodeAttempt += value;
        }
    }
    updatePasscodeDisplay();

    if (currentPasscodeAttempt.length === 4) {
        checkPasscode();
    }
}

function checkPasscode() {
    if (currentPasscodeAttempt === CORRECT_PASSCODE) {
        passcodeError.style.display = 'none';
        setTimeout(() => {
            showScreen('main-menu-screen');
            currentPasscodeAttempt = ""; 
            updatePasscodeDisplay();
        }, 200);
    } else {
        passcodeError.style.display = 'block';
        const displayContainer = document.getElementById('passcode-display-container');
        if (displayContainer) { 
            displayContainer.classList.add('shake');
            setTimeout(() => {
                displayContainer.classList.remove('shake');
                currentPasscodeAttempt = "";
                updatePasscodeDisplay();
            }, 500); 
        } else { 
             currentPasscodeAttempt = "";
             updatePasscodeDisplay();
        }
    }
}

numpadButtons.forEach(button => {
    if (!button.classList.contains('numpad-empty')) { 
        button.addEventListener('click', () => {
            handleNumpadInput(button.dataset.value);
        });
    }
});
// --- End New Passcode Logic ---


// Populate Spotify Song List
function populateSongs() {
    const songListContainer = document.getElementById('song-list-container');
    songsData.forEach((song, index) => {
        const songCard = document.createElement('div');
        songCard.classList.add('song-card');
        songCard.onclick = () => showSongModal(index);

        const albumArtImg = document.createElement('img');
        albumArtImg.src = song.albumArt; // This will now use local paths
        albumArtImg.alt = song.title + " album art";

        const songInfoDiv = document.createElement('div');
        songInfoDiv.classList.add('song-info');
        
        const titleH3 = document.createElement('h3');
        titleH3.textContent = song.title;
        
        const artistP = document.createElement('p');
        artistP.textContent = song.artist;

        songInfoDiv.appendChild(titleH3);
        songInfoDiv.appendChild(artistP);
        songCard.appendChild(albumArtImg);
        songCard.appendChild(songInfoDiv);
        songListContainer.appendChild(songCard);
    });
}

// Song Modal Logic
const songModal = document.getElementById('song-modal');
function showSongModal(songIndex) {
    const song = songsData[songIndex];
    document.getElementById('modal-album-art').src = song.albumArt; // This will now use local paths
    document.getElementById('modal-song-title').textContent = song.title + " - " + song.artist;
    document.getElementById('modal-song-quote').textContent = `"${song.quote}"`;
    document.getElementById('modal-spotify-link').href = song.link;
    songModal.style.display = 'flex';
}

function closeSongModal() {
    songModal.style.display = 'none';
}

// Return from Spotify and trigger surprise
function returnFromSpotify() {
    showScreen('main-menu-screen');
    if (spotifyVisited) {
        triggerFinalSurprise();
        spotifyVisited = false; 
    }
}

// Final Surprise Logic
const finalSurpriseOverlay = document.getElementById('final-surprise-overlay');
const confettiCanvas = document.getElementById('confetti-canvas');
let myConfetti; 

function triggerFinalSurprise() {
    finalSurpriseOverlay.style.display = 'flex';
    if (myConfetti) { 
        myConfetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
        });
    }
}

function closeFinalSurprise() {
    finalSurpriseOverlay.style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (typeof confetti !== 'undefined' && confettiCanvas) { 
        myConfetti = confetti.create(confettiCanvas, {
            resize: true,
            useWorker: true
        });
    } else {
        if (typeof confetti === 'undefined') console.error("Confetti library is not loaded.");
        if (!confettiCanvas) console.error("Confetti canvas element not found.");
    }

    updatePasscodeDisplay(); 
    populateSongs();

    const catImg = document.getElementById('cat-image');
    if (catImg) {
        const currentSrc = catImg.getAttribute('src');
        if (currentSrc && currentSrc.includes('placeholder') && !currentSrc.includes('snowflake.png')) { 
            catImg.src = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajRkZzNlMmZxbTJxbzJrcnNsczZkMHQ1bnN0bzVncjEzb3B3aXJqYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ICOgUNjpvO0PC/giphy.gif';
            catImg.alt = 'Cute Cat (Fallback)';
            console.warn("Snowflake's image was a placeholder. Using a fallback GIF. Please ensure 'snowflake.png' is correctly referenced in the HTML.");
        }
    }
});