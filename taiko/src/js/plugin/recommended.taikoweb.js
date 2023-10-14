export default class Plugin extends Patch{
    name = "Recommended songs"
    version = "1.0.0"
    author = "Kairun"

    loadrecommended(){
        var promises = []
        var ts = Date.now()

		var subs = [
			["⒑", "10"],
			["⒒", "11"],
			["⒓", "12.5"],
			["⒕", "14"],
			["Ⅼ", "LO"],
			["Ⅾ", "DY"],
			["⁉", "!?"],
			["⁈", "?!"],
			["‼", "!!"],
			["‽", "!!!"],
			["❢", "!!!!"],
			["❣", "!!!!!"],
			["℣", "vs"],
			["☄", "☆彡"]
		]

        promises.push(loader.ajax("https://taiko-asset.kairun.jp/recommended/data.json?v="+ts).then(song => {
            song = JSON.parse(song)
            song.music = new RemoteFile("https://taiko-asset.kairun.jp/recommended/music.ogg?v="+ts)
            song.chart = new RemoteFile("https://taiko-asset.kairun.jp/recommended/chart.tja?v="+ts)
            if(song.category=="VOCALOID Music"){
                song.category="VOCALOID™ Music"
            }
            subs.forEach(sub => {
                song.title = song.title.replaceAll(sub[0], sub[1])
                if(song.subtitle) song.subtitle = song.subtitle.replaceAll(sub[0], sub[1])

                languageList.forEach(lang => {
                    if(song.title_lang[lang]) song.title_lang[lang] = song.title_lang[lang].replaceAll(sub[0], sub[1])
                    if(song.subtitle_lang[lang]) song.subtitle_lang[lang] = song.subtitle_lang[lang].replaceAll(sub[0], sub[1])
                })
            })
            this.addEdits(
                new EditValue(assets, "recommended").load(() => song)
            )
            this.log("Loaded song: " + song.title)
        }))

        return promises
    }

    load(){
        var promises = this.loadrecommended()

        this.addEdits(
            new EditValue(allStrings.ja, "recommended").load(() => "運営が思う一度はプレイしてほしい神曲"),
            new EditValue(allStrings.en, "recommended").load(() => "Recommended songs"),
            new EditValue(allStrings.cn, "recommended").load(() => "Recommended songs"),
            new EditValue(allStrings.tw, "recommended").load(() => "Recommended songs"),
            new EditValue(allStrings.ko, "recommended").load(() => "Recommended songs"),

            new EditFunction(SongSelect.prototype, "init").load(str => {
                str = plugins.insertBefore(str,
                `if (!assets.customSongs) {
                       var recommended = this.addSong(assets.recommended)
                       recommended.originalTitle = recommended.title
                       recommended.title = strings.recommended
                       recommended.skin = this.songSkin[assets.recommended.category]
                       recommended.category = recommended.category
                       recommended.canJump = false
                       this.songs.push(recommended)
                }
                `, `var showCustom = false`)
                str = plugins.insertBefore(str,
                `this.recommendedSong = !assets.customSongs ? this.songs.find(song => song.id === assets.recommended.id) : {id:null}
                `,
                `this.songAsset = {`)

                return str
            }),

            new EditFunction(SongSelect.prototype, "redraw").load(str => {
                str = plugins.insertBefore(str,
                    `var selectedSong = this.songs[this.selectedSong]
                    if(selectedSong.id === this.recommendedSong.id && selectedSong.title === strings.recommended){
                        selectedSong.title = selectedSong.originalTitle
                    }else if(selectedSong.id !== this.recommendedSong.id && this.recommendedSong.title !== strings.recommended){
                        this.recommendedSong.title = strings.recommended
                    }
                    `,
                    `var ctx = this.ctx`)
                
                return str
            }),

            new EditFunction(SongSelect.prototype, "addSong").load(str => {
                str = plugins.strReplace(str,
                `assets.categories.find(cat => cat.id === song.category_id)`,
                `assets.recommended && song.id === assets.recommended.id ? assets.categories.find(cat => cat.title === song.category) : assets.categories.find(cat => cat.id === song.category_id)`)
                return str
            }),

            new EditFunction(View.prototype, "refresh").load(str => {
                str = plugins.strReplace(str,
                `assets.categories.find(cat=>cat.id == selectedSong.category_id)`,
                `gameConfig.ese && assets.recommended && selectedSong.folder === assets.recommended.id ? assets.categories.find(cat=>cat.id == selectedSong.category_id+(cat.id>=4?1:0)) : assets.categories.find(cat=>cat.id == selectedSong.category_id)`)
                return str
            }),

            new EditFunction(LoadSong.prototype, "run").load(str => {
                str = plugins.insertAfter(str,
                    `assets.sounds["v_start"].play()`,
                    `
                    if (assets.recommended && id == assets.recommended.id) {
                        songObj = assets.recommended
                    }`
                )
                return str
            
            }),

            new EditFunction(Controller.prototype, "init").load(str => {
                str = plugins.insertBefore(str,
                `if(assets.recommended.id == this.selectedSong.folder){
                    this.mainAsset = assets.recommended.sound
                    this.volume = assets.recommended.volume || 1
                    if(this.parsedSongData.lyrics){
                        var lyricsDiv = document.getElementById("song-lyrics")
                        this.lyrics = new Lyrics(this.parsedSongData.lyrics, selectedSong.offset, lyricsDiv, true)
                    }
                }
                `,
                `assets.songs.forEach(song => {`)
                return str
            }),
            
            new EditFunction(Controller.prototype, "restartSong").load(str => {
                str = plugins.insertBefore(str,
                `if (assets.recommended && this.selectedSong.folder == assets.recommended.id) {
                    songObj = assets.recommended
                }
                `,
                `var promises = []`)
                return str
            }),

            new EditFunction(Game.prototype, "init").load(str => {
                str = plugins.insertBefore(str,
                `if(assets.recommended.id == selectedSong.folder){
                    this.mainAsset = assets.recommended.sound
                }
                `,
                `assets.songs.forEach(song => {`)
                return str
            }),

        )

        return Promise.all(promises)
    }
}