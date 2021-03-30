var syntax = "sass"; // Syntax: sass or scss;
const { dest, parallel, series, watch, src } = require("gulp");

var gutil = require("gulp-util"),
  sass = require("gulp-sass"),
  browsersync = require("browser-sync"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  cleancss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  autoprefixer = require("gulp-autoprefixer"),
  notify = require("gulp-notify"),
  rsync = require("gulp-rsync"),
  imagemin = require("gulp-imagemin"),
  path = require("path"),
  fs = require("fs");

/*
 * Directories here
 */
var paths = {
  sass: "./app/sass/",
  data: "./app/data/",
  js: "./app/js/",
};

function css() {
  return src("/" + syntax + "/**/*." + syntax + "")
    .pipe(sass({ outpuapptStyle: "expand" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(dest("app/css"))
    .pipe(browsersync.stream());
}

// gulp.task("imagemin", () =>
//   gulp.src("app/img/**/*").pipe(imagemin()).pipe(gulp.dest("dist/images"))
// );
// BrowserSync
function browserSync() {
  browsersync({
    server: {
      baseDir: "app",
      // index: "index.html",
    },
    notify: false,
  });
}

// BrowserSync reload
function browserReload() {
  return browsersync.reload;
}

// Watch files
function watchFiles() {
  // Watch SCSS changes
  watch(paths.sass + "**/*.sass", parallel(css)).on("change", browserReload());
  // Watch javascripts changes
  // watch(paths.js + '*.js', parallel(js))
  // .on('change', browserReload());
  // // Watch template changes
  // watch(['client/templates/**/*.twig','client/data/*.twig.json'], parallel(twigTpl))
  // .on('change', browserReload());
  // // Assets Watch and copy to build in some file changes
  // watch('client/assets/**/*')
  // .on('change', series(copyAssets, css, css_vendors, js, browserReload()));
}

// gulp.task("js", function () {
//   return (
//     gulp
//       .src([
//         "app/js/common.js", // Always at the end
//       ])
//       .pipe(concat("scripts.min.js"))
//       // .pipe(uglify()) // Mifify js (opt.)
//       .pipe(gulp.dest("app/js"))
//       .pipe(browserSync.reload({ stream: true }))
//   );
// });

// gulp.task("watch", ["styles", "js", "browser-sync"], function () {
//   gulp.watch("app/" + syntax + "/**/*." + syntax + "", ["styles"]);
//   gulp.watch(["libs/**/*.js", "app/js/common.js"], ["js"]);
//   gulp.watch("app/*.html", browserSync.reload);
//   gulp.watch("app/*.css", browserSync.reload);
// });

const watching = parallel(watchFiles, browserSync);

exports.css = css;
exports.default = parallel(css);
exports.watch = watching;
