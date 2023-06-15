const passDisplay = document.querySelector('.password-display')
const slider = document.querySelector('.slider')
const passLengthVal = document.querySelector('.password-length-val')

const copyBtn = document.querySelector('.copy-btn')
const copyMsg = document.querySelector('.copy-msg')

const upperCheck = document.querySelector('#upper-check')
const lowerCheck = document.querySelector('#lower-check')
const numberCheck = document.querySelector('#number-check')
const symbolCheck = document.querySelector('#symbol-check')

const indicator = document.querySelector('.strength-indicator')
const generateBtn = document.querySelector('.pass-generator-btn')

const allCheck = document.querySelectorAll('.check')
const symbols = '`~@##$%^&*()-_=+[{]}|;:",<.>/?';

// initialization
let password = '';
let passwordLength = 10;
let checkCount = 0;
handleSlider()
setIndicator('#ccc')

function handleSlider(e) {
    slider.value = passwordLength;
    passLengthVal.textContent = passwordLength;

    const min = slider.min;
    const max = slider.max;
    slider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUpperCase() {
    return String.fromCharCode(getRandInteger(65, 90));
}

function generateLowerCase() {
    return String.fromCharCode(getRandInteger(97, 122));
}

function generateRandNumber() {
    return getRandInteger(0, 9);
}

function generateRandSymbol() {
    return symbols[getRandInteger(0, symbols.length - 1)];
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upperCheck.checked) hasUpper = true;
    if (lowerCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBox() {
    checkCount = 0;
    allCheck.forEach(checkbox => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider()
    }
}

copyBtn.addEventListener('click', () => {
    if(passDisplay.value)
        copyContent();
})

slider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider()
})

allCheck.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckBox);
})

generateBtn.addEventListener('click', () => {
    // if no checkboxes selected
    if (checkCount == 0) return;

    password = '';
    let funcArr = []
    if (upperCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowerCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numberCheck.checked) {
        funcArr.push(generateRandNumber);
    }
    if (symbolCheck.checked) {
        funcArr.push(generateRandSymbol);
    }
    // compulsory addition
    funcArr.forEach(func => {
        password += func();
    })
    
    // remaining addition
    for (let i = 0; i < passwordLength-funcArr.length; i++) {
        let randIndex = getRandInteger(0, funcArr.length-1);
        password += funcArr[randIndex]();
    }
    
    // shuffle password
    password = shufflePassword(Array.from(password));

    // Show password in display
    passDisplay.value = password;

    // calculate password strength
    calcStrength();
})