;(function() {
  var REGEX_MICRO_DVD = /^\{(\d+)\}\{(\d+)\}(.+)$/,
      DEFAULT_FPS = 23.976,
      settings = {
        fps: DEFAULT_FPS
      };

  function zeroPad(value, width) {
    var length = value.toString().length;
    return length >= width ? value : new Array(width - length + 1).join('0') + value;
  };

  function framesToTime(frames) {
    var allSeconds = frames / settings.fps,
        milliseconds = (allSeconds - Math.floor(allSeconds)) * 1000,
        seconds = Math.floor(allSeconds),
        allMinutes = Math.floor(seconds / 60),
        minutes = allMinutes % 60,
        hours = Math.floor(allMinutes / 60);

    if ((milliseconds - Math.floor(milliseconds)) >= 0.5) {
      milliseconds += 1;
    }

    milliseconds = Math.floor(milliseconds);

    return zeroPad(hours, 2) + ':' + zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2) + ',' + zeroPad(milliseconds, 3);
  };

  var sub2srt = {
    settings: settings,

    isSubFile: function(fileName) {
      return fileName.substring(fileName.lastIndexOf('.')) === '.sub'
    },

    getName: function(fileName) {
      return fileName.substr(0, fileName.lastIndexOf('.')) + '.srt'
    },

    convert: function(fileData, fps) {
      var srtData =
        _(fileData.split('\n'))
          .map(_.trim)
          .filter(function(line) {
            return line.match(REGEX_MICRO_DVD);
          })
          .map(function(line, index) {
            var matchedMicroDvd = line.match(REGEX_MICRO_DVD)
                startTime = framesToTime(matchedMicroDvd[1]),
                endTime = framesToTime(matchedMicroDvd[2]),
                text = matchedMicroDvd[3];

            return [
              index + 1,
              startTime + ' --> ' + endTime,
              text + '\n'
            ]
          })
          .flatten()
          .join('\n')

      return srtData;
    }
  };

  var root = typeof window === 'object' ? window : this;

  root.sub2srt = sub2srt;
}.call(this));
