
$(function(){
    const width  = 300;    // We will scale the photo width to this
    let height = 0;     // This will be computed based on the input stream
    let streaming = false;
    let video = null;

    video    = document.getElementById('video');
    fcanvis  = document.getElementById('fcanvis');
    scanvis  = document.getElementById('scanvis');
    tcanvis  = document.getElementById('tcanvis');
    var videoSelect = document.querySelector("select#videoSource");
    videoSelect.onchange = getStream;
    getStream().then(getDevices).then(gotDevices);

    video.addEventListener('canplay', function(ev)
    {
      if (!streaming) 
      {
         height = video.videoHeight / (video.videoWidth/width);
         if (isNaN(height)) {height = width / (4/3); }
         video.setAttribute('width', width);
         video.setAttribute('height', height);

         fcanvis.setAttribute('width', width);
         fcanvis.setAttribute('height', height);

         scanvis.setAttribute('width', width);
         scanvis.setAttribute('height', height);

         tcanvis.setAttribute('width', width);
         tcanvis.setAttribute('height', height);
         streaming = true;
      }
    }, false);

    $(":button").on("click",function(ev){
         var elem = $(this);
         let id = elem.attr('id');
           switch(id) 
           {
             case "startbutton":
                 takepicture(get_blank());
                 ev.preventDefault();
                 break;
             case "frmbtn":
                 clearphoto("#firstimg")
                 ev.preventDefault();
                 break;
             case "srmbtn":
                 clearphoto("#secondimg")
                 ev.preventDefault();
                 break;
             case "trmbtn":
                 clearphoto("#thridimg")
                 ev.preventDefault();
                 break;
             default:
                 alert("id unknown")
           }          
    });
 
    function getStream() 
    {
        if (window.stream) {
             window.stream.getTracks().forEach((track) => {
             track.stop();
          });
        }
             const videoSource = videoSelect.value;
             const constraints = { video: { deviceId: videoSource ? { exact: videoSource } : undefined },};
        return  navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
             video.srcObject = stream;
             video.play();
        }).catch((err) => {console.error(`An error occurred: ${err}`);}).then(gotStream).catch(handleError); 
    }

    function handleError(error) {  console.error("Error: ", error);}

    function gotStream(stream) 
      {
             window.stream = stream;
             videoSelect.selectedIndex = [...videoSelect.options].findIndex((option) => option.text === stream.getVideoTracks()[0].label);
      }

    function getDevices() {return navigator.mediaDevices.enumerateDevices();}

    function gotDevices(deviceInfos) 
      {
             window.deviceInfos = deviceInfos; // make available to console
             console.log("Available input and output devices:", deviceInfos);
             for (const deviceInfo of deviceInfos) 
            {
              const option = document.createElement("option");
              option.value = deviceInfo.deviceId;
              if (deviceInfo.kind === "audioinput") {
              } else if (deviceInfo.kind === "videoinput") {
                      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
                      videoSelect.appendChild(option);
                }
            }
      }

    function takepicture(id)
      {
       switch (id) 
           {
               case "#firstimg": 
                   const context1 = fcanvis.getContext('2d');
                   if (width && height) 
                   {
                        fcanvis.width = width;
                        fcanvis.height = height;
                        context1.drawImage(video, 0, 0, width, height);// Draw your image to the canvas
                        const data1 = fcanvis.toDataURL('image/png');
                        $("#image-tag1").val(data1)
                        $(id).attr('src', data1)    
                   } 
                   break;
               case "#secondimg":
                   const context2 = scanvis.getContext('2d');
                   if (width && height) 
                   {
                        scanvis.width = width;
                        scanvis.height = height;
                        context2.drawImage(video, 0, 0, width, height); // Draw your image to the canvas
                        const data2 = scanvis.toDataURL('image/png');// This will save your image as a file in the base64 format.
                        $("#image-tag2").val(data2)
                        $(id).attr('src', data2)
                   } 
                   break;
               case "#thridimg":
                   const context3 = tcanvis.getContext('2d');
                   if (width && height) 
                   {
                        tcanvis.width = width;
                        tcanvis.height = height;
                        context3.drawImage(video, 0, 0, width, height); // Draw your image to the canvas
                        const data3 = tcanvis.toDataURL('image/png');// This will save your image as a file in the base64 format.
                        $("#image-tag3").val(data3)
                        $(id).attr('src', data3)
                   } 
                    break;
               default:
                    alert("only three image is required")
           }
      }

    function get_blank()
      {
           let result ;
           const blank_val = undefined;
           if(blank_val == $("#firstimg").attr('src') || $("#firstimg").attr('src')==" ")
           {
                result = "#firstimg"
           }
           else if(blank_val == $("#secondimg").attr('src') || $("#secondimg").attr('src')==" ")
           {
                result = "#secondimg"
           }
           else if(blank_val == $("#thridimg").attr('src') || $("#thridimg").attr('src')==" ")
           {
                result = "#thridimg"
           }
           else
           {
                result = ""
           }
           return result;
      }
     
    function clearphoto(id) 
        {
                switch (id) {
                    case "#firstimg": 
                        const context1 = fcanvis.getContext('2d');// Get the "context" of the canvas 
                        context1.fillStyle = "#AAA";
                        context1.fillRect(0, 0, fcanvis.width, fcanvis.height);
                        $(id).attr('src', " ")
                        break;
                    case "#secondimg":
                        const context2 = scanvis.getContext('2d');// Get the "context" of the canvas 
                        context2.fillStyle = "#AAA";
                        context2.fillRect(0, 0, scanvis.width, scanvis.height);
                        $(id).attr('src', " ")
                        break;            
                    case "#thridimg":
                        const context3 = tcanvis.getContext('2d');// Get the "context" of the canvas 
                        context3.fillStyle = "#AAA";
                        context3.fillRect(0, 0, tcanvis.width, tcanvis.height);
                        $(id).attr('src', " ")
                        break;
                    default:
                        alert("no noimage  to remove")
                }
      }

});