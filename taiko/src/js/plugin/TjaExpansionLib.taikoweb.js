export default class Plugin extends Patch {
    name = "譜面用プラグイン"
    version = "1.12.2"
    description = "null"
    author = "kairun"
    disableMultiplayer = false

    load() {
        this.addEdits(
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertBefore(str,
                    `let cssEvents = [];
					`, `var pushMeasure = () => {`)
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.strReplace(str,
                    'var note = currentMeasure[0]',
                    `var note = currentMeasure.find(x => !x.css)`)
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertBefore(str,
                    `if(note.css){
						note.ms = ms;
						cssEvents.push(note);
						continue;	
					}
					`, `if(firstNote`)
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertBefore(str,
                    `currentMeasure = currentMeasure.filter(x => !x.css)
					`, `var note_chain = [];`)
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertBefore(str,
                    `case "css":
                    let args = value.split(" ");
                    currentMeasure.push({
                        css: true,
                        selector: args[0],
                        prop: args[1],
                        value: args.slice(2).join(" "),
                        copied: false,
                        bpm
                    })
                    break;
					`, `case "gogostart":`)
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertBefore(str,
                    `this.cssEvents = cssEvents;
					`, `this.branches = branches`)
            }),
            new EditFunction(View.prototype, "drawCircles").load((str) => {
                return plugins.insertAfter(str,
                    `var game = this.controller.game`, `
                    for(var i = 0;i < game.songData.cssEvents.length; i++){
                        var event = game.songData.cssEvents[i];
                        if(!event.copied - this.controller.audioLatency && (ms*(this.controller.getPlaybackRate ? this.controller.getPlaybackRate() : 1)) >= event.ms){
                            event.copied = true;
                            let elem = document.querySelector(event.selector);
                            elem.style[event.prop] = event.value
                        }
                    }`)
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.strReplace(str,
                    'msPerMeasure / currentMeasure.length',
                    `msPerMeasure / currentMeasure.filter(x => !x.css).length`)
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertBefore(str,
                    `var angle = 0;
                    `, `var measure = 4`);
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertBefore(str,
                    `angle: note.angle,
                    `, `speed: note.bpm * note.scroll / 60,`);
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertBefore(str,
                    `case "angle":
                    angle = parseFloat(value)
                    break
                    `, `case "scroll":`);
            }),
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertAfter(str,
                    `var circleObj = {`, `
                    angle: angle,`);
            }),
            new EditFunction(Circle.prototype, "init").load((str) => {
                return plugins.insertBefore(str,
                    `this.angle = config.angle || 0
                    `, `this.speed = config.speed`);
            }),
            new EditFunction(View.prototype, "drawCircle").load((str) => {
                return plugins.insertBefore(str,
                    `var rad = circle.angle*(Math.PI/180);
                    var pos = this.msToPos(circleMs - ms + this.controller.videoLatency, speed);
                    var newx = Math.cos(rad) * pos;
                    var newy = Math.sin(rad) * pos;
                    circlePos ??= {
                        x: this.slotPos.x + newx,
                        y: this.slotPos.y + newy,
						changed: true
                    }
                    `, `if(!circlePos){`);
            }),
        );
    }
}