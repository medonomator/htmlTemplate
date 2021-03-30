var syntax = "sass"; // Syntax: sass or scss;
const { src, dest, parallel, series, watch } = require("gulp");
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
  build: "./build/",
  sass: "./app/sass/",
  data: "./app/data/",
  js: "./app/js/",
};

function css() {
  return src("app/" + syntax + "/**/*." + syntax + "")
    .pipe(sass({ outputStyle: "expand" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
}

// gulp.task("imagemin", () =>
//   gulp.src("app/img/**/*").pipe(imagemin()).pipe(gulp.dest("dist/images"))
// );
// BrowserSync
function browserSync() {
  browsersync({
    server: {
      baseDir: paths.build,
    },
    notify: false,
    browser: "google chrome",
    // proxy: "0.0.0.0:5000"
  });
}

// BrowserSync reload
function browserReload() {
  return browsersync.reload;
}

// Watch files
function watchFiles() {
  // Watch SCSS changes
  watch(paths.scss + "**/*.scss", parallel(css)).on("change", browserReload());
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
