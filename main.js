const numberBtn = document.querySelectorAll('.number-btn');
const operatorBtn = document.querySelectorAll('.operator-btn');
const equalsBtn = document.querySelector('.equals-btn');
const clearBtn = document.querySelectorAll('.clear-btn');
const plusmnBtn = document.querySelector('.plusmn-btn');
const multiplyBtn = document.querySelector('#multiply-btn');
const divideBtn = document.querySelector('#divide-btn');
const allBtns = document.querySelectorAll('button');
const decimalBtn = document.querySelector('.decimal-btn');
const input = document.querySelector('.calculator__operation-input');
const result = document.querySelector('.calculator__operation-result');
const calcPattern = /-?\d*\.?\d+/;
const operatorPattern = /[\+\-\/\*]$/;
let calcValues = [];
let calcOperator = '';
let calcResult = '';
let isBtnEquals = false;

input.focus();

numberBtn.forEach(function(button) {
    button.addEventListener('click', () => {
        input.value += button.value;
    });
});

decimalBtn.addEventListener('click', () => {
    input.value += decimalBtn.value;
    decimalBtn.disabled = true;
    if(input.value.length < 2) {
        input.value = '0.';
    }
    allBtns.forEach(function(button) {
        button.addEventListener('click', () => {
            if(!input.value.includes('.')) {
                decimalBtn.disabled = false;
            }
        });
    });
});

function getResults() {
    if(calcValues.length < 2 && input.value.match(calcPattern)) {
        //slice the input from 0 to 16 digits before it's pushed into the array
        input.value.match(/[.-]/g) ? input.value = input.value.slice(0,17) : input.value = input.value.slice(0,16);
        calcValues.push(+input.value.match(calcPattern));
        result.textContent = `${input.value.match(calcPattern)} ${calcOperator}`;
        input.value = '';
    }

    if(calcOperator === '/' && calcValues[1] === 0) {
        result.textContent = `Let's not do that!`;
        setTimeout(() => {
            result.textContent = '';
        }, 1000);
        calcOperator = '';
        calcValues.splice(0);
    } else if(calcValues.length === 2) {
        operate(calcOperator);
        //if equals is pressed, the calculator is gonna show the entire operation
        if(isBtnEquals === true) {
            result.textContent = `${calcValues[0]} ${calcOperator} ${calcValues[1]} =`;
            input.value = calcResult;
            calcValues.splice(0);
        //otherwise it's gonna show the result and the next operator
        } else {
            result.textContent = `${calcResult} ${calcOperator}`;
            calcValues.splice(0,2,calcResult);
            input.value = '';
        }
        isBtnEquals = false;
    }
    updateOperatorsDisplay();
}

//this function doesn't change any functionality
//it's just a display update from / and * to ÷ and ×
function updateOperatorsDisplay() {
    if(result.textContent.includes('*')) {
        result.textContent = result.textContent.replace('*', multiplyBtn.textContent);
    } else if(result.textContent.includes('/')) {
        result.textContent = result.textContent.replace('/', divideBtn.textContent);
    }
}

//this function on the other hand, updates the operator
//that is used in each operation
function switchOperators(operatorSwitch) {
    if(!result.textContent.match(/\d+$/) && result.textContent !== '') {
        result.textContent = `${result.textContent.slice(0, -1)} ${operatorSwitch}`;
    } else if(result.textContent === '') {
        result.textContent = `0 ${operatorSwitch}`;
        calcValues.push(0);
    }
    calcOperator = operatorSwitch;
}

operatorBtn.forEach(function(button) {
    button.addEventListener('click', () => {
        getResults();
        switchOperators(button.value);
        updateOperatorsDisplay();
    });
});

equalsBtn.addEventListener('click', () => {
    isBtnEquals = true;
    getResults();
});

document.addEventListener('keypress', (e) => {
    if(e.key.match(calcPattern)) {
        input.focus();
    }
    if(e.key.match(operatorPattern)) {
        getResults();
        switchOperators(e.key);
        e.preventDefault();
    } else if(e.key === 'Enter') {
        equalsBtn.click();
    } else if(!e.key.match(calcPattern) && e.key !== '.') {
        e.preventDefault();
    }

    if(e.key === '.' && input.value === '') {
        input.value = '0';
    } else if(e.key === '.' && input.value.includes('.')) {
        e.preventDefault();
    }
    updateOperatorsDisplay();
});

clearBtn.forEach(function(button) {
    button.addEventListener('click', () => {
        switch(button.value) {
            case 'C':
                input.value = '';
                result.textContent = '';
                calcValues.splice(0);
                calcOperator = '';
                calcResult = '';
                break;
            case 'CE':
                input.value = '';
                break;
            case 'DEL':
                input.value = input.value.slice(0,-1);
                break;
        }
    });
});

plusmnBtn.addEventListener('click', () => {
    if(input.value.includes('-')) {
        input.value = input.value.slice(1);
    } else {
        input.value = '-' + input.value;
    }
});

function add(...arg) {
    return arg.reduce((total, curr) => +(total + curr).toFixed(2));
}

function subtract(...arg) {
    return arg.reduce((total, curr) => +(total - curr).toFixed(2));
}

function multiply(...arg) {
    return arg.reduce((total, curr) => +(total * curr).toFixed(2));
}

function divide(...arg) {
    return arg.reduce((total, curr) => +(total / curr).toFixed(2));
}

function operate(operator) {
    switch(operator) {
        case '+':
            calcOperator = '+';
            calcResult = add(...calcValues);
            break;
        case '-':
            calcOperator = '-';
            calcResult = subtract(...calcValues);
            break;
        case '*':
            calcOperator = '*';
            calcResult = multiply(...calcValues);
            break;
        case '/':
            calcOperator = '/';
            calcResult = divide(...calcValues);
            break;
    }
}