const gulp = require('gulp');
const pug = require('gulp-pug');
const livereload = require('gulp-livereload');
const esbuild = require('esbuild');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass')); // SCSS를 사용하도록 설정
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');

// 동적 import로 del 사용
async function clean(done) {
    const { deleteSync } = await import('del');
    deleteSync(['./dist/**', '!./dist']);
    done();
}

// Pug를 HTML로 변환하는 작업
function pugTask() {
    return gulp
        .src('./src/popup.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('./dist'))
        .pipe(livereload());
}

// ESBuild로 JS 번들링 (개발용)
function buildJsDev(done) {
    esbuild
        .build({
            entryPoints: ['src/main.ts', 'src/popup.ts'],
            outdir: './dist/src',
            bundle: true,
            sourcemap: true,
        })
        .then(() => {
            livereload.reload();
            done();
        })
        .catch(() => process.exit(1));
}
let a;
// ESBuild로 JS 번들링 (배포용)
function buildJsProd(done) {
    esbuild
        .build({
            entryPoints: ['src/main.ts', 'src/popup.ts'],
            outdir: './dist/src',
            bundle: true,
            minify: true,
        })
        .then(() => {
            done();
        })
        .catch(() => process.exit(1));
}
// SCSS를 CSS로 변환하는 작업
function compileScss() {
    return gulp
        .src('./src/**/*.scss') // SCSS 파일 경로
        .pipe(sass().on('error', sass.logError)) // SCSS를 CSS로 변환
        .pipe(
            postcss([
                tailwindcss('./tailwind.config.js'),
                require('autoprefixer'),
            ])
        ) // Tailwind 및 Autoprefixer 적용
        .pipe(gulp.dest('./dist/src')) // 출력 폴더
        .pipe(livereload()); // 브라우저 리로드
}

// CSS 압축 (배포용)
function minifyCss() {
    return gulp
        .src('./dist/src/*.css') // 이미 생성된 CSS 파일 경로
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/src'));
}

// 파일 감시 및 실시간 리로딩 (개발용)
function watchTask() {
    livereload.listen();
    gulp.watch('./src/*.pug', pugTask);
    gulp.watch('./src/*.ts', buildJsDev);
    gulp.watch('./src/**/*.scss', gulp.series(compileScss)); // SCSS 파일 감시
    gulp.watch('./src/*.css', gulp.series(minifyCss));
}

// public 폴더의 파일들을 dist 폴더로 복사
function copyTask() {
    return gulp.src('./public/**/*').pipe(gulp.dest('./dist/'));
}

// 개발용 작업: 실시간 리로딩 및 번들링
gulp.task(
    'dev',
    gulp.series(
        clean,
        gulp.parallel(pugTask, buildJsDev, compileScss, copyTask),
        watchTask
    )
);

// 배포용 작업: 압축된 JS/CSS 및 파일 복사
gulp.task(
    'prod',
    gulp.series(clean, gulp.parallel(pugTask, buildJsProd, minifyCss, copyTask))
);

// 파일 복사 작업만 실행
gulp.task('copy', copyTask);
