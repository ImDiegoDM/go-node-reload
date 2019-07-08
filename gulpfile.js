const gulp     = require('gulp'),
      log      = require('fancy-log'),
      c        = require('ansi-colors'),
      notifier = require('node-notifier'),
      sync     = require('gulp-sync')(gulp).sync,
      child    = require('child_process'),
      os       = require('os');

var server = null;
var argv = require('yargs').argv;

gulp.task('server:build', function() {
  // Build application in the "gobin" folder
 var build = child.spawnSync('go', ['build','-o','app',argv.file+'/main.go']);
 // Something wrong
 if (build.stderr.length) {
    log(c.red('Something wrong with this version :'));
    var lines = build.stderr.toString()
      .split('\n').filter(function(line) {
        return line.length
      });
    for (var l in lines)
      log(c.red(
        'Error (go install): ' + lines[l]
      ));
    notifier.notify({
      title: 'Error (go install)',
      message: lines
    });
  }

  return build;
});

// Launch server
gulp.task('server:spawn', function() {
  // Stop the server
  if (server && server !== 'null') {
   server.kill();
  }

  var app = './app'

  if (os.platform() == 'win32') {
   server = child.spawn(app + '.exe');
  } else {
   server = child.spawn(app);
  }
  // Display terminal informations
  server.stderr.on('data', function(data) {
   process.stdout.write(data.toString());
  });
});

 // Watch files
gulp.task('server:watch', function() {
  gulp.watch([
    argv.file+'/*.go',
    argv.file+'/**/*.go',
  ],{interval: 1000, usePoll: true}, sync([
  'server:build',
  'server:spawn'
  ], 'server'));
});

gulp.task('default', ['server:build', 'server:spawn', 'server:watch']);