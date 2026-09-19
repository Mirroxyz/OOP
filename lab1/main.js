import { openWork1Dialog } from './module1.js';
import { openWork2Dialog } from './module2.js';

const resultText = document.getElementById('resultText');

const showResult = (message) => {
  resultText.textContent = message;
};

document.getElementById('menu1').addEventListener('click', () => {
  openWork1Dialog((value) => {
    showResult(value);
  });
});

document.getElementById('menu2').addEventListener('click', () => {
  openWork2Dialog((value) => {
    showResult(value);
  });
});
