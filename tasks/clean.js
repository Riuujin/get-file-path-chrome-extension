const del = require('del');

del(['dist']).then(paths => {
   console.log('Deleted files and folders:\n', paths.join('\n'));
});