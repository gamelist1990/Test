export default class Plugin extends Patch{
	name = "Nightcore"
	name_lang = {
		ja: "Nightcore"
	}
	version = "22.02.22"
	description = "Slow down or speed up the music in game"
	description_lang = {
		ja: "音楽をNightcore風にできます"
	}
	author = "Kairun"
	
	playbackRate = 1.15
	disableMultiplayer = true
	
	load(){
		var playbackRate = this.playbackRate
		this.addEdits(
			new EditFunction(Sound.prototype, "play").load((str, args) => {
				args.push("playbackRate")
				return plugins.insertBefore(str,
				`if(playbackRate){
					source.playbackRate.value = playbackRate
				}
				`, 'source.start')
			}),
			new EditFunction(Sound.prototype, "playLoop").load((str, args) => {
				args.push("playbackRate")
				str = plugins.strReplace(str,
				'started: time + until - seek1',
				`started: time + (until - seek1) / (playbackRate || 1),
				playbackRate: (playbackRate || 1)`)
				return plugins.insertAfter(str, 'this.play(time, true, seek1, until', `, playbackRate`)
			}),
			new EditFunction(Sound.prototype, "addLoop").load(str => {
				str = plugins.insertAfter(str, ', this.loop.until', `, this.loop.playbackRate`)
				return plugins.strReplace(str,
				'this.loop.until - this.loop.seek',
				`(this.loop.until - this.loop.seek) / this.loop.playbackRate`)
			}),
			
			new EditFunction(Game.prototype, "playMainMusic").load(str => {
				str = plugins.insertBefore(str,
				`ms = this.elapsedTime * this.controller.getPlaybackRate() + this.controller.offset
				`, 'this.mainAsset.play(')
				return plugins.insertAfter(str,
				'this.mainAsset.play((ms < 0 ? -ms : 0) / 1000, false, Math.max(0, ms / 1000)', `, undefined, this.controller.getPlaybackRate()`)
			}),
			
			new EditFunction(Game.prototype, "playBackgroundVideo").load(str => {
				str = plugins.strReplace(str,
				`this.elapsedTime - (this.controller.videoOffset*1000)`, `(this.elapsedTime - ((this.controller.videoOffset / this.controller.getPlaybackRate()) * 1000)) * this.controller.getPlaybackRate()`);
				return plugins.insertBefore(str,
					`this.controller.video.playbackRate = this.controller.getPlaybackRate();
					`,"if(this.elapsedTime <= 0)")
			}),
			
			new EditFunction(Controller.prototype, "init").load(str => {
				return plugins.insertBefore(str,
				`var playbackRate = this.getPlaybackRate()
				this.parsedSongData.beatInfo.beatInterval /= playbackRate
				this.parsedSongData.circles.forEach(circle => {
					circle.beatMS /= playbackRate
					circle.ms /= playbackRate
					circle.originalMS /= playbackRate
					circle.endTime /= playbackRate
					circle.originalEndTime /= playbackRate
					circle.lastFrame = circle.ms + 100
					circle.speed *= playbackRate
				})
				this.parsedSongData.measures.forEach(measure => {
					measure.ms /= playbackRate
					measure.originalMS /= playbackRate
					measure.speed *= playbackRate
				})
				this.parsedSongData.events.forEach(event => {
					if(event.type === "event"){
						event.beatMS /= playbackRate
						event.ms /= playbackRate
						event.originalMS /= playbackRate
						event.endTime /= playbackRate
						event.originalEndTime /= playbackRate
						event.endTime /= playbackRate
						event.speed *= playbackRate
					}
				})
				this.offset /= playbackRate
				this.parsedSongData.offset /= playbackRate
				this.parsedSongData.soundOffset /= playbackRate
				
				if(this.lyrics){
					this.lyrics.vttOffset /= playbackRate
					this.lyrics.lines.forEach(line => {
						line.start /= playbackRate
						line.end /= playbackRate
					})
				}
				if(playbackRate < 1){
					this.saveScore = false
				}
				`, 'this.game = new Game')
			}),
			new EditValue(Controller.prototype, "getPlaybackRate").load(() => this.getPlaybackRate.bind(this)),
			new EditFunction(SongSelect.prototype, "previewLoaded").load(str => {
				return plugins.insertAfter(str, 'this.preview.playLoop(delay / 1000, false, prvTime', `, undefined, undefined, this.getPlaybackRate()`)
			}),
			new EditValue(SongSelect.prototype, "getPlaybackRate").load(() => this.getPlaybackRate.bind(this))
		)
	}
	getPlaybackRate(){
		return this.playbackRate
	}
	start(){
		if(this.disableMultiplayer){
			p2.disable()
		}
	}
	stop(){
		if(this.disableMultiplayer){
			p2.enable()
		}
	}
}