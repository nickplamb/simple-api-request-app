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
      console.error('Not an object')
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
  function addListItem(question, index) {
    // Container for each card
    let card = document.createElement('li');
    card.classList.add('card-container__card');
    card.classList.add('question-card__' + (index + 1));
    
    // Header
    let cardHeader = document.createElement('h3');
    cardHeader.innerText = 'Question ' + (index + 1) + ':';
    
    // Question
    let cardQuestion = document.createElement('p');
    cardQuestion.innerText = question.question;

    // Answer List
    let answerList = document.createElement('ul');
    answerList.classList.add('answer-list');


    card.appendChild(cardHeader);
    card.appendChild(cardQuestion);
    card.appendChild(answerList);

    // Loop through possible answers, create li with button for each
    // Add each li to .answer-list ul
    question.possibleAnswers.forEach((possibleAnswer, index) => {
      let answerListItem = document.createElement('li');
      
      // Create Button with class and possible answer
      let answerbtn = document.createElement('button');
      answerbtn.classList.add('btn-answer');
      answerbtn.innerText = possibleAnswer;
      answerbtn.value = index+1;

      // add button to li
      answerListItem.appendChild(answerbtn);

      answerList.appendChild(answerListItem);
    });

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
  return atob(msg);
}

// -------Event listeners-----



function checkAnswer(slectedChoice, ) {
  if (choice === question.correctAnswer) {
    
  } else {
    
  }
}
