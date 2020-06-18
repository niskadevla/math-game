'use strict';

const Signs = ['+', '-'];
let firstNum = document.getElementById('firstNum');
let sign = document.getElementById('sign');
let secondNum = document.getElementById('secondNum');
let equal = document.getElementById('equal');
let btn = document.getElementById('btn');
let answers = document.getElementById('answers');
let selectRandom = document.getElementById('selectRandom');
let min = 0;
let max = 100;
let tasks = [];
let minMax = [min, max];


//Initial
showAnswers();
setRandom();
showTask();
// document.write(`<img src="${window.images.bad[0]}" alt="img"/>`)


function randomInteger(min, max) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}


function showTask() {
  let num1 = randomInteger(min, max);
  let num2 = randomInteger(min, max);
  let s = Signs[randomInteger(0, Signs.length - 1)];
  let n1 = num1;
  let n2 = num2;

  if(s == '-' && num1 < num2) {
    n1 = num2;
    n2 = num1;
  }

  firstNum.innerHTML = n1;
  secondNum.innerHTML = n2;
  sign.innerHTML = s;
  equal.value = '';
}


btn.onclick = checkAnswer;

function checkAnswer(e) {
  e.preventDefault();
  let eq = +equal.value;
  if(!eq) return;

  let isCorrect = calculate();
  let obj = {};
  checkLS();

  if(isCorrect) {
    obj.task = getTask();
    obj.isCorrect = isCorrect;

    alert('Well done!');
  } else {
    obj.task = getTask();
    obj.isCorrect = isCorrect;

    alert('Not correct');
  }

  obj.date = new Date();

  saveToLs(obj);
  showTask();
  showAnswers();
}


function calculate() {
  let num1 = +firstNum.innerHTML;
  let num2 = +secondNum.innerHTML;
  let eq = +equal.value;
  let res;

  switch (sign.innerHTML) {
    case '+': res = num1 + num2;
      break;
    case '-': res = num1 - num2;
      break;
  }

  if(res === eq) return true;
  return false;
}


function checkLS() {
  if(JSON.parse(localStorage.getItem('tasks'))) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  if(JSON.parse(localStorage.getItem('minMax'))) {
    minMax = JSON.parse(localStorage.getItem('minMax'));
  }
}


function saveToLs(obj) {
  tasks.push(obj);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


function getTask() {
  return `${firstNum.innerHTML} ${sign.innerHTML} ${secondNum.innerHTML} = ${equal.value}` ;
}


function showAnswers() {
  checkLS();
  let html = '';
  let dates = [];
  let set = new Set();
  const re = /\d{4}-\d\d-\d\d/;
  let count = 0; //number of dates
  let num = 0; // number of tasks

  //Get all the not same dates
  tasks.forEach( (item) => {
    set.add(item.date.match(re)[0] );
  });
  dates = [...set];

  //Rendering of the answers
  tasks.forEach( (item, i, arr) => {
    let closedDetails = '';

    if( item.date.match(re)[0] === dates[count] ) {
      count++;
      num = 0;
      let isOpened = count === dates.length ? 'open' : '';
      closedDetails = `</details>`;

      html += `
      ${closedDetails}
      <details ${isOpened}>
        <summary class="date">${item.date}</summary>`;
    }

    num++;
    let correct = item.isCorrect ? 'correct' : 'not-correct';
    let srcGood = window.images.good[randomInteger(0, window.images.good.length - 1)];
    let srcBad = window.images.bad[randomInteger(0, window.images.bad.length - 1)];
    let img = item.isCorrect ? `<img src="${srcGood}" alt="image"/>` : `<img src="${srcBad}" alt="image"/>`

    html += `
      <p class="${correct}">${num}) ${item.task} ${img}</p>`;
  });

  answers.innerHTML = html;
}


selectRandom.addEventListener('submit', getRandom);

function getRandom(e) {
  e.preventDefault();

  min = +this.elements.min.value;
  max = +this.elements.max.value;

  minMax = [min, max];
  localStorage.setItem('minMax', JSON.stringify(minMax));

  showTask();
}


function setRandom() {
  min = minMax[0];
  max = minMax[1];

  selectRandom.elements.min.value = min;
  selectRandom.elements.max.value = max;
}
