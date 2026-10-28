# Godobot 🤖🐟

Have you ever found yourself ditched by a friend and ended up in a CEDH 3-pod? 😭

Do you have a smartass in your pod who claims that it's easy to beat Dack Fayden with "just keep removal"? 🤡

Godobot solves both of these problems. Just put it on the empty seat and watch it speedrun its way to an uninteractable win line. 🏎️💨

Godobot is just playing Dack Fayden to the 95% of the top pilots capacity. 😎
Work is in progress but the basic specs is:
- goldfishes the preprogrammed Dack Fayden list
- lets you counter its spells and remove its board (it's futile 💀)
- offline browser app 🌐

## Status

Early work in progress. The game engine is a pure TypeScript reducer
`(state, action) => newState` with a seeded RNG, so games are reproducible and testable.
The planner and the UI are not built yet.

## Development

    npm install
    npm run dev     # start the dev server
    npm test        # run the engine tests
    npm run build   # type-check and build

## More

- [docs/requirements.md](docs/requirements.md): full spec
- [docs/progress.md](docs/progress.md): what is done and what is next
