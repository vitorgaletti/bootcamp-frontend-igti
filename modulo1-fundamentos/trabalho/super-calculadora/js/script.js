'use strict';

var globalInputA = document.querySelector('#inputA');
var globalInputB = document.querySelector('#inputB');
var globalInputs = document.querySelectorAll('.number');

function start() {
  globalInputA.addEventListener('input', handleChangeInputA);
  globalInputB.addEventListener('input', handleChangeInputB);
  globalInputA.focus();
}

function handleChangeInputA() {
  calculate();
}

function handleChangeInputB() {
  calculate();
}

function calculate() {
  var a = parseInt(globalInputA.value);
  var b = parseInt(globalInputB.value);

  function division(division) {
    if (a === 0 || b === 0) return 'Divisão por 0';
    else if (division === 'divisionOne') return (a / b).toFixed(2);
    else return (b / a).toFixed(2);
  }

  function divisor1() {
    var divisorsA = [];
    for (var i = 0; i <= a; i++) {
      if (a % i === 0) {
        divisorsA.push(i).toFixed(2);
      }
    }
    return divisorsA.join(', ') + ' (' + divisorsA.length + ')';
  }

  function divisor2() {
    var divisorsB = [];
    for (var i = 0; i <= b; i++) {
      if (b % i === 0) {
        divisorsB.push(i).toFixed(2);
      }
    }

    return divisorsB.join(', ') + ' (' + divisorsB.length + ')';
  }

  function fatorial1() {
    if (a >= 21) {
      return 'Número muito grande';
    }
    var result = a;
    for (var i = 1; i < a; i++) {
      result *= i;
    }
    return result.toFixed(2);
  }

  function fatorial2() {
    if (b >= 21) {
      return 'Número muito grande';
    }
    var result = b;
    for (var i = 1; i < b; i++) {
      result *= i;
    }

    return result.toFixed(2);
  }

  if (a >= 0 && b >= 0) {
    for (var i = 0; i < globalInputs.length; i++) {
      var ids = document.getElementById(globalInputs[i].id);
      switch (true) {
        case ids.id === 'sum':
          ids.value = a + b.toFixed(2);
          break;
        case ids.id === 'subtractOne':
          ids.value = a - b.toFixed(2);
          break;
        case ids.id === 'subtractTwo':
          ids.value = b - a.toFixed(2);
          break;
        case ids.id === 'multiply':
          ids.value = a * b.toFixed(2);
          break;
        case ids.id === 'divisionOne':
          ids.value = division('divisionOne');
          break;
        case ids.id === 'divisionTwo':
          ids.value = division('divisionTwo');
          break;
        case ids.id === 'squareOne':
          ids.value = (a ** 2).toFixed(2);
          break;
        case ids.id === 'squareTwo':
          ids.value = (b ** 2).toFixed(2);
          break;
        case ids.id === 'divisorsOne':
          ids.value = divisor1();
          break;
        case ids.id === 'divisorsTwo':
          ids.value = divisor2();
          break;
        case ids.id === 'factorialOne':
          ids.value = fatorial1();
          break;
        case ids.id === 'factorialTwo':
          ids.value = fatorial2();
      }
    }
  } else {
    clearInput();
  }
}

function clearInput() {
  for (var i = 0; i < globalInputs.length; i++) {
    globalInputs[i].value = '';
  }
}

start();
