'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  user: 'js',
  active: true,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  user: 'jd',
  active: true,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  user: 'sw',
  active: true,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  user:"ss",
  active: true,
};

let accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
let activeAcc, balance, timer;
///////////////////functions
//other functions
function messageUI(message, color = 'black') {
  labelWelcome.textContent = message;
  labelWelcome.style.color = color;
}

//error handling functions
function emptyInputErrorHandling(stringIn, numberIn, message) {
  // checking input field value
  if (stringIn === '' || numberIn === 0) {
    //display error message
    messageUI(message, 'red');
    return true;
  }
}
////////////helper functions of login handler
function loginError(user, pin, acc) {
  if (user === '' || pin === 0) {
    messageUI('empty input feild', 'red');
    containerApp.style.opacity = 0;
  } else if (acc) {
    containerApp.style.opacity = 100;
    messageUI(`welcome, ${acc?.owner}`);
  } else if (!acc) {
    messageUI('invalid pin or username', 'red');
    containerApp.style.opacity = 0;
  }
}
function loginAccFind(user, pin) {
  let acc = accounts.find(
    acc => acc.user === user && acc.pin === pin && acc.active === true
  );
  return acc;
}
////////////////////////////////////////////////////////////////////////////helper function of DisplayUi
function displayBalance(movements) {
  balance = movements?.reduce((acc, cur) => cur + acc, 0);
  labelBalance.textContent = `${balance}$`;
}
function displayMovements(movements) {
  containerMovements.innerHTML = '';
  let mov = sort ? movements : movements?.slice().sort((a, b) => a - b);

  mov?.forEach((el, i, arr) => {
    if (el > 1) {
      let markup = `<div class="movements__row">
      <div class="movements__type movements__type--deposit"> deposit</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${el}€</div>
    </div>`;
      containerMovements.insertAdjacentHTML('afterbegin', markup);
    }
    if (el < 1) {
      let markup = ` <div class="movements__row">
      <div class="movements__type movements__type--withdrawal">
         withdrawal
      </div>
      <div class="movements__date">24/01/2037</div>
      <div class="movements__value">${el}€</div>
    </div>
  </div> `;
      containerMovements.insertAdjacentHTML('afterbegin', markup);
    }
  });
}
function displayDate() {
  const date = new Intl.DateTimeFormat(navigator.language).format(
    new Date(Date.now())
  );
  labelDate.textContent = date;
}
function logOutTimerStart() {
  //////timer
  let sec = 60;
  const tick = function () {
    labelTimer.textContent = `${parseInt(sec / 60)}:${String(
      parseInt(sec % 60)
    ).padStart(2, 0)}`;
    if (sec === 0) {
      sec - 1;
      containerApp.style.opacity = 0;
      activeAcc = null;
      messageUI('Log in to get started');
      clearInterval(timer);
    }

    sec--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
function displayIn(movements) {
  const inAmount = movements
    .filter(e => e > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${inAmount}$`;
}
function displayOut(movements) {
  const outAmount = movements
    .filter(e => e < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outAmount)}$`;
}
function displayInterest() {
  const interest = (balance * activeAcc?.interestRate) / 100;
  labelSumInterest.textContent = `${interest}$`;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////handler functions
function displayUI(
  movements,
  input1 = undefined,
  input2 = undefined,
  sort = false
) {
  // display balance
  displayBalance(movements);
  displayMovements(movements);
  //display date
  displayDate();
  //logOut timer
  if (timer) {
    clearInterval(timer);
  }
  timer = logOutTimerStart();
  //displat in out
  displayOut(movements);
  displayIn(movements);
  //display interest
  displayInterest();
  //clear input feild
  input1.value = input2.value = '';
}

function btnLoginHandler(accounts) {
  //rec input value
  const user = inputLoginUsername.value;
  const pin = +inputLoginPin.value;
  //
  // find active account account
  let acc = loginAccFind(user, pin);
  //error handling
  loginError(user, pin, acc);

  return acc;
}
function btnTransferHandler() {
  // rec input value
  const transferTo = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  // find transferTo acc
  let acc = accounts.find(acc => acc.user === transferTo);
  //emplty input feild error handling
  const message = `${activeAcc?.owner},worng input data`;
  emptyInputErrorHandling(transferTo, amount, message);
  // same acc not tranfer able error handling
  if (activeAcc?.owner === acc?.owner) {
    messageUI(
      `hello ${activeAcc?.owner}, you try transfer in same account`,
      'red'
    );
    return;
  }
  // transfer amount control and transfer done
  else if (balance > amount && amount > 0 && acc) {
    activeAcc?.movements.push(-amount);
    acc?.movements.push(amount);
    messageUI(`welcome,${activeAcc?.owner}`);
  } else {
  }
  displayUI(activeAcc.movements, inputTransferAmount, inputTransferTo);
}
function btnLoanHandler() {
  //rec input value
  const amount = +inputLoanAmount.value;
  // control loan amount and loan done
  if (amount < balance / 100 && amount > 0) {
    activeAcc.movements.push(amount);
    displayUI(activeAcc.movements, inputLoanAmount, inputLoanAmount);
    let message = `${activeAcc.owner}, your loan amount ${amount}$ transfered`;
    messageUI(message, 'blue');
  } else {
    let message = `${activeAcc.owner}, you can apply loan amount 1 to  ${
      balance / 100
    }$`;
    messageUI(message, 'red');
  }
}
function btnCloseHandler() {
  const user = inputCloseUsername.value;
  const pin = +inputClosePin.value;
  //error handling
  let message = `${activeAcc.owner},wrong input data`;
  if (!emptyInputErrorHandling(user, pin, message)) {
    if (activeAcc.user === user && activeAcc.pin === pin) {
      let index = accounts.findIndex(acc => acc.user === user);
      accounts[index].active = false;
      containerApp.style.opacity = 0;
      messageUI(`your  account is closed`, 'blue');
      inputCloseUsername.value = '';
      inputClosePin.value = '';
    } else {
      messageUI(`${activeAcc.owner},invalid user or pin`, 'red');
      inputCloseUsername.value = '';
      inputClosePin.value = '';
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////event handling
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  activeAcc = btnLoginHandler(accounts);
  //////movement blance
  if (activeAcc) {
    displayUI(activeAcc?.movements, inputLoginUsername, inputLoginPin);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  btnTransferHandler();
});
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  btnLoanHandler();
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  btnCloseHandler();
});
let sort = false;
btnSort.addEventListener('click', e => {
  sort = !sort;
  displayUI(activeAcc.movements, inputCloseUsername, inputClosePin, sort);
});
