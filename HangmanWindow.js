'use strict'

// const words = [
//   "Haus", "Baum", "Auto", "Hund", "Katze", "Buch", "Tisch", "Stuhl", "Apfel", "Ball",
//   "Fisch", "Vogel", "Blume", "Sonne", "Mond", "Wasser", "Feuer", "Brot", "Milch", "Käse",
//   "Stift", "Papier", "Tür", "Fenster", "Straße", "Berg", "See", "Himmel", "Regen", "Wind",
//   "Hand", "Fuß", "Kopf", "Ohr", "Nase", "Auge", "Mund", "Herz", "Schule", "Lehrer",
//   "Kind", "Freund", "Spiel", "Tag", "Nacht", "Liebe", "Licht", "Tier", "Zug", "Boot"
// ];
const baseURL = "https://hangmanbackend-f2eqd3cvexbgbchg.polandcentral-01.azurewebsites.net"
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÜÖÄ"
const canvas = document.getElementById("hangman");
const ctx = canvas.getContext("2d");
let secredWord;
let level = "easy";
const secredWordH1 = document.getElementById("secretWord");
const scoreboard = document.getElementById("scoreboardH1");
canvas.width = 500;
canvas.height = 500;
var stage = 0;
let choseLevelButton;

function main(){
    createKeyboard();
    showLevelSelection();
    getSecretWord();
    loadFromStorage();
    scoreboard.textContent = "Fehler: " + (stage) + " / 6"
    drawHangman();
    createRestartButton()
    createChoseLevelButton();
}
async function getSecretWord(){
  secredWord = await fetch(`${baseURL}/${level}`).then(response => response.json());
  secredWordH1.textContent = secredWord.wort.split("").fill("_").join(" ");
}
function showLevelSelection(){
  const levelDiv = document.createElement("div");
  levelDiv.id = "levelSelectionDiv";
  levelDiv.style.display = "flex";
  levelDiv.style.flexDirection = "column";
  levelDiv.style.alignItems = "center";
  levelDiv.style.justifyContent = "center";
  levelDiv.style.position = "absolute";
  levelDiv.style.top = "50%";
  levelDiv.style.left = "50%";
  levelDiv.style.transform = "translate(-50%, -50%)";
  levelDiv.style.backgroundColor = "white";
  levelDiv.style.borderRadius = "20px";
  levelDiv.style.padding = "20px";
  levelDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  levelDiv.style.zIndex = "10";

  const title = document.createElement("h2");
  title.textContent = "Wähle die Schwierigkeit";
  levelDiv.appendChild(title);

  const levels = [
    { name: "easy", color: "lightgreen", label: "Leicht" },
    { name: "medium", color: "yellow", label: "Mittel" },
    { name: "hard", color: "lightcoral", label: "Schwer" }
  ];

  levels.forEach(lvl => {
    const button = document.createElement("button");
    button.textContent = lvl.label;
    button.style.backgroundColor = lvl.color;
    button.style.width = "150px";
    button.style.height = "50px";
    button.style.margin = "10px";
    button.style.borderRadius = "10px";
    button.style.border = "none";
    button.style.fontSize = "18px";
    button.style.cursor = "pointer";
    button.addEventListener("click", () => {
      const p = document.getElementById("pContent");
      console.log(lvl.name);
      p.innerHTML = lvl.name;
      level = lvl.name;
      document.body.removeChild(levelDiv);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    stage = 0;
    localStorage.setItem("savedKeys", "");
    createKeyboard();
    getSecretWord();
    drawHangman();
    scoreboard.textContent = "Fehler: " + (stage) + " / 6"
    try{
     choseLevelButton.disabled = false;
    }catch(ex){
      console.log("alles gut");
    }

    });
    levelDiv.appendChild(button);
  });

  document.body.appendChild(levelDiv);
}

function createRestartButton(){
  const button = document.createElement("button");
  button.textContent = "Restart Game";
  button.id = "restartButton";
  button.addEventListener("click", (event) =>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stage = 0;
    localStorage.setItem("savedKeys", "");
    createKeyboard();
    getSecretWord();
    drawHangman();
    scoreboard.textContent = "Fehler: " + (stage) + " / 6"


  })
  document.getElementById("buttonDiv").appendChild(button);
}
function createChoseLevelButton(){
  const button = document.createElement("button");
  button.textContent = "Choose Level";
  button.id = "restartButton";
  button.addEventListener("click", (event) =>{
        button.disabled = true;
        choseLevelButton = button;
        showLevelSelection(button);
  })
  document.getElementById("buttonDiv").appendChild(button);
}

function loadFromStorage(){
  try{
    var temp = localStorage.getItem("savedKeys").split("");
    temp.forEach((element) => {
      checkForLetterInSecretWord(element);
    });
  }catch(e){

  }
  if(stage == 6 || !secredWordH1.textContent.includes("_")){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stage = 0;
    localStorage.setItem("savedKeys", "");
    createKeyboard();
    secredWordH1.textContent = secretWord.wort.split("").fill("_").join(" ");
  } 
}

