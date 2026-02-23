// ===============================
// GLOBAL VARIABLES
// ===============================
let totalCount = 0;
let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;

const goal = 50;
let attendees = [];

// ===============================
// DOM ELEMENTS
// ===============================
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");

const waterDisplay = document.getElementById("waterCount");
const zeroDisplay = document.getElementById("zeroCount");
const powerDisplay = document.getElementById("powerCount");

// ===============================
// CREATE ATTENDEE LIST SECTION
// (Since it wasn't in your HTML)
// ===============================
const teamStats = document.querySelector(".team-stats");

const attendeeListTitle = document.createElement("h3");
attendeeListTitle.textContent = "Attendee List";

const attendeeList = document.createElement("ul");
attendeeList.style.marginTop = "10px";

teamStats.appendChild(attendeeListTitle);
teamStats.appendChild(attendeeList);

// ===============================
// LOAD FROM LOCAL STORAGE
// ===============================
function loadData() {
  const saved = JSON.parse(localStorage.getItem("intelSummitData"));

  if (saved) {
    totalCount = saved.totalCount;
    waterCount = saved.waterCount;
    zeroCount = saved.zeroCount;
    powerCount = saved.powerCount;
    attendees = saved.attendees || [];

    updateUI();

    attendees.forEach(person => {
      addToList(person.name, person.teamLabel);
    });
  }
}

// ===============================
// SAVE TO LOCAL STORAGE
// ===============================
function saveData() {
  const data = {
    totalCount,
    waterCount,
    zeroCount,
    powerCount,
    attendees
  };

  localStorage.setItem("intelSummitData", JSON.stringify(data));
}

// ===============================
// UPDATE UI
// ===============================
function updateUI() {
  attendeeCountDisplay.textContent = totalCount;

  waterDisplay.textContent = waterCount;
  zeroDisplay.textContent = zeroCount;
  powerDisplay.textContent = powerCount;

  const percent = (totalCount / goal) * 100;
  progressBar.style.width = percent + "%";

  if (totalCount >= goal) {
    showCelebration();
  }
}

// ===============================
// ADD ATTENDEE TO LIST
// ===============================
function addToList(name, teamLabel) {
  const li = document.createElement("li");
  li.textContent = `${name} - ${teamLabel}`;
  attendeeList.appendChild(li);
}

// ===============================
// CELEBRATION FEATURE
// ===============================
function showCelebration() {
  let winner = "";

  if (waterCount > zeroCount && waterCount > powerCount) {
    winner = "🌊 Team Water Wise";
  } else if (zeroCount > waterCount && zeroCount > powerCount) {
    winner = "🌿 Team Net Zero";
  } else if (powerCount > waterCount && powerCount > zeroCount) {
    winner = "⚡ Team Renewables";
  } else {
    winner = "It's a tie!";
  }

  greeting.textContent = `🎉 Attendance goal reached! Winning Team: ${winner}`;
}

// ===============================
// CHECK-IN LOGIC
// ===============================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return;

  totalCount++;

  let teamLabel = "";

  if (team === "water") {
    waterCount++;
    teamLabel = "Team Water Wise";
  } else if (team === "zero") {
    zeroCount++;
    teamLabel = "Team Net Zero";
  } else if (team === "power") {
    powerCount++;
    teamLabel = "Team Renewables";
  }

  greeting.textContent = `Welcome to the Summit, ${name}!`;

  attendees.push({ name, teamLabel });

  addToList(name, teamLabel);

  updateUI();
  saveData();

  form.reset();
});

// ===============================
// INITIAL LOAD
// ===============================
loadData();