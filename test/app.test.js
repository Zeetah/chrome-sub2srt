describe('app page', function() {
  beforeEach(function() {
    window.chrome = {};

    window.Blob = function(arr, obj) {};

    window.FileReader.prototype = _.extend(FileReader.prototype, {
      readAsBinaryString: function(file) {
        this.onload({target: {result: 'resultData'}});
      }
    });

    window.FileWriter = {
      readyState: 0,
      truncate: function() {},
      seek: function() {},
      write: function(blob) {
        this.onwriteend();
      }
    };
  });

  it('displays error when file not selected', function(done) {
    window.chrome.fileSystem = {
      chooseEntry: function(val, callback) {
        callback();
      }
    };

    $('#choose-file').click();

    expect($('#message').html()).to.be.eql('No file selected!');
    done();
  });

  it('displays error when sa not selected', function(done) {
    chrome.fileSystem = {
      chooseEntry: function(val, callback) {
        callback({
          name: 'testSubData.sub',
          file: function(cb) {
            cb();
          },
          createWriter: function(fn) {
            fn(FileWriter);
          }
        });
      }
    };

    $('#choose-file').click();

    function checkIOState() {
      expect($('#message').html()).to.be.eql('Write complete :)');
      done();
    };

    setTimeout(checkIOState, 100);
  });
});