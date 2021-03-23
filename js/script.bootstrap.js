let triviaSession = (function(){

  // Array of question objects with answers.
  let triviaQuestions = [];
  let allCategories = [];
  let score = 0;
  // This is the number of questions answered in this round.
  let questionsAnswered = 0;

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

  // Ajax request to API for all categories. push to allCategories, call populateCategoriesDropdown
  function fetchCategories() {
    let categoriesURL = 'https://opentdb.com/api_category.php';
    return $.ajax(categoriesURL, { dataType: 'json' }
    ).then(responseJSON => {
      responseJSON.trivia_categories.forEach(category => {
        let categoryListItem = {
          id: category.id,
          name: category.name
        }
        allCategories.push(categoryListItem);
      });
      populateCategoriesDropdown();
    }).catch(e => {
      console.error(e);
    });
  }

  // Add all categories to categories dropdown on form.
  function populateCategoriesDropdown() {
    let dropdown = $('#categories');
    allCategories.forEach(item => {
      let listItem = $(`<option value="${item.id}">${item.name}</option>`);
      dropdown.append(listItem);
    });
  }

  function prepareQuestionRetrieval(e) {
    e.preventDefault();

    resetQuestions();

    let url = apiBaseUrl;

    let query = new Object;
    query.amount = $('#num-of-questions').val();
    query.category = $('#categories').val();
    query.difficulty = $('#difficulties').val();
    query.type = $('#question-type').val();

    Object.entries(query).forEach(option => {
      if (option[1] !== '') {
        url += `&${option[0]}=${option[1]}`;
      }
    });
    fetchQuestions(url)
  }

  function fetchQuestions(url) {
    $.ajax(url, {dataType: 'json'}
    ).then(responseJSON => {
      if (responseJSON.results.length !== 0) {
        responseJSON.results.forEach(item => {
          let question = {
            category: decodeBase64(item.category),
            type: decodeBase64(item.type),
            difficulty: decodeBase64(item.difficulty),
            question: decodeBase64(item.question),
            correct_answer: decodeBase64(item.correct_answer),
            incorrect_answers: decodeBase64(item.incorrect_answers)
          }
          addQuestionToArray(question);
        });
      } else {
        console.error('Too Specific');
        let title = 'No questions found.';
        let text = 'Please change your options and try again.';
        showDialog(title, text);
      }
      displayQuestions();
    }).catch(e => {
      console.error(e);
    });
  }

  // validate question
  function addQuestionToArray(newQuestion) {
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

  // Grab all questions and loops through them, sending each to addListItem function.
  function displayQuestions() {
    // Grab all questions
    let allQuestions = getAll();
    let numOfQuestions = allQuestions.length;

    // Loop through each question in the round
    allQuestions.forEach((question, index) => {
      addListItem(question, index, numOfQuestions);
    });
  }

  // Create bullk of the cardd structure, event listeners for answer buttons, add shuffled answeer buttons.
  function addListItem(question, questionIndex, numOfQuestions) {
    let cardContainer = $('#card-container');

    // Combine the correct answer and incorrect answers into new array
    let possibleAnswers = question.incorrect_answers.slice();
    possibleAnswers.push(question.correct_answer);

    // Create elements for card structure.
    let cardRow = $('<div></div').addClass('row justify-content-center card-container__row')
    let card = $('<div></div>').addClass('card-container__card col-11 col-sm-10 col-md-8 col-lg-7 col-xl-5 my-3');
    let questionNumberClass = 'question-' + (questionIndex+1);
    let cardInner = $('<div></div>').addClass('card card-inner bg-light ' + questionNumberClass);
    let cardFront = $('<div></div>').addClass('card-front card-body bg-light');
    let cardHeader = $('<div></div>').addClass('card-header bg-warning mt-3');
    let cardHeaderTitle = $('<h4></h4>').addClass('card-title text-center').text(`Question ${questionIndex+1}:`);
    let cardHeaderText = $('<p></p>').addClass('card-text').text(question.question);
    let answerList = $('<div></div>').addClass('mt-4 answer-btns').attr('id', 'q-answers-'+(questionIndex+1));
    let cardBack = $('<div></div>').addClass('card-back card-body bg-light ' + questionNumberClass);
    let cardBackResult = $('<div></div>').addClass('mt-4');
    let cardBackAnswer = $('<p></p>').addClass('card-text card-result ' + questionNumberClass);
    let cardBackImg = $('<img>').addClass(questionNumberClass + ' result-img');

    // Attach event handler to the answerList element as a delegate.
    answerList.on('click', 'button', e => answerHandler(e, question, numOfQuestions, questionNumberClass));

    // Card Structure
    // cardRow
    //   card
    //     cardInner
    //       cardFront
    //         cardHeader
    //           cardHeaderTitle, cardHeaderText
    //         answerList
    //           answerButtons ...
    //       cardBack
    //          cardHeader
    //            cardHeaderTitle, cardHeaderText
    //          answerResponse // Created on click event when asnwer is selected
    cardHeader.append(cardHeaderTitle, cardHeaderText);
    cardFront.append(cardHeader.clone(), answerList);
    cardBackResult.append(cardBackAnswer, cardBackImg);
    cardBack.append(cardHeader.clone(), cardBackResult);
    cardInner.append(cardFront, cardBack);
    card.append(cardInner);
    cardRow.append(card);
    cardContainer.append(cardRow);

    // array to allow me to randomize order of answers
    let answerArr = [];

    possibleAnswers.forEach((possibleAnswers, answerIndex) => {
      let btnId = 'btn-' + questionIndex + '-' + answerIndex;
      let answerButton = $('<button></button>')
        .addClass('btn btn-outline-warning btn-block text-dark mt-3')
        .attr('id', btnId)
        .text(possibleAnswers)
        .val(answerIndex + 1);
      
        answerArr.push(answerButton);
    })

    shuffleArray(answerArr);

    answerArr.forEach(answerBtn => {
      answerList.append(answerBtn);
    })
  }

  // Called by event Listener, changes text and image on back of card based on answer. Flips over card.
  function answerHandler(e, question, numOfQuestions, questionNumberClass) {
    questionsAnswered++;
    let selectedAnswer = e.target.innerText;
    if(selectedAnswer === question.correct_answer) {
      score++
      $(`.card-result.${questionNumberClass}`).text(`The correct answer is: ${question.correct_answer}`);
      $(`img.${questionNumberClass}`)
        .attr({
          src: 'img/correct_icon.svg',
          alt: 'Your answer was correct!'
        });
    } else{
      $(`.card-result.${questionNumberClass}`).text(`The correct answer is: ${question.correct_answer}`);
      $(`img.${questionNumberClass}`)
        .attr({
          src: 'img/wrong_icon.svg',
          alt: 'Your answer was incorrect'
        });
    }

    if (questionsAnswered === numOfQuestions){
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

      setTimeout(() => {
        showDialog(title, text)
      }, 2000);
    }
    $('.card-inner.' + questionNumberClass).addClass('flip-over');
  }

  // Retrieve all questions for this round (Nothing fetched from API here)
  function getAll() {
    return triviaQuestions;
  }

  // ----------------------Modal and Dialog Modal-----------------------
  function showDialog(title, text) {
    $('.modal .modal-title').text(title);
    $('.modal .modal-body').text(text);
    $('#endOfRoundModal').modal('show');
  }

  // -----------------------Helper Functions--------------------------
  // Decode api response encoding
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

  // Compare array of new question object keys to template
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

  // Randomize array in-place using Durstenfeld shuffle algorithm
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }

  // Reset questions and score for next round
  function resetQuestions() {
    $('.card-container__row').remove();
    triviaQuestions = [];
    score = 0;
    questionsAnswered = 0;
  }


  // -----------return needed functions to outside IIFE---------------------------
  return {
    fetchCategories: fetchCategories,
    prepareQuestionRetrieval: prepareQuestionRetrieval,
    resetRound: resetQuestions
  };

})();

triviaSession.fetchCategories();

$('#startForm').on('submit', e => triviaSession.prepareQuestionRetrieval(e));
$('#playAgainButton').on('click', () => triviaSession.resetRound());