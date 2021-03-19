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
  function loadCategories() {
    let categoriesURL = 'https://opentdb.com/api_category.php';
    return $.ajax(categoriesURL, { dataType: 'json' }).then(responseJSON => {
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
    })
  }

  // Add all categories to categories dropdown on form.
  function populateCategoriesDropdown() {
    let dropdown = $('#categories');
    allCategories.forEach(item => {
      let listItem = $(`<option value="${item.id}">${item.name}</option>`);
      dropdown.append(listItem);
    });
  }

  // Retrieve all questions for this round (Nothing fetched from API here)
  function getAll() {
    return triviaQuestions;
  }

  return {
    loadCategories: loadCategories
  };

})();

triviaSession.loadCategories();