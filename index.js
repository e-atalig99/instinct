
  var recognizing = false, ignore_onend = false, final_transcript, previousQuestion;
  
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    // Show Listening Indicator here...
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      console.log('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      console.log('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    
    previousQuestion = final_transcript;
    
  };



$('.ask').click(function(){

  if (recognizing) {
      $('.cards').append('<div class="card">'+final_transcript+'</div>');
      console.log(final_transcript);
      $('.ask').html('Start');
      recognition.stop();
      string=final_transcript;
      post();
      post2();
      return;
  }


  $('.ask').html('Stop');
  final_transcript = '';
  recognition.start();
  ignore_onend = false;
    
  $.ajaxSetup({xhrFields: { withCredentials: true } });
});