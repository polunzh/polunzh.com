const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

gulp.task('default', () => {
  $.nodemon({
    watch: ['app', 'bin'],
    script: 'bin/www',
    ext: 'js hbs',
    env: {
      NODE_ENV: 'dev',
      DEBUG: '*'
    },
    stdout: false,
  }).on('readable', function() {
    this.stdout.on('data', function(chunk) {});

    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});
