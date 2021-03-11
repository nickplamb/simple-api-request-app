let triviaRound = (function(){

  // Array of question objects with answers.
  let triviaQuestions = [];

  let apiBaseUrl = 'https://opentdb.com/api.php?encode=base64';
  // Array of required properties for each question
  let questionObjectTemplate = ['category', 'type', 'difficulty', 'question', 'correct_answer', 'incorrect_answers']

  // Retrieve all Questions for this round.
  function getAll() {
    return triviaQuestions;
  }
  // Add a new questions to this round.
  function add(newQuestion) {
    if (typeof newQuestion === 'object') {
      if (compareArrays(Object.keys(newQuestion), questionObjectTemplate)) {
        triviaQuestions.push(newQuestion);
      } else {
        console.error('Object does not have all required properties');
      }
    } else {
      console.error('Not an object');
    }
  }
  // Function to compare the array of keys in new question to array to required keys
  function compareArrays(arr1, template) {
    // Compare lengths
    if (arr1.length !== template.length) {
      return false;
    }
    // Compare keys one by one.
    for (let i = 0; i < template.length; i++) {
      if (arr1[i] !== template[i]) {
        return false;
      }
    }
    // All passes?
    return true;
  }

  function loadQuestions(e) {
    e.preventDefault();
    let url = apiBaseUrl;

    let query = new Object;
    query.amount = document.querySelector('#num-of-questions').value;
    query.category = document.querySelector('#categories').value;
    query.difficulty = document.querySelector('#difficulties').value;
    query.type = document.querySelector('#question-type').value;

    Object.entries(query).forEach(option => {
      if (option[1] !== '') {
        url += '&' + option[0] + '=' + option[1];
      }
    });
    console.log(query);
    fetchQuestions(url);
  }

  function fetchQuestions(url) {
    return fetch(url).then(response => {
        return response.json();
      }).then(json => {
        json.results.forEach(item => {
          let question = {
            category: decodeBase64(item.category),
            type: decodeBase64(item.type),
            difficulty: decodeBase64(item.difficulty),
            question: decodeBase64(item.question),
            correct_answer: decodeBase64(item.correct_answer),
            incorrect_answers: decodeBase64(item.incorrect_answers)
          }
          add(question);
        });
        displayQuestions();
      }).catch(e => {
        console.log(e)
      })
  }

  function decodeBase64(msg) {
    if (typeof msg === 'object') {
      let msgArr = [];
      msg.forEach(item => {
        msgArr.push(atob(item));
      });
      return msgArr;
    } else {
      return atob(msg);
    }
  }

  function displayQuestions() {
    // Grab all questions
    let allQuestions = getAll();

    // Loop through each question in the round
    allQuestions.forEach((question, index) => {
      cardContainer.appendChild(addListItem(question, index));
      // console.log(question);
    });
  }

  // Creates a div.card-container__card with the question and a ul of buttons as answers.
  function addListItem(question, questionIndex) {
    let possibleAnswers = question.incorrect_answers.slice();
    possibleAnswers.push(question.correct_answer);
    
    // Container for each card
    let card = document.createElement('li');
    card.classList.add('card-container__card');
    card.classList.add('question-card__' + (questionIndex + 1));
    
    // --------------Card Structure-------------
    // Card inner
    let cardInner = document.createElement('div');
    cardInner.classList.add('card-inner', 'card');
    // card front. Shows question with list of answers
    let cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    // Card back. Will flip over when answer selected and show right or wrong.
    let cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.setAttribute('id', 'card-back__'+(questionIndex + 1))

    // --------------FRONT-------------------
    // Header
    let cardFrontHeader = document.createElement('h3');
    cardFrontHeader.innerText = 'Question ' + (questionIndex + 1) + ':';
    // Question
    let cardQuestion = document.createElement('p');
    cardQuestion.innerText = question.question;
    // Answer List
    let answerList = document.createElement('ul');
    answerList.classList.add('answer-list');

    card.appendChild(cardInner);

    // Fill card Front
    cardFront.appendChild(cardFrontHeader);
    cardFront.appendChild(cardQuestion);
    cardFront.appendChild(answerList);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);


    // Loop through possible answers, create li with button for each
    // Add each li to .answer-list ul
    possibleAnswers.forEach((possibleAnswer, answerIndex) => {
      let answerListItem = document.createElement('li');
      
      // Create Button with class and possible answer
      let answerbtn = document.createElement('button');
      // create unique button ID
      let btnId = 'btn-' + questionIndex + '-' + answerIndex;

      // set btn attributes, text, and value
      answerbtn.classList.add('btn-answer');
      answerbtn.setAttribute('id', btnId);
      answerbtn.innerText = possibleAnswer;
      answerbtn.value = answerIndex+1;

      // Create event handler for each button
      createEventHandler(btnId, possibleAnswer);

      // add button to li
      answerListItem.appendChild(answerbtn);
      // add li to anser list ul
      answerList.appendChild(answerListItem);
    });

    function createEventHandler(btnId, possibleAnswer) {
      let parentCard = document.querySelector('.card-container')

      if (parentCard.addEventListener) {
        parentCard.addEventListener('click', e => handler(e, btnId, question, possibleAnswer), false);
      }else if (parentCard.attachEvent) {
        parentCard.attachEvent('onclick', e => handler(e, btnId));
      }
    }

    function handler(e, btnId, question, possibleAnswer) {
      e.preventDefault();
      // I think this isolates the handler to just the one clocked.
      if (e.target.id == btnId) { //http://jsfiddle.net/H97WY/
        let buttonSelected = document.querySelector('#'+btnId)
        let answerSelected = buttonSelected.innerText
        let questionNumber = btnId.split('-')[1];

        createCardBack(answerSelected, questionNumber);
      }
    }

    function createCardBack(answerSelected, questionNumber) {
      let cardBackHeader = document.createElement('h3');
      // cardBackHeader.classList.add('');

      // Determine if the answer selected is correct.
      if (answerSelected === question.correct_answer) {
        cardBackHeader.innerText = 'You are so smart!'
      } else {
        cardBackHeader.innerText = 'Isn\'t that cute. BUT IT\'S WRONG!'
      }
      
      cardBack.appendChild(cardBackHeader);
      cardInner.classList.add('flip-over');
    }

    return card;
  }

  // Return object with call to available functions
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadQuestions: loadQuestions
  };
})();

// Grab containing element
let cardContainer = document.querySelector('.card-container');

// -------Event listeners-----
let optionsBtn = document.querySelector('button.start-form__item');
optionsBtn.addEventListener('click', triviaRound.loadQuestions);











