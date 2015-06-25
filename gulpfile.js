var gulp            = require('gulp'),
    plugins         = require('gulp-load-plugins')({ lazy: false }),
    glob            = require('glob'),
    handlebars      = require('handlebars'),
    fs              = require('fs'),
    path            = require('path'),
    del             = require('del'),
    gulpHandlebars  = require('gulp-handlebars-html')(handlebars)
    nib             = require('nib'),

    config = {
      src:          "./src",
      templatesDir: "./src/templates",
      partialsDir:  "./src/templates/partials",
      stylesDir:    "./src/styles",
      styleFile:    "app.styl",
      tmp:          "./tmp",
      configDir:    "./config",
      build:        "./build"
    },
    vendorCss       = JSON.parse(fs.readFileSync(path.join(config.configDir, 'vendorcss.json')));
    templateData    = JSON.parse(fs.readFileSync(path.join(config.src, 'data.json')));

console.log("Plugins loaded: " + JSON.stringify(Object.keys(plugins)));

// Cleaners
gulp.task('clean', function(cb) {
  del.sync([config.tmp, config.build], cb);
});

// Compiling
gulp.task('build:templates', function() {

  var options = {
    partialsDirectory: config.partialsDir,
    allowedExtensions: ['hbs']
  };

  var dirs = [];
  dirs.push(config.templatesDir + "/*.hbs");

  return gulp.src(dirs)
    .pipe(gulpHandlebars(templateData, options))
    .pipe(plugins.rename({
      extname: ".html"
    }))
    .pipe(gulp.dest(config.build))
    .pipe(plugins.connect.reload());
});


// Compiles all user stylus files and places in a tmp directory
gulp.task('compile:styles', function() {
  return gulp.src(path.join(config.stylesDir, config.styleFile))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus({
      compress: false,
      linenos:  false,
      use:      nib()
    }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(config.tmp + '/styles'))
});

// Combines the user styles with the semantic-ui lib styles
gulp.task('build:styles', ['compile:styles'], function() {
  return gulp.src(vendorCss.concat(config.tmp + '/styles/app.css'))
    .pipe(plugins.concat('app.css'))
    .pipe(gulp.dest(config.build + "/styles"))
});

// Server
var serveTasks = [
  'startServer',
  'watch'
];

var buildTasks = [
  'build:templates',
  'build:styles'
];

gulp.task('startServer', function(next){
  plugins.connect.server({
    root:       config.build,
    livereload: true,
    port:       4200
  })
});

gulp.task('watch', function(){
  gulp.watch(config.src + '/**/*', buildTasks);
});

gulp.task('serve', buildTasks.concat(serveTasks));
gulp.task('default',['clean','serve']);