// const ffmpeg = require('fluent-ffmpeg');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


var videoEdite = (function (url) {
	
	function baseName(str) {
		var base = new String(str).substring(str.lastIndexOf('/') + 1); 
		if(base.lastIndexOf(".") != -1) {
			base = base.substring(0, base.lastIndexOf("."));
		}     
		return base;
	}


        var filename = url;
        var basename = baseName(filename);
        console.log('Input File ... ' + filename);
        // return;
        ffmpeg(filename)
            // Generate 720P video
            .output(basename + '-1280x720.mp4')
            .videoCodec('libx264')  
            .noAudio()
            .size('1280x720')
		  
		    // Generate 1080P video
		    // .output(basename + '-1920x1080.mp4')
		    // .videoCodec('libx264')
		    // .noAudio()
		    // .size('1920x1080')

            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
                
            })	
            .on('progress', function(progress) { 
                console.log('... frames: ' + progress.frames);
                
            })
            .on('end', function() { 
                console.log('Finished processing'); 
                
            })
            .run();
 
    
});



exports.videoEdite = videoEdite;