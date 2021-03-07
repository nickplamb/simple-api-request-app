triviaRound = [
  {
    questionNumber: 1,
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
    questionNumber: 2,
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
    questionNumber: 3,
    catagory: 'Art',
    question: 'Rembrandt painted "Starry Night".',
    possibleAnswers: [
      'True',
      'False'
    ],
    correctAnswer: 'False'
  }
];
// Begin the round of trivia

document.write('<main><section class="card-container"><h2>Round 1</h2>')

// Loop through each question in the round
for (let i = 0; i < triviaRound.length; i++) {
  // Initialize variable with question for cleaner code
  const question = triviaRound[i];
  document.write('<div class="card-container__card"')
  // Display the question in an h2 tag
  document.write(`<h3>Question ${question.questionNumber}:</h3>`);
  document.write(`<p>${question.question}</p>`);

  // Display list of possible questions
  document.write('<p>Possible answers:</p>');
  document.write('<ul>');

  // Loop through and display each possible answer
  for (let x = 0; x < question.possibleAnswers.length; x++) {
    const possibleAnswer = question.possibleAnswers[x];

    // Highlight to the correct answer using correctAnswer class with css. Just because it was not easy enough.
    if (possibleAnswer === question.correctAnswer) {
      document.write(`<li><input type="button" class="btn-answer btn-correctAnswer" value="${x + 1}: ${possibleAnswer}"></li>`)
    } else {
      document.write(`<li><input type="button" class="btn-answer" value="${x + 1}: ${possibleAnswer}"></li>`);
    }
  }
  document.write('</ul></div>');
}
document.write('</section></main>')