var dest = './build',
  src = './src',
  debug = true;

if (!debug) {
    process.env.NODE_ENV = 'production';
}

module.exports = {
    bowerIncludes: {
        src: src + '/settings.html',
        path: 'vendor/',
        dest: dest
    },
    bowerFiles: {
        dest: dest + '/vendor'
    },
    browserify: {
        // Enable source maps
        debug: debug,
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: src + '/settings.jsx',
            dest: dest + '/scripts',
            outputName: 'settings.js',
            extensions: ['.jsx']
        }, {
            entries: src + '/background.js',
            dest: dest + '/scripts',
            outputName: 'background.js'
        }]
    },
    clean: {
        clean: [dest]
    },
    copy: {
        sets: [{
            src: src + '/**',
            dest: dest,
            exclude: ['*.jsx', '*.js', /scss/, /vendor/]
        }, {
            src: './node_modules/materialize-css/font/**/*',
            dest: dest + '/font',
            exclude: ['*.txt']
        }, {
            src: './node_modules/materialize-css/bin/*.js',
            dest: dest + '/scripts'
        }
        , {
            src: './CHANGELOG.md',
            dest: dest
        }]
    },
    scss: {
        debug: debug,
        sets: [{
            src: src + '/scss/style.scss',
            dest: dest + '/css'
        }]
    }
};