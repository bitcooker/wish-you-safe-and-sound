//Toggle Theme

const toggleTheme = document.querySelector(".dark-light-mode");
const modetoggle = document.querySelector(".mode-toggle");

toggleTheme.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

modetoggle.addEventListener("click", () => {
    if (localStorage.getItem("theme") === "light") {
        modetoggle.src = "./assets/images/animation-image/clear-day.svg";
    } else {
        modetoggle.src = "./assets/images/animation-image/moon-first-quarter.svg";
    }
});

//check for user localstorage for prefered theme or city on page Load

const localDeviceTheme = localStorage.getItem("theme");
if (localDeviceTheme) {
    document.documentElement.classList.toggle(localDeviceTheme);
}

if (localDeviceTheme === "light") {
    modetoggle.src = "./assets/images/animation-image/moon-first-quarter.svg";
} else {
    modetoggle.src = "./assets/images/animation-image/clear-day.svg";
}

//Jokes loop through every 7 seconds

const jokesQuestion = document.querySelector(".joke-question");
const jokesanswer = document.querySelector(".joke-answer");

setInterval(async () => {
    await fetch("constants/weather-jokes.json")
        .then((response) => response.json())
        .then((data) => {
            let RandomNumber = Math.floor(Math.random() * data.length);
            jokesQuestion.innerText = data[RandomNumber]["question"];
            jokesanswer.innerText = data[RandomNumber]["answer"];
        })
        .catch((error) => console.error(error));
}, 7000);