function createKeyboard(){
    //keyboard [line 1] [letter]
    const keyboard = [
        ["Q","W","E","R","T","Z","U","I","O","P","Ü"],
        ["A","S","D","F","G","H","J","K","L","Ö","Ä"],
        ["Y","X","C","V","B","N","M"]
    ]

    const mainDiv = document.getElementById("KeyboardDiv");
    mainDiv.innerHTML = "";
    mainDiv.style.display = "flex";
    keyboard.forEach(line => {
        const currentLine = document.createElement("div");

        currentLine.style.display = "flex";
        currentLine.style.flexDirection = "row";

        line.forEach(letter => {
            const letterButton = document.createElement("button");

            letterButton.textContent = letter;

            letterButton.id = letter;

            letterButton.style.backgroundColor = "lightblue";
            letterButton.style.width = "3vw";
            letterButton.style.height = "50px";
            letterButton.style.display = "flex";
            letterButton.style.justifyContent = "center";
            letterButton.style.alignItems = "center";
            letterButton.style.borderRadius = "15px";
            letterButton.style.margin = "0.3vw";
            

            letterButton.addEventListener('click', (event) => {
                checkForLetterInSecretWord(event.target.id);
            });
            currentLine.appendChild(letterButton);
        });
        mainDiv.appendChild(currentLine);
    });
}

function revealLetter(letter){
  var splitedWort = secredWord.wort.split("").forEach((element, index) => {
      if(element.toUpperCase().includes(letter.toUpperCase())){
        var temp = secredWordH1.textContent.split(" ");
        temp[index] = letter.toUpperCase();
        secredWordH1.textContent = temp.join(" ");
      }
  })
}

function checkForLetterInSecretWord(letter){
  if(stage < 6 && secredWordH1.textContent.includes("_")){  
    const button = document.getElementById(letter.toUpperCase());
    if(!button.disabled){

      var savedKeys = "";
      savedKeys = localStorage.getItem("savedKeys");
      if(savedKeys == null){
        savedKeys = "";
      }
      if(!savedKeys.includes(letter)){
        savedKeys += letter;
        localStorage.setItem("savedKeys", savedKeys);
      }
      

      if(secredWord.wort.toUpperCase().includes(letter.toUpperCase())){
        revealLetter(letter);
        button.style.backgroundColor = "lightgreen";
      }else{
        button.style.backgroundColor = "lightcoral";
        stage++;
        drawHangman();
        
        scoreboard.textContent = "Fehler: " + (stage) + " / 6"
        
      }
    }
    button.disabled = true;
  }
  if(stage == 6){
    scoreboard.textContent = "Fehler: " + (stage) + " / 6" + " Du hast verloren";
    secredWordH1.textContent = secretWord.wort;
  } else if(!secredWordH1.textContent.includes("_")){
    scoreboard.textContent = "Fehler: " + (stage) + " / 6" + " Du hast gewonnen"
    
  }
  
  
}

function drawHangman() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'black';

  // gallows
  ctx.beginPath();
  ctx.moveTo(40, 460);
  ctx.lineTo(440, 460); // base
  ctx.moveTo(140, 460);
  ctx.lineTo(140, 40); // pole
  ctx.lineTo(320, 40); // top
  ctx.moveTo(140, 120); // support
  ctx.lineTo(220, 40);
  ctx.moveTo(320, 40);
  ctx.lineTo(320, 100); // rope
  ctx.stroke();

  if (stage > 0) {
    // head
    ctx.beginPath();
    ctx.arc(320, 140, 40, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (stage > 1) {
    // body
    ctx.beginPath();
    ctx.moveTo(320, 180);
    ctx.lineTo(320, 300);
    ctx.stroke();
  }
  if (stage > 2) {
    // left arm
    ctx.beginPath();
    ctx.moveTo(320, 220);
    ctx.lineTo(260, 260);
    ctx.stroke();
  }
  if (stage > 3) {
    // right arm
    ctx.beginPath();
    ctx.moveTo(320, 220);
    ctx.lineTo(380, 260);
    ctx.stroke();
  }
  if (stage > 4) {
    // left leg
    ctx.beginPath();
    ctx.moveTo(320, 300);
    ctx.lineTo(280, 380);
    ctx.stroke();
  }
  if (stage > 5) {
    // right leg
    ctx.beginPath();
    ctx.moveTo(320, 300);
    ctx.lineTo(360, 380);
    ctx.stroke();
  }
}

main();

document.addEventListener("keydown", (event) => {
    if(alphabet.includes(event.key.toUpperCase())){
     checkForLetterInSecretWord(event.key)
    }
});