Zepto(function($){

  doAjax(null);

  $('form').on('submit', function(e) {
  	e.preventDefault();
  	var value = $("#searchBox").val();
  	doAjax(value);
  });

  $('#searchMusic').on('click', function(e) {
  	var value = $("#searchBox").val();
  	doAjax(value);
  });

});

function doAjax(value) {
	if(value == null) {
		doLoad("http://ex.fm/api/v3/trending");
	} else {
		doLoad("http://ex.fm/api/v3/song/search/" + value);
		$('#searchHeader').text(value);
	}
}

function doLoad(urlget) {
	var xhr = new XMLHttpRequest({ mozSystem: true });
	xhr.open('GET', urlget, false);
//	xhr.responseType = 'json';

	xhr.onload = function(e) {
		if (xhr.status === 200 || xhr.status === 400 || xhr.status === 0) {
			var data = JSON.parse(xhr.responseText);
			var i = 0;
			$('#resultSongs').empty();
			$.each(data.songs, function() {
				$('#resultSongs').append(' \
					<li> \
						<aside class="pack-end"> \
							<img alt="' + data.songs[i].artist + '" src="' + data.songs[i].image.medium + '"> \
						</aside> \
						<a href="#" data-urlsong="' + data.songs[i].url + '" data-imagefull="' + data.songs[i].image.large + '"> \
							<p class="artistlist">' + data.songs[i].artist + '</p> \
							<p class="titlelist">' + data.songs[i].title + '</p> \
						</a> \
					</li> \
				');
				i = i+1;
			});
			$('#resultSongs li').on('click', playSong);
		} else {
			console.log(xhr.status);
		}
	}

	xhr.onerror = function() {
    	alert(xhr.status);
  	};

	xhr.send();
}

function playSong() {

	//alert($(this).find('a').data('urlsong'));
	var imagefull = $(this).find('a').data('imagefull');
	var urlsong = $(this).find('a').data('urlsong');
	var artist = $(this).find('.artistlist').text();
	var song = $(this).find('.titlelist').text();
	$('#listhome').hide();
	$('#playerpage').find('img').attr('src',imagefull);
	$('#playerpage').find('#playermusic').attr('src',urlsong);
	$('#progressSong').attr('aria-valuenow',0);
	$('progress').attr('value',0);
	$('#playerpage').find('header h1').text(artist + ' - ' + song);
	$('#playerpage').show();

	var audio = $('#playerpage audio').get(0);
	audio.play();

	var i=0;


	$(audio).on('timeupdate', function() {
		if(i==0){
			$('#positionSong').css('left','0%');

			var totalMinutes = (parseInt(audio.duration/60, 10) + 100).toString().substr(1);
			var totalSeconds = (parseInt(audio.duration%60, 10) + 101).toString().substr(1);
			var totalTime = totalMinutes + ':' + totalSeconds;
			$('#totalTime').text(totalTime);
		} else {
			var progress = audio.currentTime;
			progress = ((progress*100) / audio.duration);
			$('#positionSong').css('left',progress+'%')
		}

		var actualMinutes = (parseInt(audio.currentTime/60, 10) + 100).toString().substr(1);
		var actualSeconds = (parseInt(audio.currentTime%60, 10) + 101).toString().substr(1);
		var actualTime = actualMinutes + ':' + actualSeconds;
		$('#actualTime').text(actualTime);


			$('#progressSong').on('click', 'button', function() {
				var changeTime = $('#progressSong').attr('aria-valuenow');
				changeTime = (changeTime * audio.duration)/100;
				console.log(changeTime);
				audio.currentTime = changeTime;
			});

			if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
				buffered = ((audio.buffered.end(0)*100) / audio.duration)/100;
				$('#progressSong').attr('aria-valuenow',buffered);
				$('#progressSong').find('progress').attr('value',buffered);
			}
			i = i+1;
		});
	

	$('#backtoList').on('click', function() {
		audio.pause();
		$('#playerpage').hide();
		$('#listhome').show();
	});

}
