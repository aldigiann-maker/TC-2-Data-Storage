/* ==========================================
   PACKAGING SUPPLY HUB
   Main JavaScript
========================================== */


/* ==========================================
   GREETING & CLOCK
========================================== */

const currentTime = document.getElementById("currentTime");
const currentDate = document.getElementById("currentDate");
const greetingText = document.getElementById("greetingText");
const welcomeName = document.getElementById("welcomeName");
const changeNameBtn = document.getElementById("changeNameBtn");


function updateClock() {

    const now = new Date();

    const hours = now.getHours();

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    currentTime.textContent = time;
    currentDate.textContent = date;


    let greeting = "Good Night";

    if (hours >= 5 && hours < 12) {
        greeting = "Good Morning";
    } else if (hours >= 12 && hours < 17) {
        greeting = "Good Afternoon";
    } else if (hours >= 17 && hours < 21) {
        greeting = "Good Evening";
    }

    greetingText.textContent = greeting;
}


updateClock();

setInterval(updateClock, 1000);


/* ==========================================
   CUSTOM NAME
========================================== */

let savedName = localStorage.getItem("userName");

function displayName() {

    if (savedName) {
        welcomeName.textContent = `Welcome, ${savedName}!`;
    } else {
        welcomeName.textContent = "Welcome!";
    }
}

displayName();


changeNameBtn.addEventListener("click", function () {

    const name = prompt(
        "What is your name?",
        savedName || ""
    );

    if (name === null) {
        return;
    }

    const cleanName = name.trim();

    if (cleanName === "") {
        localStorage.removeItem("userName");
        savedName = null;
    } else {
        savedName = cleanName;

        localStorage.setItem(
            "userName",
            cleanName
        );
    }

    displayName();
});


/* ==========================================
   FOCUS TIMER
========================================== */

const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimer");
const stopTimerBtn = document.getElementById("stopTimer");
const resetTimerBtn = document.getElementById("resetTimer");

const TIMER_DURATION = 25 * 60;

let timeRemaining = TIMER_DURATION;
let timerInterval = null;


function updateTimerDisplay() {

    const minutes = Math.floor(timeRemaining / 60);

    const seconds = timeRemaining % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function startTimer() {

    if (timerInterval !== null) {
        return;
    }

    if (timeRemaining <= 0) {
        return;
    }

    timerInterval = setInterval(function () {

        if (timeRemaining > 0) {

            timeRemaining--;

            updateTimerDisplay();

        } else {

            clearInterval(timerInterval);

            timerInterval = null;

            alert("Focus session complete! 🎉");
        }

    }, 1000);
}


function stopTimer() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);

        timerInterval = null;
    }
}


function resetTimer() {

    stopTimer();

    timeRemaining = TIMER_DURATION;

    updateTimerDisplay();
}


startTimerBtn.addEventListener(
    "click",
    startTimer
);

stopTimerBtn.addEventListener(
    "click",
    stopTimer
);

resetTimerBtn.addEventListener(
    "click",
    resetTimer
);


updateTimerDisplay();


/* ==========================================
   TODO LIST
========================================== */

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const sortTasksBtn = document.getElementById("sortTasksBtn");


let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];


function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


function renderTasks() {

    taskList.innerHTML = "";


    if (tasks.length === 0) {

        const emptyMessage = document.createElement("li");

        emptyMessage.textContent =
            "No tasks yet. Add your first task.";

        emptyMessage.style.color =
            "var(--muted)";

        emptyMessage.style.padding =
            "15px 0";

        taskList.appendChild(emptyMessage);

        return;
    }


    tasks.forEach(function (task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked =
            task.completed;


        checkbox.addEventListener(
            "change",
            function () {

                task.completed =
                    checkbox.checked;

                saveTasks();

                renderTasks();
            }
        );


        const span =
            document.createElement("span");

        span.textContent =
            task.text;


        const actions =
            document.createElement("div");

        actions.className =
            "task-actions";


        const editButton =
            document.createElement("button");

        editButton.textContent =
            "Edit";

        editButton.className =
            "edit-btn";


        editButton.addEventListener(
            "click",
            function () {

                const newText = prompt(
                    "Edit task:",
                    task.text
                );

                if (newText === null) {
                    return;
                }

                const cleanText =
                    newText.trim();

                if (cleanText === "") {
                    return;
                }

                const duplicate =
                    tasks.some(function (item) {

                        return (
                            item !== task &&
                            item.text.toLowerCase() ===
                            cleanText.toLowerCase()
                        );
                    });


                if (duplicate) {

                    alert(
                        "This task already exists."
                    );

                    return;
                }


                task.text = cleanText;

                saveTasks();

                renderTasks();
            }
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.className =
            "delete-btn";


        deleteButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Delete this task?"
                    );

                if (!confirmed) {
                    return;
                }

                tasks =
                    tasks.filter(function (item) {

                        return item !== task;

                    });

                saveTasks();

                renderTasks();
            }
        );


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(actions);


        taskList.appendChild(li);
    });
}


