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

↓ ↓ ↓ ↓ ↓ ↓ ↓

let isDebug = true
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
