# Trivia App

This is a fairly simple trivia app using the [Open Trivia DB](https://opentdb.com/) API.

## App Description

The app loads questions categories from the API on load and then requests and displays questions on cards. The cards turn over once an answer is selected and will be displayed along with an image indicating a correct or incorrect selection. Once all questions are answered, a modal is displayed to inform the user of their score and offer to reset the round or be dismissed to allow for review.

## Concepts learned

- The IIFE used as part of a Revealing Module Pattern
- API requests and ajax.
- Asynchronous functions and Promises
- DOM maniputlation with JS and jQuery
- Event Listeners and Handlers
- Bootsrap basics
- More advanced CSS techniques
- Character Encoding

## Technologies

The version on the main branch is built in vanilla `JS`, `HTML`, and `CSS`. It is hosted at [trivia.nickplamb.com](http://trivia.nickplamb.com).

The version on the bootstrap_conversion branch is built with `jQuery`, `Bootstrap`, `HTML`, and `CSS`. It is hosted at [nickplamb.github.io/trivia-app/](https://nickplamb.github.io/trivia-app/)

## Future Development

- [ ] Implement Session Token
  - API allows a session token to be used in order to prevent repeat questions from being sent.
- [ ] Snarky Responses
  - Randomly display a snarky response on the back of each card after a user selects and answer.
- [ ] Refactor vanilla js version
  - Create the bulk of the back of card elements on card creation to simplify event handling.
- [ ] Clean up appearance
  - Work on improving the design and color scheme of the app.
  - Fix card header issue in Bootstrap Version.
- [ ] Display question cards one at a time in a carousel
- [ ] Implement templates
  - Use a template system to create the question cards instead of creating dynamically.
- [ ] Implement back-end with login and score keeping capabilities
