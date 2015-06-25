## HTML Starter

A simple setup to start building out HTML with handlebars, stylus and semantic-ui.

### To install

Make sure that you have Gulp installed globally:

```
$ npm install -g gulp
```

Then to install the deps:

```
// This will also install bower dependencies
$ npm install
```

Then to run:

```
$ gulp
```

## Folders

```
./config
```

This folder is for build process configuration. As of this writing, there is only a vendorcss.json which contains the array of semantic-ui components we are going to be using.

```
./src
```

This is where all of your work will be done

```
./src/styles
```

This is where all of the stylus sheets are. If you create a new folder, be sure to import it in the app.styl

```stylus
@import 'my/new/folder/**'
```

```
./src/templates
```

This is where your handlebars templates go. There is a folder called partials which should contain all of your repeated elements (partials). Any file in the top level templates folder will be compiled to a standalone HTML file

```
./build
```

Your compiled, ready-to-go templates.