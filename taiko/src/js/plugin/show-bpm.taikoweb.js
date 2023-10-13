export default class Plugin extends Patch {
    name = "Show BPM"
    name_lang = {
        ja: "BPM繧定｡ｨ遉ｺ縺吶ｋ"
    }
    version = "22.02.22"
    description = "Displays the current BPM in game"
    description_lang = {
        ja: "繧ｲ繝ｼ繝�荳ｭ縺ｮBPM繧定｡ｨ遉ｺ縺励∪縺�"
    }
    author = "Katie Frogs"

    load() {
        this.addEdits(
            new EditFunction(View.prototype, "refresh").load(str => {
                return plugins.insertBefore(str, `
				this.draw.layeredText({
					ctx: ctx,
					text: "BPM: " + (Math.floor(1000 / this.beatInterval * 60 * 1000) / 1000).toString(),
					fontSize: 30,
					fontFamily: this.font,
					x: 10,
					y: frameTop + (this.portrait ? 500 : 400),
					width: 600,
					align: "left"
				}, [
					{outline: "#000", letterBorder: 10},
					{fill: "#fff"}
				])
				`, '// Pause screen')
            })
        )
    }
}