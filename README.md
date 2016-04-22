# Webpack Study

Trying to figure out how to use Webpack to transition Lendr from using RequireJS
+ Grunt + BrowserSync.  

## Running Study Page using Webpack Development Server
On your terminal/console, enter `npm run run-server` to start the webpack
   development server.

## The State of FE Development in Lendr

### The Asset Pipeline
Lendr relies on Grunt to perform the following tasks:
  * JS bundling (via r.js) and minification.
  * sass to css compilation
  * HTML (with partials) to HTML compilation using `grunt-processhtml`
  * Spinning-off development web server using `grunt-browser-sync`

### Dependency management

Lendr is currently using RequireJS for dependency management.

All was fine and dandy with our setup until project requirements forced a fork
of the original codebase to create a lighter version of Lendr (which we will call LendrFett from here).
Maintaining two almost identical codebases with shared assets is an obvious headache that needed
immediate attention so the team needed to centralize the code for these shared assets.

The solution was to export the shared JS and CSS to as node modules. This was a
no-brainer for CSS as its not reliant on any dependency management system. Doing
for our shared JS, however, was a wholly different beast.

Having completed the modularized library for the shared JS between Lendr and LendrFett,
we wanted to leverage `npm update` to automatically handle updated to the shared library,
instead of manually copy-pasting updated JS to the project directory. In order to
do this, changes were needed to the requirejs `baseUrl` config in the Gruntfile as well
as in each page's `main.js` so the `node_modules` folder can be accessed.

From:
```
options: {
  baseUrl: './src/assets/js/',
  /**
    config  below
  */
}
```

To:

```
options: {
  baseUrl: '.',
  /**
    more config
  */
}
```

While doing this enabled the team to use our shared JS library, we had to
modify all module paths since RequireJS doesn't support path aliasing.

From:
```
define( ['register/api', 'register/models/RegisterAPIModel'], ...);
```
To

```
define( ['src/assets/register/api', 'src/assets/js/register/models/RegisterAPIModel'], ...)
```

While this works, I'm of the opinion that modules - as much as possible - don't
need to know what the project file structure is outside their own page's directory.
To further illustrate my point, we encountered this when we needed to refer to our
shared JS:

```
  var LendrCore = require('node_modules/lendr-js-core/lendr.min');
```
Obviously, this could be cleaner. This became the impetus for (trying) to transition
the current build system to Webpack.

## Enter Webpack

Referring to the previous snippet, using Webpack enables the team to require
the shared JS like so `require('lendr-js-core/lendr.min')`
