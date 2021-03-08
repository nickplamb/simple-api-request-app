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
  let questionObjectKeys = ['catagory', 'question', 'possibleAnswers', 'correctAnswer']

  // Retrieve all Questions for this round.
  function getAll() {
    return triviaQuestions;
  }
  // Add a new questions to this round.
  function add(newQuestion) {
    if (typeof newQuestion === 'object') {
      if (compareArrays(Object.keys(newQuestion), questionObjectKeys)) {
        triviaQuestions.push(newQuestion);
      } else {
        console.error('Object does not have all required properties');
      }
    } else {
      console.error('Not an object')
    }
  }

  // Function to compare the array of keys in new question to array to required keys
  function compareArrays(arr1, arr2) {
    // Compare lengths
    if (arr1.length !== arr2.length) {
      return false;
    }
    // Compare keys one by one.
    for (let i = 0; i < arr2.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    // All passes?
    return true;
  }

  // Return object with call to getAll and add functions
  return {
    add: add,
    getAll: getAll
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

// Begin the round of trivia
document.write('<main><section class="card-container"><h2>Round 1</h2>');

// Loop through each question in the round
triviaRound.getAll().forEach((question, index) => {
  document.write('<div class="card-container__card"');

  // Display the question in an h3 tag
  document.write(`<h3>Question ${index +1}:</h3>`);
  document.write(`<p>${question.question}</p>`);

  // Display list of possible questions
  document.write('<p>Possible answers:</p>');
  document.write('<ul>');

  // Loop through and display each possible answer
  question.possibleAnswers.forEach((possibleAnswer, index) => {

    // Highlight to the correct answer using correctAnswer class with css. Just because it was not easy enough.
    if (possibleAnswer === question.correctAnswer) {
      document.write(`<li><input type="button" class="btn-answer btn-correctAnswer" value="${index + 1}: ${possibleAnswer}"></li>`);
    } else {
      document.write(`<li><input type="button" class="btn-answer" value="${index + 1}: ${possibleAnswer}"></li>`);
    }
  });
  document.write('</ul></div>');
});
document.write('</section></main>')




// // Doesnt work yet.  question.correctAnswer is out of scope.
// function loopThroughPossibleAnswers(possibleAnswer, index) {
//   // Highlight to the correct answer using correctAnswer class with css. Just because it was not easy enough.
//   if (possibleAnswer === question.correctAnswer) {
//     document.write(`<li><input type="button" class="btn-answer btn-correctAnswer" value="${index + 1}: ${possibleAnswer}"></li>`);
//   } else {
//     document.write(`<li><input type="button" class="btn-answer" value="${index + 1}: ${possibleAnswer}"></li>`);
//   }
// }