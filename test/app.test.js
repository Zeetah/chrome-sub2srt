describe('app page', function() {
  beforeEach(function() {
    window.chrome = {
      storage: {
        local: {
          get: function(name, callback) { return callback({settings: {fps: 23.973}}); },
          set: function() {}
        }
      }
    };

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

    new App();
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

  it('shows success message when convert is successfull', function(done) {
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

  it('it saves fps when correct value given', function(done) {
    expect($('#fps').val()).to.be.eql('23.973');

    $('#fps').val('21.12345');
    $('#save').click();

    expect($('#fps').val()).to.be.eql('21.123');

    done();
  });

  it('it saves default fps when incorrect value given', function(done) {
    expect($('#fps').val()).to.be.eql('23.973');

    $('#fps').val('ss21.12345');
    $('#save').click();

    expect($('#fps').val()).to.be.eql('23.976');

    done();
  });

});