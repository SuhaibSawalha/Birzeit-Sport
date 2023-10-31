function Nav() {
  const nav = document.querySelector("nav");
  const after = document.querySelector(".after");
  if (window.scrollY > 10) {
    nav.style.backgroundColor = "green";
    after.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  } else {
    nav.style.background = "none";
    after.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  }
}
if (window.innerWidth > 767.5) {
  window.addEventListener("scroll", Nav);
  window.addEventListener("load", Nav);
}

function displayFood(id) {
  const ul = document.getElementById(id);
  const i =
    ul.previousElementSibling.firstElementChild.firstElementChild
      .nextElementSibling;
  if (ul.classList.toggle("open-food")) {
    ul.style.marginBottom = "20px";
    i.classList.remove("bi-arrow-down-short");
    i.classList.add("bi-arrow-up-short");
  } else {
    ul.style.marginBottom = "0";
    i.classList.remove("bi-arrow-up-short");
    i.classList.add("bi-arrow-down-short");
  }
}

let displayed = -1;
function displaySport(id) {
  if (displayed != -1) {
    return;
  }
  displayed = id;
  const sport = document.getElementById(id);
  const div = sport.previousElementSibling.children[0];
  div.style.width = `${sport.getBoundingClientRect().width}px`;
  const rect = div.getBoundingClientRect();
  const x = rect.left + sport.getBoundingClientRect().width / 2;
  const y = rect.top + rect.height / 2;
  div.style.transform = `translate(${window.innerWidth / 2 - x}px, ${
    window.innerHeight / 2 - y
  }px) rotate3d(0, 1, 1, 180deg)`;
  setTimeout(() => {
    sport.style.maxWidth = "100% !important";
    sport.style.maxHeight = "10000px";
    sport.style.padding = "30px";
    sport.style.overflow = "auto";
    document.querySelector(".empty").style.display = "block";
    document.querySelector("body").style.overflow = "hidden";
  }, 1000);
}

function undisplaySport() {
  const sport = document.getElementById(displayed);
  displayed = -1;
  const div = sport.previousElementSibling.children[0];
  sport.style.maxWidth = "0 !important";
  sport.style.maxHeight = "0";
  setTimeout(() => {
    sport.style.overflow = "hidden";
    sport.style.padding = "0";
    if (div.parentElement.previousElementSibling) {
      div.style.width = `${
        div.parentElement.previousElementSibling.previousElementSibling.children[0].getBoundingClientRect()
          .width
      }px`;
    } else {
      div.style.width = `${
        div.parentElement.nextElementSibling.nextElementSibling.children[0].getBoundingClientRect()
          .width
      }px`;
    }
    div.style.transform = `rotate3d(0, 0, 0, 180deg)`;
    document.querySelector(".empty").style.display = "none";
    document.querySelector("body").style.overflow = "auto";
  }, 990);
}

document.querySelector(".empty").onclick = undisplaySport;
document.querySelectorAll(".sport-sport i").forEach((i) => {
  i.onclick = undisplaySport;
});

function displayPlan(id) {
  const div = document.getElementById(id);
  const i = div.previousElementSibling.firstElementChild;
  if (div.classList.toggle("open-plan")) {
    i.classList.remove("bi-arrow-down-short");
    i.classList.add("bi-arrow-up-short");
  } else {
    i.classList.remove("bi-arrow-up-short");
    i.classList.add("bi-arrow-down-short");
  }
}

const date = new Date();
let month = date.getMonth() + 1;
let year = date.getFullYear();

const format = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
if (localStorage.getItem("lastRegister") != format) {
  for (let i = 0; i < 4; ++i) {
    localStorage.setItem(`progress-${i + 1}`, JSON.stringify([]));
    removeProgress(i);
  }
  localStorage.setItem("lastRegister", format);
}

for (let i = 1; i <= 4; ++i) {
  if (!localStorage.getItem(`progress-${i}`)) {
    localStorage.setItem(`progress-${i}`, JSON.stringify([]));
  }
  const ticked = JSON.parse(localStorage.getItem(`progress-${i}`));
  for (let j = 0; j < ticked.length; ++j) {
    document.getElementById(`checkbox-${i}-${ticked[j]}`).checked = true;
  }
  changeProgress(i);
}
function removeProgress(id) {
  for (let i = 1; ; ++i) {
    const checkbox = document.getElementById(`checkbox-${id}-${i}`);
    if (checkbox) {
      checkbox.checked = 0;
    } else {
      break;
    }
  }
}

