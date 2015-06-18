var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var config = require('../config').browserify;
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

//var watchify = require('watchify');
//var bundleLogger = require('../util/bundleLogger');
//var handleErrors = require('../util/handleErrors');

gulp.task('browserify', function (callback) {
    var bundleQueue = config.bundleConfigs.length;

    var browserifyThis = function (bundleConfig) {
        var bundler = browserify({
            // Required watchify args
            // cache: {}, packageCache: {}, fullPaths: false,
            // Specify the entry point of your app
            entries: bundleConfig.entries,
            // Add file extentions to make optional in your requires
            extensions: bundleConfig.extensions,
            // Enable source maps!
            debug: config.debug,
            //Enable react
            transform: [reactify]
        });

        var bundle = function () {
            // Log when bundling starts
            //bundleLogger.start(bundleConfig.outputName);

            var stream = bundler
              .bundle()
              // Report compile errors
              .on('error', handleErrors)
              // Use vinyl-source-stream to make the
              // stream gulp compatible. Specifiy the
              // desired output filename here.
              .pipe(source(bundleConfig.outputName));

            if (config.debug) {
                stream = stream.pipe(buffer())
                               .pipe(sourcemaps.init({ loadMaps: true }))
                               .pipe(sourcemaps.write('.'));
            }
            else {
                stream = stream.pipe(buffer())
                               .pipe(uglify());
            }

            // Specify the output destination
            return stream.pipe(gulp.dest(bundleConfig.dest))
            .on('end', reportFinished);
        };

        if (global.isWatching) {
            // Wrap with watchify and rebundle on changes
            //  bundler = watchify(bundler);
            // Rebundle on update
            bundler.on('update', bundle);
        }

        var handleErrors = function(a,b,c){
          console.log(a);
          console.log(b);
          console.log(c);
        };

        var reportFinished = function () {
            // Log when bundling completes
            //bundleLogger.end(bundleConfig.outputName);

            if (bundleQueue) {
                bundleQueue--;
                if (bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    };

    //Start bundling with Browserify for each bundleConfig specified
    config.bundleConfigs.forEach(browserifyThis);
});