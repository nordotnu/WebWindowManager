module.exports = {
  extends: [
    'stylelint-config-recommended'
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.json',
    '**/*.min.css',
    'build/**/*.css',
    'dist/**/*.css',
    'doc/**/*.css',
    'node_modules/**/*.css'
  ]
}
