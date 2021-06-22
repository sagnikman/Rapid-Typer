const RANDOM_WORD_API_URL =
  "https://random-word-api.herokuapp.com/word?number=7"

const randomText = document.getElementById("randomText")
const inputText = document.getElementById("inputText")
const timer = document.getElementById("timer")
const bestTime = document.getElementById("bestTime")

const chk = document.getElementById('chk');

chk.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  
});

let currentTimeScore,
  BestTimeScore = 100000000
let timerLog = 0,
  intervalValue
let averageGameTime=0,currentTimeScoreSum=0,GameNumber=0,WPM=0,numberOfCharacters=0,CPM=0;
 
  
//Disabling Text Selection
randomText.unselectable = "on"

inputText.addEventListener("input", () => {
  if (timerLog === 0) startTimer()
  timerLog++
  const arrayWords = randomText.querySelectorAll("span")
  const arrayValue = inputText.value.split("")

  let correct = true
  arrayWords.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove("correct")
      characterSpan.classList.remove("incorrect")
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct")
      characterSpan.classList.remove("incorrect")
    } else {
      characterSpan.classList.remove("correct")
      characterSpan.classList.add("incorrect")
      correct = false
    }
  })

  if (correct) {
    if(currentTimeScore===0) currentTimeScore=0.5;
    CPM=parseFloat(numberOfCharacters/parseFloat(currentTimeScore/60));
    renderNewWords()
    timerLog = 0
    clearInterval(intervalValue)
    timer.innerText = 0
    GameNumber++;
    
    currentTimeScoreSum+=currentTimeScore;
    averageGameTime= parseFloat(currentTimeScoreSum/GameNumber);
    if(averageGameTime===NaN) averageGameTime=0.5;
    
    if (currentTimeScore < BestTimeScore) {
      BestTimeScore = currentTimeScore
    }
    WPM=parseFloat(CPM/5);
    bestTime.innerHTML = `Best Time: <strong>${BestTimeScore}</strong><br>
    Previous Time: <strong>${currentTimeScore}</strong><br>
    Average Time: <strong>${averageGameTime.toFixed(2)}</strong><br>
    WPM: <strong>${WPM.toFixed(2)}</strong><br>`;
  }
})

function getRandomWords() {
  return fetch(RANDOM_WORD_API_URL)
    .then((res) => res.json())
    .then((data) => data)
}

async function renderNewWords() {
  
  numberOfCharacters=0;
  const words = await getRandomWords()
  randomText.innerHTML = ""
  for (const key in words) {
    if (Object.hasOwnProperty.call(words, key)) {
      const element = words[key] + " "
      element.split("").forEach((character) => {
        const characterSpan = document.createElement("span")
        characterSpan.innerText = character
        randomText.appendChild(characterSpan)
        numberOfCharacters++;
      })
    }
  }
  randomText.removeChild(randomText.lastChild)
  inputText.value = null
}

let startTime
function startTimer() {
  timer.innerText = 0
  startTime = new Date()
  intervalValue = setInterval(() => {
    currentTimeScore = timer.innerText = getTimerTime()
  }, 1000)
}
function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}
renderNewWords()
