const inputSlider = document.querySelector("[data-lengthSlider]");      //It's a custom attribute name so inside []
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type = checkbox]");
// Using this symbols string we will pick random symbols during password generation
const symbols = '!@#$~`%^&*()_+=-[]{}"|?/>.<,';         

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();         
// Set strength circle color to grey
setIndicator("#ccc")


// Set password length

function handleSlider() {
    console.log("Handle slider working properly");

    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    // console.log(isNaN((passwordLength - min)*100 ));
    const percentage = ((passwordLength - min) * 100) / (max - min);
    console.log(percentage);
    inputSlider.style.backgroundSize = `${percentage}% 100%`;         /*first ,second => width , height*/
}

console.log("Handle slider done");

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // Shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;          //To get the random number between minimum and maximum value 
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));        //We found lower case character randomly by charCode...otherwise we would be getting an integer
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);                             //First we found a random index and then picked up the symbol at that index
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

// This function won't work until we add CSS
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);      //Await ensures that move fwd only when the password has been copied successfully
        copyMsg.innerText = "Copied"
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }

    // To make copy span visible
    copyMsg.classList.add("active");

    // To remove the copyMsg text in 2 seconds (2000)
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // algo : Fisher Yates Method : We can apply this on some array to shuffle it

    for(let  i = array.length -1 ; i > 0 ; i--){
        const j = Math.floor(Math.random() * (i+1));         //This will choose any random value between 0 to ith index .
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) =>{ str += el });
    return str;
}

// Applying event listener on checkboxes

function handleCheckBoxChange(){
    checkCount = 0 ; 
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // as password length cannot be shorter than the no. of checkboxes checked..so applying the condition:
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();

    }
}

    //Here each checkbox is fetched and whenever any change (check or uncheck) happens it will count checks by another function

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;            //e.target refera to the slider ball
    handleSlider();
}) 

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click' , () => {
    // None of the checkbox are selected
    if(checkCount == 0) 
        return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // Finding new password

    // emptying the old password first if any.
    password = "";

    // adding elements mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol ();
    // }

    // the checked boxes are added.. now we have to add rest of the characters randomly ...either num , symbol , uppercase or lowercase
    // So first creating an array which consits of all the functions used to generate the characters.

    let funArr =[];

    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funArr.push(generateSymbol);
    }

    // compulsory additions (that are checked):

    for(let i = 0 ; i < funArr.length ; i++){
        console.log("In funArra loop");             //Just to check if the loop is working or not.
        password += funArr[i]();
        console.log("In funArra loop down ");

    }

    // Remaining additions:

    for(let i = 0 ; i < passwordLength - funArr.length ; i++){
        let randomIndex = getRandomInteger(0 , funArr.length);
        password += funArr[randomIndex]();
    }

    // Now the sequence of characters has become very obvious as it's followed by uppercase , lowercase , number , symbol...and then other characters..so now we will shuffle it

    password = shufflePassword(Array.from(password));

    // Displaying in UI
    passwordDisplay.value = password;
    // Calculate strength
    calcStrength();

});