// https://github.com/andrewrk/node-s3-client
import AWS from 'aws-sdk';

const s3client = new AWS.S3();

const params = {
    Bucket:"",        //required
    Key:""            //required
}
const sessionParams = {
    maxPartSize: ,//default 20MB
    concurrentStreams: ,//default 5
    maxRetries: ,//default 3
    totalObjectSize: //required size of object being downloaded
}
const downloader = require('s3-download')(s3client);

const d = downloader.download(params,sessionParams);
d.on('error',function(err){
    console.log(err);
});
// dat = size_of_part_downloaded
d.on('part',function(dat){
    console.log(dat);
});
d.on('downloaded',function(dat){
    console.log(dat);
});

// const w = fs.createWriteStream(/path/to/file.txt);
// d.pipe(w);