/* ==========================================
   ADD TASK
========================================== */

function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task.");

        return;
    }


    const duplicate =
        tasks.some(function (task) {

            return (
                task.text.toLowerCase() ===
                text.toLowerCase()
            );
        });


    if (duplicate) {

        alert(
            "This task already exists."
        );

        return;
    }


    tasks.push({

        text: text,

        completed: false

    });


    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}


addTaskBtn.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();
        }
    }
);


/* ==========================================
   SORT TASKS
========================================== */

sortTasksBtn.addEventListener(
    "click",
    function () {

        tasks.sort(function (a, b) {

            if (
                a.completed !==
                b.completed
            ) {

                return a.completed ? 1 : -1;
            }

            return a.text.localeCompare(
                b.text
            );
        });


        saveTasks();

        renderTasks();
    }
);


renderTasks();


/* ==========================================
   QUICK LINKS
========================================== */

const linkName =
    document.getElementById("linkName");

const linkUrl =
    document.getElementById("linkUrl");

const addLinkBtn =
    document.getElementById("addLinkBtn");

const linksContainer =
    document.getElementById("linksContainer");


let quickLinks = JSON.parse(
    localStorage.getItem("quickLinks")
) || [];


function saveLinks() {

    localStorage.setItem(
        "quickLinks",
        JSON.stringify(quickLinks)
    );
}


function renderLinks() {

    linksContainer.innerHTML = "";


    if (quickLinks.length === 0) {

        const message =
            document.createElement("p");

        message.textContent =
            "No quick links yet.";

        message.style.color =
            "var(--muted)";

        linksContainer.appendChild(
            message
        );

        return;
    }


    quickLinks.forEach(function (link, index) {

        const container =
            document.createElement("div");

        container.className =
            "quick-link";


        const anchor =
            document.createElement("a");

        anchor.href = link.url;

        anchor.target = "_blank";

        anchor.rel = "noopener noreferrer";

        anchor.textContent =
            link.name;


        const removeButton =
            document.createElement("button");

        removeButton.textContent =
            "×";

        removeButton.className =
            "remove-link";


        removeButton.addEventListener(
            "click",
            function () {

                quickLinks.splice(
                    index,
                    1
                );

                saveLinks();

                renderLinks();
            }
        );


        container.appendChild(anchor);

        container.appendChild(
            removeButton
        );


        linksContainer.appendChild(
            container
        );
    });
}


/* ==========================================
   ADD QUICK LINK
========================================== */

function addQuickLink() {

    const name =
        linkName.value.trim();

    let url =
        linkUrl.value.trim();


    if (name === "" || url === "") {

        alert(
            "Please enter link name and URL."
        );

        return;
    }


    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {

        url = "https://" + url;
    }


    const duplicate =
        quickLinks.some(function (link) {

            return (
                link.url.toLowerCase() ===
                url.toLowerCase()
            );
        });


    if (duplicate) {

        alert(
            "This link already exists."
        );

        return;
    }


    quickLinks.push({

        name: name,

        url: url

    });


    saveLinks();

    linkName.value = "";

    linkUrl.value = "";

    renderLinks();
}


addLinkBtn.addEventListener(
    "click",
    addQuickLink
);


linkUrl.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addQuickLink();
        }
    }
);


renderLinks();


/* ==========================================
   DARK / LIGHT MODE
========================================== */

const themeToggle =
    document.getElementById("themeToggle");


const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent =
        "☀️ Light Mode";
}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        if (isDark) {

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeToggle.textContent =
                "☀️ Light Mode";

        } else {

            localStorage.setItem(
                "theme",
                "light"
            );

            themeToggle.textContent =
                "🌙 Dark Mode";
        }
    }
);
