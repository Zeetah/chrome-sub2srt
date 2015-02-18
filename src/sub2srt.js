;(function() {
  var REGEX_MICRO_DVD = /^\{(\d+)\}\{(\d+)\}(.+)$/,
      DEFAULT_FPS = 23.976,
      DEFAULT_SETTINGS = {
        fps: DEFAULT_FPS
      };

  var sub2srt = {

    settings: _.clone(DEFAULT_SETTINGS),

    defaultSettings: function() {
      return DEFAULT_SETTINGS;
    },

    zeroPad: function(value, width) {
      var length = value.toString().length;
      return length >= width ? value : new Array(width - length + 1).join('0') + value;
    },

    framesToTime: function(frames) {
      var allSeconds = frames / this.settings.fps,
          milliseconds = (allSeconds - Math.floor(allSeconds)) * 1000,
          allSeconds = Math.floor(allSeconds),
          seconds = allSeconds % 60,
          allMinutes = Math.floor(allSeconds / 60),
          minutes = allMinutes % 60,
          hours = Math.floor(allMinutes / 60);

      if ((milliseconds - Math.floor(milliseconds)) >= 0.5) {
        milliseconds += 1;
      }

      milliseconds = Math.floor(milliseconds);

      return this.zeroPad(hours, 2) + ':' + this.zeroPad(minutes, 2) + ':' + this.zeroPad(seconds, 2) + ',' + this.zeroPad(milliseconds, 3);
    },

    isSubFile: function(fileName) {
      return fileName.substring(fileName.lastIndexOf('.')) === '.sub'
    },

    getName: function(fileName) {
      return fileName.substr(0, fileName.lastIndexOf('.')) + '.srt'
    },

    convert: function(fileData, fps) {
      var self = this,
          srtData =
            _(fileData.split('\n'))
              .map(_.trim)
              .filter(function(line) {
                return line.match(REGEX_MICRO_DVD);
              })
              .map(function(line, index) {
                var matchedMicroDvd = line.match(REGEX_MICRO_DVD)
                    startTime = self.framesToTime(matchedMicroDvd[1]),
                    endTime = self.framesToTime(matchedMicroDvd[2]),
                    text = matchedMicroDvd[3].split('|').join('\n');

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

  if ((typeof define !== 'undefined' && define !== null) && (define.amd !== null)) {
    define([], function() {
      return sub2srt;
    });
    this.sub2srt = sub2srt;
  } else if ((typeof module !== 'undefined' && module !== null) && (module.exports !== null)) {
    module.exports = sub2srt;
    sub2srt.sub2srt = sub2srt;
  } else {
    this.sub2srt = sub2srt;
  }

}).call(this);
