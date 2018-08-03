# tinker.macro

> Evaluate [Laravel Tinker](https://github.com/laravel/tinker) expressions at build-time

## Installation

Install [`babel-plugin-macros`](https://github.com/kentcdodds/babel-plugin-macros) (along with `tinker.macro`) and add it to your babel config:

```
npm install --save-dev babel-plugin-macros tinker.macro
```

**.babelrc**:

```json
{
  "plugins": ["macros"]
}
```

That’s it!

## Basic Usage

```js
import tinker from 'tinker.macro'
let isDebug = tinker`config('app.debug')`

// ↓ ↓ ↓ ↓ ↓ ↓ ↓

let isDebug = true
```

If you are executing a single function call you can import the function like this:

```js
import { config } from 'tinker.macro'
let isDebug = config('app.debug')

// ↓ ↓ ↓ ↓ ↓ ↓ ↓

let isDebug = true
```

## More Examples

```js
import tinker, { route } from 'tinker.macro'
// these are equivalent
let articleRoute1 = route('article', { id: 1 })
let articleRoute2 = tinker`route('article', ['id' => 1])`

// ↓ ↓ ↓ ↓ ↓ ↓ ↓

let articleRoute1 = 'http://localhost/article/1'
let articleRoute2 = 'http://localhost/article/1'
```

## Re-evaluating on change

If you are using webpack you can ensure that expressions are re-evaluated when updating your Laravel app. Add the loader – `tinker.macro/webpack` – to your webpack configuration, like so:

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'tinker.macro/webpack'
      }
      // ...
    ]
  }
  // ...
}
```
