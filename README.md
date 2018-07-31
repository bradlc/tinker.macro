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