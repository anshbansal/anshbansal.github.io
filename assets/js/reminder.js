var globals;
jQuery(function () {
    globals = {
        eyeWorkInSeconds: 20 * 60,
        eyeBreakInSeconds: 60,
        eyeTimerWithOutBreak: 0,
        eyeTimerLeftDuration: 0,
        updateDurationLeft: function (durationLeftInMs) {
            if (typeof durationLeftInMs == 'undefined') {
                durationLeftInMs = globals.eyeWorkInSeconds * 1000;
            }
            var percentLeft = 100 * (durationLeftInMs / 1000) / globals.eyeWorkInSeconds;

            var duration = moment.duration(durationLeftInMs, 'ms').humanize();
            $("#duration-left").text(duration + " left");
            $("#eye-care-left")
                .css('width', percentLeft + '%')
                .attr('aria-valuenow', percentLeft);
        },
        getBeenWorking: function() {
          return "Been working for " +
              moment.duration(globals.eyeTimerWithOutBreak, 's').humanize();
        },
        eyeTimer: new Timer({
            ontick: function (ms) {
                globals.updateDurationLeft(ms);
            },
            onstart: function () {
            },
            onstop: function () {
            },
            onpause: function () {
            },
            onend: function () {
                globals.updateDurationLeft(0);
                var takingBreak = confirm(globals.getBeenWorking() + ", take a break");
                if (takingBreak) {
                    globals.eyeTimerWithOutBreak = 0;
                    setTimeout(globals.startEyeTimer, globals.eyeBreakInSeconds * 1000);
                } else {
                    globals.startEyeTimer();
                }
                $("#duration-work").text(globals.getBeenWorking());
            }
        }),
        startEyeTimer: function () {
            globals.updateDurationLeft();
            var duration = globals.eyeWorkInSeconds;
            globals.eyeTimerWithOutBreak += duration;
            globals.eyeTimer.start(duration);
        }
    };

    function main() {
        globals.startEyeTimer(2);
    }

    main();
});