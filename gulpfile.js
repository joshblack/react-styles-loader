var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');

gulp.task('clean', function (cb) {
    del(['dist'], cb);
});

gulp.task('babel', ['clean'], function () {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['babel'], function () {
    gulp.watch('src/**/*.js', ['babel']);
});