const promiseSetTimeOut = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const BROWSERLESS_API_KEY =
  process.env["TOKEN"] || "0fd64530-2641-45f8-853b-b2d6414875f8";

const extractQuality = (str) => {
  // console.log('str: ',str)
  const regex1 = /\D*[-]\s([0-9]+)\D*/;
  const regex1Exec=regex1.exec(str)
  console.log('regex1Exec: ',regex1Exec)
  if(regex1Exec){
    return regex1Exec[1]  
  }

  return null
  
  // return '720'
};

const extractK=(str,type="mp4")=>{
  let regex1=/startConvert\('mp4','(.+)'\)/
  if(type!=='mp4'){
    regex1=/startConvert\('mp3','(.+)'\)/
  }


  const regex1Exec=regex1.exec(str)
  if(regex1Exec){
    return (regex1.exec(str))[1];
  }

  return null

}



const extractYtID=(str)=>{

  const regex1=/watch\?v=([a-zA-Z0-9_-]+)[&]?/

  var video_id = str.split('v=')[1];
var ampersandPosition = video_id.indexOf('&');
if(ampersandPosition != -1) {
  video_id = video_id.substring(0, ampersandPosition);
}

return video_id
  // const regex1=/watch\?v=(.+)[&]?/
  // return (regex1.exec(str))[1];
  // console.log(re)
}

module.exports={
  promiseSetTimeOut,extractK,extractQuality,extractYtID,BROWSERLESS_API_KEY
}