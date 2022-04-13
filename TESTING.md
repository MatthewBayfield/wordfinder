# Testing
Testing was performed throughout the development of the site. The testing can be broken down into several categories, namely manual testing, user testing, and testing using tools, including validation tools.

## Manual testing
This was performed by myself, and primarily involved using the devtools of different browsers. For the HTML and CSS content, I would test how each change made or content added displayed, to check things were as desired, including using the responsive mode of the devtools to test how the page displayed across a range of screen sizes in both orientations. For the JavaScript content which of course is responsible for the interactivity of the page as well as the game mechanics, I would use the debugger and console output to assess whether JS functions etc were performing as expected, as well as to figure out either why errors were occurring, or why elements of the game were not functioning as expected. Additionally I would regularly test all buttons, inputs and game interface controls, often by just playing the game, and in part trying to break it. I also tested the error handling of my JS code and the feedback provided to the user, by artificially creating errors.

I have also tested the site on desktop, laptop, tablet and mobile devices, using many of the most common browsers including Mozilla Firefox, chrome, Samsung internet, safari, Microsoft edge, opera and brave.

### Manual testing detected issues
Here are some of the more prominent issues/bugs that were discovered using manual testing, and their fixes:
- When using the console in the devtools to assess the randomly selected starting words, returned by the random word selector functions, it was apparent that some words included non-standard alphabet characters, including spaces. To fix this a 'valid characters' boolean built using the array every method, with the test function being the inclusion of every character of a selected word in the standard alphabet, was used to filter out any words that had been used before, or that contained mentioned invalid characters.
- Whilst checking the browser display of the sweetalert2 alerts, it was noticed they were not displaying as expected. Inspection of the applied styles to the alerts using the devtools, revealed that some of my CSS style declarations were overriding the library styles. This was fixed using the built-in Swal alert customClass object property, along with declaring with the important declaration, additional alert CSS rules in my stylesheet.
- After adding a fetch request as part of a function in my JS code, I inspected the site in the browser, to discover an HTTP error had occurred. Using the devtools debugger, it was obvious that I had accidentally deleted a query separator in the URL used for the fetch request. Thus adding it resolved the error.
- When playing the game, a bug was noticed when either the start/quit button or next word button were clicked successively at a rapid enough rate; effectively two click events, and the actions they triggered, would overlap, such that before the 1st event had finished, the second would start, causing 2 or even 3 times the number of letter tiles to appear. This was fixed by making the event listener called functions asynchronous, so that by using the 'await' keyword, as well as temporarily disabling the buttons until an event had finished, the bug was no longer possible.
- Again when playing the game, it was discovered that it was possible to place more than one letter tile inside a tile holder, with the first letter being replaced, and both letter tiles being removed, leading to the loss of a letter tile. This multiple occupancy issue was fixed by modifying the tile holder event listener called function, so that nothing would happen if it already contained a letter tile.
- During a game if a user played their first game with the no timer option checked, the timer=setInterval() method, as part of the start button event listener function, was not declared, and so when clicking the quit button the clearInterval(timer) method, as part of the quit button event listener callback function, was undefined leading to an error. This was fixed by assigning the timer variable a setInterval method with a callback function that does nothing, when the no timer option is checked.

## User testing
Test users of the site were used throughout its development. They provided feedback as to whether the site displayed correctly on their devices, its appearance, and finally how well the game worked, and improvements they would like to see made.

### Examples of user feedback
- During the early development of the site, the game settings were always visible, without the use of a separate window accessed through a button. One test user commented that this made the site too cluttered, and recommended displaying them similarly to how the game instructions were displayed, namely via an open and closable popup window. This recommendation was implemented.
- Another user said thy would prefer a different alert for submitted words that were less than 4 letters, than the generic invalid word alert; as this could confuse a user who may have forgotten that submitted words must be at least 4+ letters, and so if they entered a valid 3-letter word, they would not understand why the word is invalid. This feedback is what led to the creation of a 'word too short' alert.

## Use of HTML, CSS and JS validators

### HTML and CSS validators
The current site passes the [w3 HTML validator](https://validator.w3.org/nu/), and the [w3 CSS validator](https://jigsaw.w3.org/css-validator/) with no errors or warnings.

#### Resolved issues raised by the HTML and CSS validators
- The HTML validator indicated that a space between the game instructions button element attributes was missing; so one was added.

### JS validator
The current site passes the [JSHint validator](https://jshint.com/) with only minor insignificant warnings: warnings around the use of async functions, variable keywords, and template literals, with regard to them being only available in certain more modern versions of JS; however the ['can I use site'](https://caniuse.com/) and browser testing suggests such things are widely supported. The only other warnings are about functions declared within loops referencing outer scoped variables; but this as intended and causes no apparent issues.

#### Resolved issues raised by the JSHint validator
- Warnings were raised about missing semi-colons, which were subsequently added.
- Missing variable keywords such 'let' and 'const', which were added.
- Misspelt variables, or unintended variations in variable names causing reference errors; these were easily fixed by making spelling corrections.
- A confusing use of the negation operator, where !(x===y) was used as opposed to (x!==y); this was changed to resolve the warning.
