const RANDOM_WORD_API_URL = "https://random-word-api.herokuapp.com/word?number=2";

const randomText = document.getElementById("randomText");
const inputText = document.getElementById("inputText");
const timer = document.getElementById("timer");

inputText.addEventListener("input", ()=> {
    const arrayWords = randomText.querySelectorAll('span')
    const arrayValue = inputText.value.split('')
  
    let correct = true
    arrayWords.forEach((characterSpan, index) => {
      const character = arrayValue[index]
      if (character == null) {
        characterSpan.classList.remove('correct')
        characterSpan.classList.remove('incorrect')
        correct = false
      } else if (character === characterSpan.innerText) {
        characterSpan.classList.add('correct')
        characterSpan.classList.remove('incorrect')
      } else {
        characterSpan.classList.remove('correct')
        characterSpan.classList.add('incorrect')
        correct = false
      }
    })
  
    if (correct) renderNewWords();
})

function getRandomWords() {
return fetch(RANDOM_WORD_API_URL)
.then(res=>res.json())
.then(data=>(data));
}

async function renderNewWords() {
    console.log("Rendering New Set of Words");
    const words = await getRandomWords();
    randomText.innerHTML = "";
    for (const key in words) {
        
        if (Object.hasOwnProperty.call(words, key)) {
            const element = words[key]+" ";
            element.split('').forEach(character => {
                const characterSpan = document.createElement('span');
                characterSpan.innerText = character;
                randomText.appendChild(characterSpan);
            })
        }
    }
    randomText.removeChild(randomText.lastChild);
    inputText.value = null;
    startTimer();
}
let startTime;
function startTimer() {
    timer.innerText=0;
    startTime = new Date();
    setInterval(()=>{
        timer.innerText = getTimerTime()
    } ,1000);
}
function getTimerTime() {
    return Math.floor((new Date() - startTime) /1000 );
}
renderNewWords();

