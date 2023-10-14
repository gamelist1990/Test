export default class Plugin extends Patch{
    name = "New songs"
    version = "1.0.0"
    author = "Koukunn"

    loadnewsong(){
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

        promises.push(loader.ajax("https://taiko-asset.kairun.jp/newsong/data.json?v="+ts).then(song => {
            song = JSON.parse(song)
            song.music = new RemoteFile("https://taiko-asset.kairun.jp/newsong/music.ogg?v="+ts)
            song.chart = new RemoteFile("https://taiko-asset.kairun.jp/newsong/chart.tja?v="+ts)
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
                new EditValue(assets, "newsong").load(() => song)
            )
            this.log("Loaded song: " + song.title)
        }))

        return promises
    }

    load(){
        var promises = this.loadnewsong()

        this.addEdits(
            new EditValue(allStrings.ja, "newsong").load(() => "新しい曲"),
            new EditValue(allStrings.en, "newsong").load(() => "New Songs"),
            new EditValue(allStrings.cn, "newsong").load(() => "New Songs"),
            new EditValue(allStrings.tw, "newsong").load(() => "New Songs"),
            new EditValue(allStrings.ko, "newsong").load(() => "New Songs"),

            new EditFunction(SongSelect.prototype, "init").load(str => {
                str = plugins.insertBefore(str,
                `if (!assets.customSongs) {
                       var newsong = this.addSong(assets.newsong)
                       newsong.originalTitle = newsong.title
                       newsong.title = strings.newsong
                       newsong.skin = this.songSkin[assets.newsong.category]
                       newsong.category = newsong.category
                       newsong.canJump = false
                       this.songs.push(newsong)
                }
                `, `var showCustom = false`)
                str = plugins.insertBefore(str,
                `this.newsongSong = !assets.customSongs ? this.songs.find(song => song.id === assets.newsong.id) : {id:null}
                `,
                `this.songAsset = {`)

                return str
            }),

            new EditFunction(SongSelect.prototype, "redraw").load(str => {
                str = plugins.insertBefore(str,
                    `var selectedSong = this.songs[this.selectedSong]
                    if(selectedSong.id === this.newsongSong.id && selectedSong.title === strings.newsong){
                        selectedSong.title = selectedSong.originalTitle
                    }else if(selectedSong.id !== this.newsongSong.id && this.newsongSong.title !== strings.newsong){
                        this.newsongSong.title = strings.newsong
                    }
                    `,
                    `var ctx = this.ctx`)
                
                return str
            }),

            new EditFunction(SongSelect.prototype, "addSong").load(str => {
                str = plugins.strReplace(str,
                `assets.categories.find(cat => cat.id === song.category_id)`,
                `assets.newsong && song.id === assets.newsong.id ? assets.categories.find(cat => cat.title === song.category) : assets.categories.find(cat => cat.id === song.category_id)`)
                return str
            }),

            new EditFunction(View.prototype, "refresh").load(str => {
                str = plugins.strReplace(str,
                `assets.categories.find(cat=>cat.id == selectedSong.category_id)`,
                `gameConfig.ese && assets.newsong && selectedSong.folder === assets.newsong.id ? assets.categories.find(cat=>cat.id == selectedSong.category_id+(cat.id>=4?1:0)) : assets.categories.find(cat=>cat.id == selectedSong.category_id)`)
                return str
            }),

            new EditFunction(LoadSong.prototype, "run").load(str => {
                str = plugins.insertAfter(str,
                    `assets.sounds["v_start"].play()`,
                    `
                    if (assets.newsong && id == assets.newsong.id) {
                        songObj = assets.newsong
                    }`
                )
                return str
            
            }),

            new EditFunction(Controller.prototype, "init").load(str => {
                str = plugins.insertBefore(str,
                `if(assets.newsong.id == this.selectedSong.folder){
                    this.mainAsset = assets.newsong.sound
                    this.volume = assets.newsong.volume || 1
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
                `if (assets.newsong && this.selectedSong.folder == assets.newsong.id) {
                    songObj = assets.newsong
                }
                `,
                `var promises = []`)
                return str
            }),

            new EditFunction(Game.prototype, "init").load(str => {
                str = plugins.insertBefore(str,
                `if(assets.newsong.id == selectedSong.folder){
                    this.mainAsset = assets.newsong.sound
                }
                `,
                `assets.songs.forEach(song => {`)
                return str
            }),

        )

        return Promise.all(promises)
    }
}