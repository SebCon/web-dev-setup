'use strict';

/***************************************************************************************************************
 * 
 *  Requirements
 * 
 **************************************************************************************************************/
var gulp = require('gulp');
var reporter = require('gulp-reporter');
var minifyjs = require('gulp-js-minify');
var jslint = require('gulp-jslint');
var jsdoc = require('gulp-jsdoc3');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var minifyHTML = require('gulp-minify-html');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var csslint = require('gulp-csslint');
var htmlLint = require('gulp-html-lint');
var htmlhint = require("gulp-htmlhint");
var pug = require('gulp-pug');
var inject = require('gulp-inject');
var image = require('gulp-image');
var webserver = require('gulp-webserver');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var del = require('del');

var cssFileName = 'bundle.css';

/***************************************************************************************************************
 * 
 *  PATHES
 * 
 **************************************************************************************************************/
var paths = {
  app : 'app/',
  html: 'app/html/**/*.html',
  htmlOut : 'dist/html/',
  index : 'app/index.html',
  indexOut : 'dist/',
  image : "app/**/*",
  imageOut : "dist/image/",
  css : 'app/css/**/*.css',
  cssOut : 'dist/css/',
  sass : 'app/css/sass/**/*.scss',
  sassOut : 'app/css/sass/out/',
  typescripts : 'app/lib/**/*.ts',
  typescriptsOut : 'app/js/',
  scripts : 'app/js/**/*.js',
  scriptsOut : 'dist/js/',
  views : 'app/views/**/*.pug',
  viewsOut : 'app/html/views/',
  docs : 'app/js/**/*.js',
  docsOut : 'docs/',
  serverRoot : './',
  maps : '.',
  dist: 'dist/'
};


/***************************************************************************************************************
 * 
 *  CLEAN Task
 * 
 **************************************************************************************************************/

 gulp.task('clean', function () {
  return del([
    paths.dist,
    paths.docsOut, 
    paths.scripts,
    paths.viewsOut + '**/*.html',
    paths.sassOut + '**/*'
  ]);
});


/***************************************************************************************************************
 * 
 *  VIEWS, PAGES; PUG Task
 * 
 **************************************************************************************************************/

function views() {
  return gulp.src(paths.views)
    .pipe(pug())
    .pipe(gulp.dest(paths.viewsOut));
}

function viewsWatch() {
  console.log('watch views');
  return gulp.watch([
    paths.views
  ], views)
}

gulp.task('views', views);
gulp.task('views:watch', viewsWatch);


function pages() {
  return gulp.src(paths.html)
    .pipe(htmlLint())
    .pipe(htmlhint())
    .pipe(minifyHTML({ comments:true, spare:true }))
    .pipe(gulp.dest(paths.htmlOut));
}

function indexPage() {
  return gulp.src(paths.index)
    .pipe(htmlLint())
    .pipe(htmlhint())
    .pipe(minifyHTML({ comments:true, spare:true }))
    .pipe(gulp.dest(paths.indexOut));
}

function pagesWatch() {
  console.log('watch html');
  return gulp.watch([
    paths.html
  ], views)
}

gulp.task('pages', function() {
  pages();
  indexPage();
});
gulp.task('pages:watch', pagesWatch);


/***************************************************************************************************************
 * 
 *  IMAGE Task
 * 
 **************************************************************************************************************/

function image() {
  return gulp.src(paths.image)
    .pipe(image())
    .pipe(gulp.dest(paths.imageOut));
}

function imageWatch() {
  console.log('watch images');
  return gulp.watch([
    paths.image
  ], image)
}

gulp.task('images', image);
gulp.task('images:watch', imageWatch);



/***************************************************************************************************************
 * 
 *  CSS, SASS Task
 * 
 **************************************************************************************************************/

// Set the browser that you want to support
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

function stylesSass() {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())
    // Compile SASS files
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    // Minify the file
    .pipe(csso({
      restructure: false,
      sourceMap: true,
      debug: true
    }))
    .pipe(sourcemaps.write(paths.maps))
    // Output
    .pipe(gulp.dest(paths.sassOut))
}

function stylesCss() {
  return gulp.src(paths.css)
    .pipe(concatCss(cssFileName))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(csslint())
    .pipe(gulp.dest(paths.cssOut));
}

function styleWatch() {
  console.log('watch styles');
  return gulp.watch([
    paths.sass,
    paths.css
  ], function() {
    stylesSass();
    stylesCss();
  });
}

gulp.task('styles-sass', stylesSass);
gulp.task('styles-css', stylesCss);
gulp.task('styles:watch', function() {
  stylesSass();
  stylesCss();
});


/***************************************************************************************************************
 * 
 *  TYPESCRIPT, JAVASCRIPT Task
 * 
 **************************************************************************************************************/
var tsProject = ts.createProject({
    declaration: true
});

function compileTypeScript() {
  console.log('compile Typescript');
  return gulp.src(paths.typescripts)
    .pipe(tsProject())
    .pipe(gulp.dest(paths.typescriptsOut));
}

function jsLint() {
  return gulp.src(paths.scripts)
    .pipe(jslint())
    .pipe(reporter({}));
}

function jsMinify() {
  console.log('minify js');
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(minifyjs())
    .pipe(sourcemaps.write(paths.maps))
    .pipe(gulp.dest(paths.scriptsOut));
}

function jsWatch() {
  console.log('watch js');
  return gulp.watch([
    paths.typescripts,
    paths.scripts
  ], runSequence('js:typescript',  'js:jsLint', 'js:jsMinify'));
}

gulp.task('js:typescript', compileTypeScript);
gulp.task('js:jsLint', jsLint);
gulp.task('js:jsMinify', jsMinify);

gulp.task('js', ()=> {
  console.log('running js');
  runSequence('js:typescript',  'js:jsLint', 'js:jsMinify');
});

gulp.task('js:watch', jsWatch);

/***************************************************************************************************************
 * 
 *  DOCUMENTATION Task
 * 
 **************************************************************************************************************/

 function jsDoc() {
   return gulp.src(paths.docs, {read: false})
   .pipe(jsdoc())
   .pipe(gulp.dest(paths.docsOut));
 }

 gulp.task('js-doc', jsDoc);


 /***************************************************************************************************************
 * 
 *  MAPS Task
 * 
 **************************************************************************************************************/

function jsMap() {
  return gulp.src(paths.app + '**/*.map')
  .pipe(gulp.dest(paths.dist + 'maps'));
}

gulp.task('js-map', jsMap);

/***************************************************************************************************************
 * 
 *  INDEX Task
 * 
 **************************************************************************************************************/

function createIndex() {
  var target = gulp.src(paths.app + 'index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src([paths.scriptsOut + '**/*.js', paths.cssOut + '**/*.css'], {read: false});
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest(paths.dist + 'index.html'));
}


gulp.task('index', createIndex);


/***************************************************************************************************************
 * 
 *  SERVER Task
 * 
 **************************************************************************************************************/

function server() {
  return gulp.src(paths.serverRoot)
    .pipe(webserver({
      livereload: false,
      host: '0.0.0.0',
      port: 8100,
      open: 'dist'
    }));
}

gulp.task('webserver', server);

/***************************************************************************************************************
 * 
 *  STARTING
 * 
 **************************************************************************************************************/
gulp.task('watch', function() {
  runSequence('styles:watch', 'views:watch', 'pages:watch', 'images:watch', 'js:watch');
});


gulp.task('default', ['clean'], function () {
    runSequence('styles-sass', 'styles-css', 'views', 'pages', 'js', 'js-doc', 'index', 'webserver', 'watch');
});
