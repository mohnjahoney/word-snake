# Word Snake — MVP Specification

## Concept

A game where the player moves a snake through a field of letter tiles, collecting letters to form words and earn points.

## MVP Goal

Test whether combining snake movement with word formation feels engaging and understandable.

## Core Gameplay

- The board is a square grid of circular letter tiles.
- The player controls a snake using arrow keys or WASD.
- The snake moves one grid space at a time.
- The snake collects letters as it moves over them.
- The current collected letters are displayed clearly.
- Valid words are detected from the collected sequence.
- Longer words score more points.
- The game ends when the player hits the boundary, depending on the selected mode.

## Experimental Modes

The MVP should support two switchable snake behaviors:

1. **Sliding window**  
   The snake has a fixed maximum length. New letters enter at the front while older letters leave from the back.

2. **Accumulating body**  
   The snake grows as it collects letters. Players can clear valid words from within the collected sequence.

Word handling should also be configurable:

- Automatic recognition and scoring
- Player-confirmed word clearing

## Visual Requirements

- Clear grid and readable letters
- Circular letter tiles
- Semi-transparent or visibly connected snake body
- Strong feedback when a word is detected
- Visible score and current letter sequence
- Simple animations for movement, scoring, and clearing

## Input

- Keyboard movement is required.
- Touch controls are optional for the first MVP.
- Voice input is not required for the initial MVP, but word confirmation should be designed so voice input could be added later.

## Technical Direction

- Use Vite with TypeScript.
- Use Canvas 2D for the game board, snake, tiles, and animations.
- React is optional and should be limited to surrounding interface elements such as menus, score displays, and settings.
- Keep game state and the game loop independent from React rendering.
- Do not introduce Phaser for the MVP; reassess the need for a game framework after the core gameplay has been tested.

## Out of Scope

- Multiplayer
- Accounts or progression systems
- Elaborate levels
- Online leaderboards
- Advanced power-ups
- Final art direction
- Production-quality dictionary coverage

## MVP Success Criteria

The prototype is successful if a player can quickly understand:

1. Where the snake can move
2. Which letters they are collecting
3. When they have formed a word
4. How words affect their score or snake body
5. Whether they want to keep playing
