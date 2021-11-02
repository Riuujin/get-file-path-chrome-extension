var gulp = require('gulp');
var gulpIgnore = require('gulp-ignore');
var config = require('../config').copy;

gulp.task('copy', function (callback) {
    var queue = config.sets.length;

    var copySet = function (set) {
        var copy = function () {
            var stream = gulp.src(set.src);

            for (var i in set.exclude) {
                stream = stream.pipe(gulpIgnore.exclude(set.exclude[i]))
            }

            return stream.pipe(gulp.dest(set.dest))
                 .on('end', reportFinished);
        };

        var reportFinished = function () {
            if (queue) {
                queue--;
                if (queue === 0) {
                    callback();
                }
            }
        };

        return copy();
    };

    //Copy each set.
    config.sets.forEach(copySet);
});