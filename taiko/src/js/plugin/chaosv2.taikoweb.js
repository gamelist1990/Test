export default class Plugin extends Patch {
    name = "円形カオスモード"
    version = "1.17.11(Kairun Client)"
    description = "な　ん　だ　こ　れ"
    author = "Rasky1 Edited By Kairun Edited by Rasky1"

    disableMultiplayer = true

    load() {
        this.addEdits(
            new EditFunction(View.prototype, "refresh").load((str) => {
                return plugins.strReplace(str,
                    `this.portrait = winW < winH`, 'this.portrait = true')
            }),
            new EditFunction(View.prototype, "refresh").load((str) => {
                return plugins.strReplace(str,
                    `x: 66,`,
                    'x: (winW / 2),')
            }),
            new EditFunction(View.prototype, "refresh").load((str) => {
                return plugins.strReplace(str,
                    `y: frameTop + 375,`,
                    'y: (winH / 2),')
            }),
            new EditFunction(View.prototype, "drawCircle").load((str) => {
                return plugins.insertBefore(str,
                    `var kakudo = Math.floor(Math.sin(circle.ms/1000)*360);
                    var kakudorad = kakudo*(Math.PI/180);
                    var pos = this.msToPos(circleMs - ms + this.controller.videoLatency, speed);
                    var newx = Math.cos(kakudorad) * pos;
                    var newy = Math.sin(kakudorad) * pos;
					if(circlePos.changed || !circlePos)
	                    circlePos = {
	                        x: this.slotPos.x + newx,
	                        y: this.slotPos.y + newy
	                    }
                    `, 'if(!circlePos){')
            })
		)
	}
}