function idToColor(id) {
  return id == 1
    ? "black"
    : id == 2
    ? "green"
    : id == 3
    ? "rgb(182, 182, 6)"
    : "#dc3545";
}

function changeProgress(id) {
  let count = 0,
    ticked = [];
  for (let i = 1; ; ++i) {
    const checkbox = document.getElementById(`checkbox-${id}-${i}`);
    if (checkbox) {
      ++count;
      if (checkbox.checked) {
        ticked.push(i);
      }
    } else {
      break;
    }
  }
  document.getElementById(`progress-${id}`).style.width = `${
    (ticked.length * 100) / count
  }%`;
  document.querySelector(`#plan-plan-${id} h3`).innerHTML = `${
    ticked.length == count ? "أحسنت!" : ""
  }`;
  const date = new Date();
  const thisDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  if (ticked.length == count) {
    if (!localStorage.getItem(thisDate)) {
      localStorage.setItem(thisDate, JSON.stringify([]));
    }
    const arr = JSON.parse(localStorage.getItem(thisDate));
    arr.push(id);
    arr.sort();
    localStorage.setItem(thisDate, JSON.stringify(arr));
  } else {
    if (localStorage.getItem(thisDate)) {
      const arr = JSON.parse(localStorage.getItem(thisDate));
      if (arr.indexOf(id) != -1) {
        arr.splice(arr.indexOf(id), 1);
        if (arr.length == 0) {
          localStorage.removeItem(thisDate);
        } else {
          localStorage.setItem(thisDate, JSON.stringify(arr));
        }
      }
    }
  }
  localStorage.setItem(`progress-${id}`, JSON.stringify(ticked));
  displayMonths(0);
}

function displayMonths(offset) {
  document.querySelector("#calendar>div:nth-child(3)").innerHTML = ``;
  month += offset;
  if (month == 13) {
    month = 1;
    ++year;
  }
  if (month == 0) {
    month = 12;
    --year;
  }
  document.getElementById("date").innerHTML = `${month}/${year}`;
  function daysOfMonth(month, leap) {
    switch (month) {
      case 1:
        return 31;
      case 2:
        return leap ? 29 : 28;
      case 3:
        return 31;
      case 4:
        return 30;
      case 5:
        return 31;
      case 6:
        return 30;
      case 7:
        return 31;
      case 8:
        return 31;
      case 9:
        return 30;
      case 10:
        return 31;
      case 11:
        return 30;
      case 12:
        return 31;
    }
  }
  function getFirstDay(month, year) {
    let sum = 0;
    for (let i = 1600; i < year; ++i) {
      sum += isLeapYear(i) ? 366 : 365;
    }
    for (let i = 1; i < month; ++i) {
      sum += daysOfMonth(i, isLeapYear(year));
    }
    return sum % 7;
  }
  function isLeapYear(year) {
    return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
  }
  const days = daysOfMonth(month, year);
  let currentDay = getFirstDay(month, year);
  let div;
  let rows = 0;
  for (let i = 1; i <= days; ++i) {
    if (i == 1 || currentDay == 0) {
      div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "center";
      ++rows;
      for (let j = 0; j < 12; ++j) {
        const col = document.createElement("div");
        col.style.textAlign = "center";
        col.classList.add("col");
        col.classList.add("col-1");
        col.id = `calCol-${rows}-${j}`;
        col.style.padding = "5px";
        div.appendChild(col);
        if (j < 3 || j >= 10) {
          col.classList.add("notImportantForMedia");
        } else {
          col.classList.add("importantForMedia");
        }
      }
      document.querySelector("#calendar>div:nth-child(3)").appendChild(div);
    }
    const col = document.getElementById(
      `calCol-${rows}-${12 - currentDay - 3}`
    );
    col.innerHTML = `${i}`;
    col.style.border = "1px solid black";
    if (localStorage.getItem(`${i}/${month}/${year}`)) {
      col.style.color = "white";
      const arr = JSON.parse(localStorage.getItem(`${i}/${month}/${year}`));
      col.style.backgroundColor = idToColor(arr[arr.length - 1]);
    }
    currentDay = (currentDay + 1) % 7;
  }
}
displayMonths(0);

