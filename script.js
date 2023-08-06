const prizes = [
  {
    text: "Скидка на заказ 10%",
    color: "#E9E9E9",
    id: 0,
    rotation: 1800,
    chance: 50,
  },
  {
    text: "Бесплатная доставка",
    color: "#FFE15F",
    id: 1,
    rotation: 1860,
    chance: 5,
  },
  {
    text: "Бесплатный браслет",
    color: "#E9E9E9",
    id: 2,
    rotation: 1920,
    chance: 10,
  },
  {
    text: "Ваучер на 1,000₽ на заказ",
    color: "#FFE15F",
    id: 3,
    rotation: 1980,
    chance: 15,
  },
  {
    text: "Скидка на заказ 25%",
    color: "#E9E9E9",
    id: 4,
    rotation: 2040,
    chance: 20,
  },
  {
    text: "Серьги и кулон в подарок",
    color: "#FFE15F",
    id: 5,
    rotation: 2100,
    chance: 25,
  },
];

const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = document.querySelector(".pushButton");
const ticker = wheel.querySelector(".ticker");
const prizeSlice = 360 / prizes.length;
const prizeOffset = Math.floor(180 / prizes.length);
const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);
const wheelDescription = document.querySelector(".wheelDescription");
const wheelWin = document.querySelector(".wheelWin");
const wheelWinText = document.querySelector(".wheelWinText");

let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let sum = 0;
let prizeNodes;

const createPrizeNodes = () => {
  prizes.forEach(({ text, color, reaction }, i) => {
    const rotation = prizeSlice * i * -1 - prizeOffset;
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
          <span class="text" style="transform: scaleX(-1)">${text}</span>
        </li>`
    );
  });
};

const createConicGradient = () => {
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
        from -90deg,
        ${prizes
          .map(
            ({ color }, i) =>
              `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`
          )
          .reverse()}
      );`
  );
};

const setupWheel = () => {
  createConicGradient();
  createPrizeNodes();
  prizeNodes = wheel.querySelectorAll(".prize");
};

const runTickerAnimation = () => {
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += 2 * Math.PI;

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => (ticker.style.animation = null), 10);
    currentSlice = slice;
  }
  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
  var selected = Math.floor(rotation / prizeSlice);
  wheelWinText.textContent = prizes[selected].text;
  prizeNodes[selected].classList.add(selectedClass);
  wheelDescription.classList.add("invisible");
  wheelWin.classList.add("flex");
};

const randomSector = () => {
  for (let i = 0; i < prizes.length; i++) {
    sum += prizes[i].chance;
  }
  let randNum = Math.floor(Math.random() * sum);
  let i = 0;
  for (let s = prizes[0].chance; s <= randNum; s += prizes[i].chance) {
    i++;
  }

  return prizes[i].rotation + Math.floor(Math.random() * 58 + 1);
};

trigger.addEventListener("click", () => {
  trigger.disabled = true;
  rotation = randomSector();
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation();
  trigger.classList.remove("pushButton");
  trigger.classList.add("pushButtonClicked");
});

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame(tickerAnim);
  rotation %= 360;
  selectPrize();
  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
});

setupWheel();
