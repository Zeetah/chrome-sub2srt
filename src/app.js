var App = function() {
  var acceptsExtensions = [{
      extensions: ['sub']
    }];

  function readAsBinaryString(fileEntry, callback) {
    fileEntry.file(function(file) {
      var reader = new FileReader();

      reader.onerror = errorHandler;
      reader.onload = function(e) {
        callback(e.target.result, fileEntry.name);
      };

      reader.readAsBinaryString(file);
    });
  };

  function saveFile(resultData, fileName) {
    var config = {type: 'saveFile', suggestedName: sub2srt.getName(fileName)};

    chrome.fileSystem.chooseEntry(config, function(writableEntry) {
      var blob = new Blob([sub2srt.convert(resultData)], {type: 'text/plain'});

      writeFileEntry(writableEntry, blob, function() {
        $('#message').html('Write complete :)');
      });
    });
  };

  function writeFileEntry(writableEntry, blob, callback) {
    if (!writableEntry) {
      $('#message').html('Nothing selected.');
      return;
    }

    writableEntry.createWriter(function(writer) {
      writer.onerror = errorHandler;
      writer.onwriteend = callback;

      writer.truncate(blob.size);
      waitForIO(writer, function() {
        writer.seek(0);
        writer.write(blob);
      });
    }, errorHandler);
  };

  function waitForIO(writer, callback) {
    var start = Date.now(),
        checkIOState = function() {
          if (writer.readyState === writer.WRITING && Date.now() - start < 4000) {
            setTimeout(checkIOState, 100);
            return;
          }
          if (writer.readyState === writer.WRITING) {
            console.error('Write operation taking too long, aborting! (current writer readyState is ' + writer.readyState + ')');
            writer.abort();
          } else {
            callback();
          }
        };
    setTimeout(checkIOState, 100);
  };

  function errorHandler(error) {
    console.error(error);
  };

  function handleDataDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    var items = e.dataTransfer.items;

    if(items[0]) {
      var entry = items[0].webkitGetAsEntry();

      if(sub2srt.isSubFile(entry.name)) {
        readAsBinaryString(entry, saveFile);
      } else {
        $('#message').html('Not a .sub file!');
      }
    }
  };

  function handleFileSelection() {
    chrome.fileSystem.chooseEntry({type: 'openFile', accepts: acceptsExtensions}, function(entry) {
      if (!entry) {
        $('#message').html('No file selected!');
        return;
      }
      readAsBinaryString(entry, saveFile);
    });
  };

  function updateSettings() {
    var fps = +((+$('#fps').val()).toFixed(3));

    if (!_.isFinite(fps) || _.isEqual(fps, 0)) {
      fps = sub2srt.defaultSettings().fps;
    }

    sub2srt.settings.fps = fps;
    chrome.storage.local.set({settings: {fps: fps}});
    $('#fps').val(fps);
  };

  // Enable dataTransfer support for jQuery events
  $.event.props.push('dataTransfer');

  $(function() {
    $('body')
      .bind( 'dragenter dragover', false)
      .bind( 'drop', handleDataDrop);

    $('#choose-file').bind('click', handleFileSelection);

    $('#save').bind('click', updateSettings);

    if(typeof chrome !== 'undefined') {
      chrome.storage.local.get('settings', function(storageData) {
        var fps = storageData.settings ? storageData.settings.fps : sub2srt.defaultSettings().fps;
        $('#fps').val(fps);
      });
    }
  });

};

new App();
