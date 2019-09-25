# mockdown-client

## What is this?

A JavaScript module (written in TypeScript) for interfacing with the mockdown
server interface, plus some utilities for working with constraints
as well as Cassowary (`kiwi.js`).

## How do I install it?

First, compile it:

> npm run build

Then link it:

> yarn link

And finally, in any project you want to use your copy of this package:

> yarn link mockdown-client

(Instructions are more or less the same if you use `npm link`.)

## How do I use it?

### How do I get some constraints for my examples?

If you have examples such as:

```typescript
const examples = [
    {
        "name": "p",
        "rect": [0, 0, 100, 100],
        "children": [/*...*/]
    },
    // ...
]
```

Then you can just:

```typescript
import {fetchConstraints} from 'mockdown-client';

// If you live in the future:
const constraints = await fetchConstraints(examples);

// And if you don't, then:
fetchConstraints(examples).then((constraints) => {
    // ...
});
```