if (window.innerWidth > 767.5) {
  const hrefs = ["#", "#food", "#sport", "#gyms", "#contact"];
  for (let i = 0; i < hrefs.length; ++i) {
    const a = document.querySelector(`.nav-item a[href="${hrefs[i]}"]`);
    a.addEventListener("mouseover", () => {
      if (window.scrollY <= 10) {
        a.style.textDecoration = "underline";
        a.style.opacity = "0.5";
        return;
      }
      const back = document.getElementById("back");
      back.style.display = "block";
      const rect = a.getBoundingClientRect();
      back.style.left = `${rect.left - 10}px`;
      back.style.width = `${rect.width + 20}px`;
      back.style.height = `${rect.height + 10}px`;
      back.style.top = `${rect.top - 5}px`;
    });
    a.addEventListener("mouseleave", () => {
      if (window.scrollY <= 10) {
        a.style.textDecoration = "none";
        a.style.opacity = "1";
        return;
      }
      hoverOnNavbar();
    });
  }

  function hoverOnNavbar() {
    const back = document.getElementById("back");
    if (window.scrollY <= 10) {
      back.style.display = "none";
      return;
    }
    back.style.display = "block";
    let index = 0;
    for (let i = hrefs.length - 1; i > 0; --i) {
      if (window.scrollY >= document.querySelector(hrefs[i]).offsetTop - 300) {
        index = i;
        break;
      }
    }
    const a = document.querySelector(`.nav-item a[href="${hrefs[index]}"]`);
    a.style.textDecoration = "none";
    a.style.opacity = "1";
    const rect = a.getBoundingClientRect();
    back.style.left = `${rect.left - 10}px`;
    back.style.width = `${rect.width + 20}px`;
    back.style.height = `${rect.height + 10}px`;
    back.style.top = `${rect.top - 5}px`;
  }

  window.addEventListener("scroll", hoverOnNavbar);
}

function justDigits(inp) {
  let v = "";
  for (let i = 0; i < inp.value.length; ++i) {
    if (/^\d$/.test(inp.value[i])) {
      v += inp.value[i];
    }
  }
  inp.value = v;
}

function startChallenge() {
  const name = document.getElementById("exerciseName");
  const min = document.getElementById("minutes");
  const sec = document.getElementById("seconds");
  let ok = 1;
  name.style.border = "";
  min.style.border = "";
  sec.style.border = "";
  if (name.value == "") {
    name.style.border = "1px solid red";
    ok = 0;
  }
  if (min.value == "" && sec.value == "") {
    min.style.border = "1px solid red";
    sec.style.border = "1px solid red";
    ok = 0;
  }
  if (!ok) {
    return;
  }
  if (min.value == "") {
    min.value = "0";
  }
  if (sec.value == "") {
    sec.value = "0";
  }
  document.body.style.overflow = "hidden";
  let minute = min.value,
    second = sec.value;
  const black = document.createElement("div");
  black.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 99999999;
        background-color: rgba(0, 0, 0, 0.8);
    `;
  const messages = [
    "هيا, يمكنك فعلها",
    "تقدم",
    "استمر",
    "أنت لها",
    "تستطيع فعلها",
    "لا شيء صعب عليك",
    "لقد اقتربت!",
    "هيا استمر",
    "تستطيع تحقيق ذلك",
    "لا تنظر خلفك",
  ];
  function startTimer() {
    const div = document.createElement("div");
    div.style.cssText = `
          position: fixed;
          width: min(500px, 100%);
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 999999999;
          background-color: white;
          border-radius: 10px;
          text-align: center;
          padding: 20px;
          border: 5px solid green;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
      `;
    div.innerHTML = `
        <div style="height: 50px; overflow: hidden; text-align: center;">
          <h1 style="font-size: 30px">${name.value}</h1>
        </div>
        <h1 style="color: green; font-size: 50px" id="message"></h1>
        <div>
        <h1 id="timer" style="font-size: 60px"></h1>
        </div>
      `;
    black.appendChild(div);
    document.getElementById("challenge").appendChild(black);
    changeTimer();
  }
  startTimer();
  function changeTimer() {
    document.getElementById("timer").innerHTML = `${minute}:${second}`;
    document.getElementById("message").innerHTML = `${
      messages[Math.floor(((minute * 60 + second) % 20) / 2)]
    }`;
    setTimeout(() => {
      if (second != 0) {
        --second;
      } else if (minute != 0) {
        --minute;
        second = 59;
      } else {
        finishTimer();
        return;
      }
      changeTimer();
    }, 1000);
  }
  function finishTimer() {
    document.getElementById("timer").innerHTML = ``;
    document.getElementById(
      "message"
    ).innerHTML = `أنا متيقن أنك قد استطعت فعل ذلك!`;
    setTimeout(() => {
      document.getElementById("challenge").removeChild(black);
      document.body.style.overflow = "auto";
    }, 3000);
  }
}
