var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.addEventListener("result", handle);
recognition.addEventListener("end", recognition.start);

let micro = $("#micro");
let micro_active = false;

let commands = [];

function create_command (name, regex, exe) {

    commands.push({name:name,
                   regex:regex,
                   exe:exe
                  });
}

function handle(data) {
    transcript = data.results[0][0].transcript;
    isFinal = data.results[0].isFinal;

    if (isFinal) {console.log(transcript);
        commands.forEach(e=>{
            if (transcript.search(e.regex) > -1) 
                e.exe(transcript);
        });
    }


}

// Event listener on microphone symbol to activate speech recognition:

micro.on("click", () => {
    if (micro_active) {
        recognition.removeEventListener("end", recognition.start);
        recognition.stop();    
        micro.removeClass("micro_active");
        micro_active = false;
    }
    else {
        recognition.addEventListener("end", recognition.start);
        recognition.start();        
        micro.addClass("micro_active");
        micro_active = true;
    }

}
)