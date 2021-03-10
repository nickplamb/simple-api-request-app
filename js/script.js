let triviaRound = (function(){
  // Array of question objects with answers.
  let triviaQuestions = [{
      catagory: 'science',
      question: 'What is the acceleration due to gravity on earth?',
      possibleAnswers: [
        '9.8 meters per second',
        '9.8 meters per second squared',
        '7.2 meters per second squared',
        '7.2 meters per second'
      ],
      correctAnswer: '9.8 meters per second squared'
    },
    {
      catagory: 'Entertainment',
      question: 'Who played Colonel Jack O\'Neill on the TV show Stargate SG1?',
      possibleAnswers: [
        'Christphoer Judge',
        'Michael Shanks',
        'Don S. Davis',
        'Richard Dean Anderson'
      ],
      correctAnswer: 'Richard Dean Anderson'
    },
    {
      catagory: 'Art',
      question: 'Rembrandt painted "Starry Night".',
      possibleAnswers: [
        'True',
        'False'
      ],
      correctAnswer: 'False'
    }
  ];
  // Array of required properties for each question
  let questionObjectTemplate = ['catagory', 'question', 'possibleAnswers', 'correctAnswer']

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

  // Creates a div.card-container__card with the question and a ul of buttons as answers.
  function addListItem(question, questionIndex) {
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
    question.possibleAnswers.forEach((possibleAnswer, answerIndex) => {
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
      if (answerSelected === question.correctAnswer) {
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
    addListItem: addListItem
  };
})();

// New question to be added to triviaRound
let newQuestion = {
  catagory: 'Entertainment: Music',
  question: 'The cover of The Beatles album &quot;Abbey Road&quot; featured a Volkswagen Beetle in the background.',
  possibleAnswers: [
    'True',
    'False'
  ],
  correctAnswer: 'True',
}



// Add the newQuestion
triviaRound.add(newQuestion);

// Grab containing element
let cardContainer = document.querySelector('.card-container');

// Grab all questions
let allQuestions = triviaRound.getAll();

// Loop through each question in the round
allQuestions.forEach((question, index) => {
  cardContainer.appendChild(triviaRound.addListItem(question, index));
});

function decodeBase64(msg) {
  let decodedObject = new Object;
  // msg.entries().forEach
//  console.log(msg);
  // return decodedObject;
}

// -------Event listeners-----
let optionsBtn = document.querySelector('button.start-form__item');
// optionsBtn.addEventListener('click', getQuestionsFromOpenDB);

let parentCard = document.querySelector
if (parent.addEventListener) {
    parent.addEventListener('click', handler, false);
}else if (parent.attachEvent) {
    parent.attachEvent('onclick', handler);
}

function handler(e) {
    if (e.target.id == 'test') {
         // the button was clicked
    }
}







function getQuestionsFromOpenDB() {
  let url = 'https://opentdb.com/api.php?encode=base64';

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

  let encodedQuestions = fetchAndParseQuestions(url);
  let decodedQuestions = decodeBase64(encodedQuestions);

}

function fetchAndParseQuestions(url) {
  let encodedQuestions = fetch(url).then(response => {
    return response.json();
  }).then(data => {
    return data;
  });
  // .catch(err => {
  //   console.warn('something went wrong. ' + err);
  // });
  console.log(encodedQuestions);
  return encodedQuestions.results;
}


