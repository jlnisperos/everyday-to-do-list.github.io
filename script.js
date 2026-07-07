/* SETTINGS */
const TIMER_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 45, 50, 55, 60];
const THEMES = [
    { name: "light", icon: "sun.png" },
    { name: "dark", icon: "moon.png" }
];
const BRIGHTNESS_OPTIONS = [50, 60, 70, 80, 90, 100];

let settings = {
    timerMinutes: 25,
    themeIndex: 0,
    brightnessIndex: 3
};

function loadSettings() {
    const saved = localStorage.getItem("todoSettings");
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
    }
    applySettings();
}

function saveSettings() {
    localStorage.setItem("todoSettings", JSON.stringify(settings));
    applySettings();
}

function applySettings() {
    const theme = THEMES[settings.themeIndex];
    document.body.classList.toggle("dark-theme", theme.name === "dark");

    const celestial = document.getElementById("celestialBody");
    if (celestial) {
        celestial.src = theme.name === "dark" ? "moon.png" : "sun.png";
    }

    const brightness = BRIGHTNESS_OPTIONS[settings.brightnessIndex] / 100;
    document.documentElement.style.setProperty("--brightness", brightness);

    if (typeof workTime !== "undefined") {
        workTime = settings.timerMinutes * 60;
        if (!isRunning) {
            timeLeft = workTime;
            updateDisplay();
        }
    }
}

function formatTimerDisplay(minutes) {
    return String(minutes).padStart(2, "0") + ":00";
}

function initSettingsPage() {
    const timerDisplay = document.getElementById("timerSettingDisplay");
    const themeDisplay = document.getElementById("themeSettingDisplay");
    const brightnessDisplay = document.getElementById("brightnessDisplay");

    if (!timerDisplay) return;

    function updateSettingsUI() {
        timerDisplay.textContent = formatTimerDisplay(settings.timerMinutes);
        themeDisplay.innerHTML =
            `<img src="${THEMES[settings.themeIndex].icon}" alt="" class="theme-stepper-icon">`;
        brightnessDisplay.textContent = BRIGHTNESS_OPTIONS[settings.brightnessIndex] + "%";
    }

    document.getElementById("timerDec").addEventListener("click", () => {
        const idx = TIMER_OPTIONS.indexOf(settings.timerMinutes);
        if (idx > 0) settings.timerMinutes = TIMER_OPTIONS[idx - 1];
        updateSettingsUI();
        saveSettings();
    });

    document.getElementById("timerInc").addEventListener("click", () => {
        const idx = TIMER_OPTIONS.indexOf(settings.timerMinutes);
        if (idx < TIMER_OPTIONS.length - 1) settings.timerMinutes = TIMER_OPTIONS[idx + 1];
        updateSettingsUI();
        saveSettings();
    });

    document.getElementById("themeDec").addEventListener("click", () => {
        settings.themeIndex = (settings.themeIndex - 1 + THEMES.length) % THEMES.length;
        updateSettingsUI();
        saveSettings();
    });

    document.getElementById("themeInc").addEventListener("click", () => {
        settings.themeIndex = (settings.themeIndex + 1) % THEMES.length;
        updateSettingsUI();
        saveSettings();
    });

    document.getElementById("brightnessDec").addEventListener("click", () => {
        if (settings.brightnessIndex > 0) settings.brightnessIndex--;
        updateSettingsUI();
        saveSettings();
    });

    document.getElementById("brightnessInc").addEventListener("click", () => {
        if (settings.brightnessIndex < BRIGHTNESS_OPTIONS.length - 1) settings.brightnessIndex++;
        updateSettingsUI();
        saveSettings();
    });

    updateSettingsUI();
}

/* LIST-N-TIMER */
let tasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");

function addTask() {
    const taskInput = document.getElementById("taskInput");
    if (!taskInput) return;

    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push(taskText);
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
    displayTasks();
    taskInput.value = "";
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    if (!taskList) return;

    taskList.innerHTML = "";
    for (let i = 0; i < tasks.length; i++) {
        taskList.innerHTML += `
            <li>
                ${tasks[i]}
                <button onclick="removeTask(${i})">Remove</button>
            </li>
        `;
    }
}

function removeTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
    displayTasks();
}

function initTaskList() {
    const addBtn = document.getElementById("addBtn");
    if (!addBtn) return;

    addBtn.addEventListener("click", addTask);

    const taskInput = document.getElementById("taskInput");
    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTask();
    });

    displayTasks();
}


let workTime = 25 * 60;
let timeLeft = workTime;
let timer;
let isRunning = false;

function updateDisplay() {
    const timerEl = document.getElementById("timer");
    if (!timerEl) return;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            alert("Pomodoro finished! Take a 5-minute break.");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = workTime;
    updateDisplay();
}

function initTimer() {
    if (!document.getElementById("timer")) return;
    updateDisplay();
}

loadSettings();
initSettingsPage();
initTaskList();
initTimer();