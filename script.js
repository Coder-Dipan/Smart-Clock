//Time Page Logic

const citySelect = document.getElementById("citySelect");

const digitalTime = document.getElementById("time");
const dateText = document.getElementById("date");

const hourHand = document.querySelector(".hour");
const minuteHand = document.querySelector(".minute");
const secondHand = document.querySelector(".second");

// Update Digital + Analog Clock
function updateClock(data){

    const hours = data.hour;
    const minutes = data.minute;
    const seconds = data.seconds;

    // Digital Clock

    digitalTime.textContent =
        `${String(hours).padStart(2,"0")}:` +
        `${String(minutes).padStart(2,"0")}:` +
        `${String(seconds).padStart(2,"0")}`;

    const months = [
        "January","February","March","April",
        "May","June","July","August",
        "September","October","November","December"
        ];

    const monthName = months[data.month - 1];

    // Date
    dateText.textContent =
        `${data.dayOfWeek}, ${data.day} ${monthName} ${data.year}`;

    // Analog Clock
    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;

    hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
}


// Fetch time from API
let currentZone = citySelect.value;
let currentDate;

async function fetchTime() {

    try {

        const response = await fetch(
            `https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(currentZone)}`
        );

        const data = await response.json();

        
        currentDate = new Date(
        data.year,
        data.month - 1,
        data.day,
        data.hour,
        data.minute,
        data.seconds
        );

        updateClock(data);

    } catch(error) {

        console.error("API Error:", error);

    }

}

setInterval(() => {

    if(!currentDate) return;

    currentDate.setSeconds(
        currentDate.getSeconds() + 1
    );

    const data = {
        hour: currentDate.getHours(),
        minute: currentDate.getMinutes(),
        seconds: currentDate.getSeconds(),
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        dayOfWeek: currentDate.toLocaleDateString(
            "en-US",
            { weekday: "long" }
        )
    };

    updateClock(data);

},1000);

citySelect.addEventListener("change", async () => {

    currentZone = citySelect.value;

    await fetchTime();

});

// Theme Button
const themeBtn = document.querySelector(".theme-btn");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){
    document.body.classList.add("light-theme");
    themeBtn.textContent = "Dark Mode";
}else{
    themeBtn.textContent = "Light Mode";
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    if(document.body.classList.contains("light-theme")){

        themeBtn.textContent = "Dark Mode";

        localStorage.setItem("theme","light");

    }else{

        themeBtn.textContent = "Light Mode";

        localStorage.setItem("theme","dark");
    }

});

// Initial load after page fully loads
window.addEventListener("load", () => {
    fetchTime();
});


//Alarm Page Logic
let alarmTime = null;

const alarmInput = document.getElementById("alarmTime");

const alarmStatus = document.getElementById("alarmStatus");

document.getElementById("setAlarmBtn").addEventListener("click", () => {

    alarmTime = alarmInput.value;

    alarmStatus.textContent = `Alarm Set For ${alarmTime}`;
});

setInterval(() => {

    if(!alarmTime) return;

    const now = new Date();

    const currentTime =
        String(now.getHours()).padStart(2,"0")+ ":" + String(now.getMinutes()).padStart(2,"0");

    if(currentTime === alarmTime){

        alert("⏰ Alarm Ringing!");

        alarmTime = null;
    }

},1000);

//Stop-Alarm Button
document.getElementById("stopAlarmBtn")
.addEventListener("click", () => {

    alarmTime = null;

    alarmInput.value = "";

    alarmStatus.textContent = "Alarm Off";

});


//Stop Watch Page Logic
let stopwatchInterval;

let seconds = 0;

const display = document.getElementById("stopwatchDisplay");

function updateStopwatch(){

    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    display.textContent =
        `${String(hrs).padStart(2,"0")}:` +
        `${String(mins).padStart(2,"0")}:` +
        `${String(secs).padStart(2,"0")}`;
}

//Start button function
document.getElementById("startBtn").addEventListener("click", () => {

    clearInterval(stopwatchInterval);

    stopwatchInterval =
    setInterval(() => {

        seconds++;

        updateStopwatch();

    },1000);

});

//Stop Button function
document.getElementById("stopBtn").addEventListener("click", () => {

    clearInterval(stopwatchInterval);

});

//reset button function
document.getElementById("resetBtn").addEventListener("click", () => {

    clearInterval(stopwatchInterval);

    seconds = 0;

    updateStopwatch();

});

const timePage = document.getElementById("timePage");
const alarmPage = document.getElementById("alarmPage");
const stopwatchPage = document.getElementById("stopwatchPage");

//Top Menu Bar 
const buttons = document.querySelectorAll(".top-menu button");

function setActive(btn){

    buttons.forEach(button =>
        button.classList.remove("active")
    );

    btn.classList.add("active");
}

//Time Page Option
timeBtn.addEventListener("click", () => {

    setActive(timeBtn);

    timePage.style.display = "block";
    alarmPage.style.display = "none";
    stopwatchPage.style.display = "none";
});

//Alarm Page Option
alarmBtn.addEventListener("click", () => {

    setActive(alarmBtn);

    timePage.style.display = "none";
    alarmPage.style.display = "block";
    stopwatchPage.style.display = "none";
});


//Stop Watch Page Option
stopwatchBtn.addEventListener("click", () => {

    setActive(stopwatchBtn);

    timePage.style.display = "none";
    alarmPage.style.display = "none";
    stopwatchPage.style.display = "block";
});


//Settings Features
const settingsIcon = document.querySelector(".settings");
const modal = document.getElementById("settingsModal");
const closeBtn = document.getElementById("closeSettings");

settingsIcon.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

//Show/Hide Analog clock
document.getElementById("showAnalog")
.addEventListener("change", function(){

    document.querySelector(".clock").style.display =
        this.checked ? "block" : "none";

});

//Show/Hide Digital Clock
document.getElementById("showDigital")
.addEventListener("change", function(){

    document.querySelector(".digital").style.display =
        this.checked ? "block" : "none";

});
