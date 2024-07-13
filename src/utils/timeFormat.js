  function timeFormat(time){
     const totalSeconds  = parseFloat(time)
     const hours = Math.floor(totalSeconds / 3600);
     const minutes = Math.floor((totalSeconds % 3600) / 60);
     const seconds = Math.floor(totalSeconds % 60);

     // Format the time as HH:MM:SS
     const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

     return formattedTime;
  }

  export default timeFormat;