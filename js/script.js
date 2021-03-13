let triviaRound = (function(){

  // Array of question objects with answers.
  let triviaQuestions = [];
  let allCategories = [];
  let score = 0;

  let apiBaseUrl = 'https://opentdb.com/api.php?encode=base64';
  // Array of required properties for each question
  const questionObjectTemplate = ['category', 'type', 'difficulty', 'question', 'correct_answer', 'incorrect_answers']
  const snarkyResponses = {
    correct: [
      'Correct! Looks like you are a pretty good guesser.',
      'Correct! but that was an easy one...',
      'correct... Finally!',
      'Correct! You might just be smarter then a child.',
      'Correct! You had a 50/50 chance though.',
      'Correct. Everyone knows that though.',
      'Guessing, 50% of the time it works every time.'
    ],
    incorrect: [
      'So close...(not really.)',
      'Come one, that was an easy one.',
      'How could you have gotten that one wrong. It was so easy.',
      'Come on, that was obvious.',
      'Do you have a hard time remembering to breath?',
      'My dog knew that one...',
      'That was a no brainer.',
    ]
  }
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
    // All passes!
    return true;
  }

  // Populate category array used by category dropdown
  function loadCategories() {
    let categoriesUrl = 'https://opentdb.com/api_category.php';
    return fetch(categoriesUrl).then(response => {
      return response.json();
    }).then(json => {
      json.trivia_categories.forEach(category => {
        let categoryListItem = {
          id: category.id,
          name: category.name
        }
        allCategories.push(categoryListItem);
      });
      addCategoriesToDropDown();
    }).catch(e => {
      console.error(e)
    })
  }

  // Populate dropdown for categories.
  function addCategoriesToDropDown() {
    let dropDown = document.querySelector('#categories');
    allCategories.forEach(item => {
      let listItem = document.createElement('option');
      listItem.setAttribute('value', item.id);
      listItem.innerText = item.name;

      dropDown.appendChild(listItem);
    });
  }

  // Build query string from start form. call fetchQuestions func. to make request.
  function loadQuestions(e) {
    e.preventDefault();

    resetQuestions();

    let url = apiBaseUrl;

    let query = new Object;
    query.amount = document.querySelector('#num-of-questions').value;
    query.category = document.querySelector('#categories').value;
    query.difficulty = document.querySelector('#difficulties').value;
    query.type = document.querySelector('#question-type').value;

    // Add the selected options to query string
    Object.entries(query).forEach(option => {
      if (option[1] !== '') {
        url += '&' + option[0] + '=' + option[1];
      }
    });
    fetchQuestions(url);
  }

  // Make api request, add response to question array, show questions to user
  function fetchQuestions(url) {
    return fetch(url).then(response => {
        return response.json();
      }).then(json => {
        if (json.results.length !== 0) {
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
        } else {
          console.error('Too Specific');
          // Display error message to user:
          // 'There are no ${difficulty} ${questionType} questions in ${category}'
          // with logic to determine which options were selected and taylor response.
        }
        displayQuestions();
      }).catch(e => {
        console.log(e)
      })
  }

  // Response is base64 encoded for special character, decode base64
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

  // Grab question array and loop through, sending each to addListItem func. for html creation
  function displayQuestions() {
    // Grab all questions
    let allQuestions = getAll();
    let numOfQuestions = allQuestions.length;

    // Loop through each question in the round
    allQuestions.forEach((question, index) => {
      addListItem(question, index, numOfQuestions);
    });
  }

  // Creates a div.card-container__card with the question and a ul of buttons as answers.
  function addListItem(question, questionIndex, numOfQuestions) {
    let cardContainer = document.querySelector('.card-container');

    // Combine the correct answer and incorrect answers into new array
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
    let heightCalcDiv = document.createElement('div');
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
    heightCalcDiv.appendChild(cardFrontHeader);
    heightCalcDiv.appendChild(cardQuestion);
    heightCalcDiv.appendChild(answerList);
    
    // Fill card Front
    // cardFront.appendChild(cardFrontHeader);
    // cardFront.appendChild(cardQuestion);
    // cardFront.appendChild(answerList);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    // array to allow me to randomize order of answers
    let answerArr = [];

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
      createAnswerEventHandler(btnId, numOfQuestions);

      // add button to li
      answerListItem.appendChild(answerbtn);
      // add li to anser list ul
      answerArr.push(answerListItem);
    });

    shuffleArray(answerArr)
    answerArr.forEach(item => {
      answerList.appendChild(item);
    });

    function createAnswerEventHandler(btnId, numOfQuestions) {
      let parentCard = document.querySelector('.card-container')

      if (parentCard.addEventListener) {
        parentCard.addEventListener('click', e => answerHandler(e, btnId, numOfQuestions), false);
      }else if (parentCard.attachEvent) {
        parentCard.attachEvent('onclick', e => answerHandler(e, btnId, numOfQuestions));
      }
    }

    function answerHandler(e, btnId, numOfQuestions) {
      e.preventDefault();
      // each handler is a seperate instance.
      //http://jsfiddle.net/H97WY/
      if (e.target.id == btnId) { 
        let buttonSelected = document.querySelector('#'+btnId)
        let answerSelected = buttonSelected.innerText

        createCardBack(answerSelected, numOfQuestions);
      }
    }

    function createCardBack(answerSelected, numOfQuestions) {
      let cardBackHeader = document.createElement('h3');
      let cardBackQuestion = document.createElement('p');
      let cardBackAnswer = document.createElement('p');

      cardBackQuestion.innerText = question.question;
      cardBackAnswer.innerText = question.correct_answer;

      // Determine if the answer selected is correct.
      if (answerSelected === question.correct_answer) {
        score += 1;
        cardBackHeader.innerText = 'Correct!'
      } else {
        cardBackHeader.innerText = 'WRONG! The correct answer is ' + question.correct_answer + '.'
      }

      cardBack.appendChild(cardBackHeader);
      cardBack.appendChild(cardBackQuestion);
      cardBack.appendChild(cardBackAnswer);

      if (questionIndex + 1 === numOfQuestions) {
        // let totalScoreElement = document.createElement('p');
        let title = '';
        let text = '';
        if (score === 0) {
          title = 'You are not very good at this.';
          text = 'You didn\'t get any correct.';
          // totalScoreElement.innerText = 'You are not very good at this. You didn\'t get any correct.';
        } else if (score <= numOfQuestions * 0.6){
          title = 'Was that the best you could do?';
          text = 'You only got ' + score + ' out of ' + numOfQuestions + '.';
          // totalScoreElement.innerText = 'You gave it your best shot. You only got ' + score + ' out of ' + numOfQuestions + '.';
        } else if (score === numOfQuestions) {
          title = 'Ok, maybe you are pretty smart.';
          text = 'You got a perfect score!';
          // totalScoreElement.innerText = 'Ok, maybe you are pretty smart. You got a perfect score!';
        } else {
          title = 'You did pretty well!';
          text = 'You got ' + score + ' out of ' + numOfQuestions + '.';
          // totalScoreElement.innerText = 'You did pretty well! You got ' + score + ' out of ' + numOfQuestions + '.';
        }
        showDialog(title, text);
      }

      cardInner.classList.add('flip-over');
    }

    // Card front must be set to position:absolute for card flip to work.
    // This causes long questions/answers to extend beyond the bottom of card 
    // on narrow screens.
    // This calculation places the content then measures the height of heightCalcDiv
    // and resizes the height of the card accordingly.
    // https://stackoverflow.com/a/5944059/15158461
    cardFront.appendChild(heightCalcDiv);
    // heightCalcDiv.style.visibility = 'hidden';
    cardContainer.appendChild(card);
    let contentHeight = parseInt(window.getComputedStyle(heightCalcDiv).height);
    if (contentHeight > 315) {
      card.style.height = (contentHeight + 110) + 'px';
    }
    // heightCalcDiv.style.visibility = '';
  }

  function resetQuestions() {
    document.querySelectorAll('.card-container__card').forEach(element => element.remove());
    triviaQuestions = [];
    score = 0;
  }

  // ----------Modal------------ 
  function showModal(title, text) {
    let modalContainer = document.querySelector('#modal-container');
    
    // Clear all existing modal content
    modalContainer.innerHTML = '';
  
    let modal = document.createElement('div');
    modal.classList.add('modal');

    let titleElement = document.createElement('h1');
    titleElement.innerText = title;

    let contentElement = document.createElement('p');
    contentElement.innerText = text;

    // modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');
  }

  function hideModal() {
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.classList.remove('is-visible');
  }

  // ------------DIALOG MODAL--------------------
  function showDialog( title, text) {
    showModal(title, text);
  
    let modalContainer = document.querySelector('#modal-container');
  
    let modal = modalContainer.querySelector('.modal');
  
    let resetTrivia = document.createElement('button');
    resetTrivia.classList.add('modal-confirm');
    resetTrivia.innerText = 'Play Again?';
  
    let reviewTrivia = document.createElement('button');
    reviewTrivia.classList.add('modal-cancel');
    reviewTrivia.innerText = 'Review questions?';
  
    modal.appendChild(resetTrivia);
    modal.appendChild(reviewTrivia);
  
    resetTrivia.focus();

    reviewTrivia.addEventListener('click', hideModal);
    resetTrivia.addEventListener('click', () => {
      resetQuestions();
      hideModal();
    });
  }

  window.addEventListener('keydown', e => {
    let modalContainer = document.querySelector('#modal-container');
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });
  
  window.addEventListener('click', e => {
    let modalContainer = document.querySelector('#modal-container');
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  }); 


  // Return object with call to available functions
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadQuestions: loadQuestions,
    loadCategories: loadCategories,
    resetQuestions: resetQuestions
  };
})();

/* Randomize array in-place using Durstenfeld shuffle algorithm */
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

triviaRound.loadCategories();

// -------Event listeners-----
let startForm = document.querySelector('#form');
startForm.addEventListener('submit', (e) => {
  triviaRound.resetQuestions();
  triviaRound.loadQuestions(e);
});
