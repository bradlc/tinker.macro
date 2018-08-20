# tinker.macro

> Evaluate [Laravel](https://laravel.com/) code at build-time, via [Laravel Tinker](https://github.com/laravel/tinker)

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

There is also a convenient way to access `App\*` class methods and properties:

```js
import { Article } from 'tinker.macro'
let article = Article.where('id', 7).first()

// ↓ ↓ ↓ ↓ ↓ ↓ ↓

let article = {
  id: 7,
  title: 'Hello, world',
  body: 'Lorem ipsum dolor sit amet.'
  // etc.
}
```

This is the same as:

```js
import tinker from 'tinker.macro'
let articles = tinker`App\\Article::where('id', 7)->first()`
```

## More Examples

### [route](https://laravel.com/docs/5.6/helpers#method-route) function

```js
import tinker, { route } from 'tinker.macro'
// these are equivalent
let articleRoute1 = route('article', { id: 1 })
let articleRoute2 = tinker`route('article', ['id' => 1])`

// ↓ ↓ ↓ ↓ ↓ ↓ ↓

let articleRoute1 = 'http://localhost/article/1'
let articleRoute2 = 'http://localhost/article/1'
```

### Retrieving a list of [named routes](https://laravel.com/docs/5.6/routing#named-routes)

```js
import tinker from 'tinker.macro'

let routes = tinker`
  $routes = [];
  foreach (app()->routes->getRoutes() as $route) {
    $name = $route->getName();
    if ($name !== null) {
      $uri = $route->uri;
      $routes[$name] = ($uri === '/' ? '' : '/') . $uri;
    }
  }
  $routes;
`

// ↓ ↓ ↓ ↓ ↓ ↓ ↓

let routes = {
  home: '/',
  blog: '/blog',
  post: '/blog/{slug}'
}
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
