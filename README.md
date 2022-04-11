# WORDFINDER

## Site Overview
Wordfinder is a word-based game, where a user must find as many 4+ letter words in multiple sets of seven or eight randomly generated letters against the clock as they can. With the option of numerous different game settings, each providing its own stored and displayed best score for a user, the game is varied and long-lasting with regard to its enjoyment and playability. The target audience for this game is most broadly anyone who enjoys word-based games, of which there are many. 

![am i responsive screenshot](docs/screenshots/am_i_responsive_screenshot.png)

## Design Process
This section details the stages of the design process followed during the development of the site.

### Strategy

#### User Stories
- As a player of word-based games, I prefer the game to be fairly intuitive, with instructions clear, concise and easy to access at any point during the game.
- As a player of online games, I like to be able to play the game on both mobile, tablet and desktop, without significant disruption to how the game looks and feels, or the mechanism by which I play it. I also prefer to not have to scroll, so that I can view the instructions, game setup and playing areas all at once, thus remaining fully immersed in the game itself.
- As a fan of browser-based games including word games, I always want simple playing controls. Additionally I want the game related buttons to make it effortless to start and quit the game, as well as change any settings.
- As a player of word-based games I like there to be feedback that not only provides the information I need, but does so in an appealing fashion.  I also like to have game sounds as part of this feedback which makes it fun to play; although I want to be able to easily disable/enable the sounds when desired.
- As a fan of word games, I like there to be a moderate degree of variability in a game, with multiple game modes that change the difficulty of the game, as well as how long it takes to complete: often I may only want a short game as I only have a small amount of time.
- As someone who plays word games, I like there to be information displayed during a game and at the end of a game summarising my performance, particularly if I am trying to achieve some target against the clock, where knowing what my current score is and how much time I have left simultaneously, is a necessity for it to be worthwhile.
- As a competitive gamer, I want any single player game, to have some kind of metric of my performance that allows me to indirectly compete with other players.

#### Site Owner Story
The goal is to produce a word-based game that is entertaining to the user, and of sufficient variability as to not become too repetitive and dull.  As well as being entertaining, the game should also provide a form of mental stimulation akin to brain training games, in that it challenges the user to focus and search for words in sets of random letters, whilst under time pressure. Finally the game should have a competitive component, whereby users can compare their performance with other users.

### Scope

#### Site key functions and content:
In order to meet the goal of the site owner, as well as satisfy the potential users, the site-hosted word game will minimally require the following functions and content:
- It should be fully responsive and or adaptive to all types of device, in a way that removes any need for page scrolling and maintains a consistent appearance
- An easy-to-access and concise set of game instructions
- An easy-to-access and modify set of game settings, providing multiple game mode options
- Have game mechanics that prevent it being repetitive, with every game being different
- Provide appealing feedback to a player during and at the end of a game
- Include sound effects, that can be disabled and enabled at the discretion of the player
- Provide a straightforward game interface/game controls to play the game, that are fairly intuitive so that minimal instructions are needed.
- Have a displayed game timer 
- Display and produce various metrics that give a player useful information during a game for the purpose of achieving a target such as a new best score
- Have a competitive metric such as the best score for each different game mode, that can be stored and updated locally for every player

### Structure/Skeleton

A reasonably minimalistic and compact design is preferred in order to make the game appealing and simple, whilst minimising any distractions from the main gameplay area. The page 
is to be sized and styled responsively such that for as many device sizes as possible, in both landscape and portrait orientation, there is zero need for vertical scrolling. The potential trade-off being ease of legibility and or ease of interaction with the interactive elements. There will be no footer or navigation element as they are unnecessary, since there is no footer content, and only one page on the site. There will be a header containing a title and a game description.

The main section of the page is to be divided into two, first a game preamble section, and then a main game area section. The preamble section is to be further divided into a how to play section, and a game settings section. Each section will contain a window that can be opened and closed using buttons, thus decluttering the page and saving vertical space. The vertical order of each preamble section is the order in which they will naturally be used by a user. The how to play section will feature a game instructions button that will allow the user to view the game instructions situated on the how to play window; on first loading the page this window will initially be opened, in part to make the instructions easy to view to users who naturally will want to read the instructions before playing, but also to encourage users who tend not to read them first, to at least give them a cursory glance so as to avoid later user confusion and thus frustration when attempting to play the game.

The game settings section will feature a game settings button that opens the game settings window. The window will include a timer, letter mode, and sound mode set of inputs to allow the user to easily change the game mode and enable or disable game sounds. In order to avoid giving the user an unpleasant surprise, the sound mode 'off' input will be checked by default.

The main game area section will contain a start button, followed by three flex item sections arranged vertically in portrait orientations, and horizontally in landscape orientations. The central section will be the gameplay area, where the letter tiles of the game will be located, as well as a range of buttons needed to play the game. The outer sections will contain either the game timer and other game buttons or the game scores.

[Landscape wireframe.](docs/wordfinder_wireframe.png)


