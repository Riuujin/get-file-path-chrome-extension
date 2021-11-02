var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var gulpIgnore = require('gulp-ignore');
var sass = require('gulp-sass');
var config = require('../config').scss;

gulp.task('scss', function(callback) {
  var queue = config.sets.length;

  var sassSet = function(set) {
    var sassCompile = function() {
      var stream = gulp.src(set.src);

      for (var i in set.exclude) {
        stream = stream.pipe(gulpIgnore.exclude(set.exclude[i]))
      }

      if (config.debug) {
        stream = stream.pipe(sourcemaps.init());
      }

      stream = stream.pipe(sass());

      if (config.debug) {
        stream = stream.pipe(sourcemaps.write());
      }

      return stream.pipe(gulp.dest(set.dest))
        .on('end', reportFinished);
    };

    var reportFinished = function() {
      if (queue) {
        queue--;
        if (queue === 0) {
          callback();
        }
      }
    };

    return sassCompile();
  };

  //Sass compile each set.
  config.sets.forEach(sassSet);
});