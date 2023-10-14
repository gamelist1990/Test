var branchs = { "通常": "normal", "玄人": "advanced", "達人": "master", "なし": "none" };
export default class Plugin extends Patch {
    name = "TWTools"
    name_lang = {
        ja: "太鼓ツールズ"
    }
    version = "1.0.0"
    description = "TaikoWeb Utility"
    description_lang = {
        ja: "太鼓Web 便利ツール"
    }
    author = "Rasky1"

    disableMultiplayer = false
    tousoku = false
    branch = "なし"
    chaos = "なし"
    chaosLevel = 0.2;
    getMode() {
        return { abekobe: this.abekobe, detarame: this.detarame };
    }
    getChaos() {
        return this.chaos;
    }
    getTousoku() {
        return this.tousoku;
    }
    getBranch() {
        return branchs[this.branch];
    }
    getChaosLevel() {
        return this.chaosLevel;
    }
    load() {
        //あべこべ・でたらめ
        this.addEdits(
            new EditFunction(Circle.prototype, "init").load((str) => {
                return plugins.insertBefore(str,
                    `var mode = this.getMode();
					if(config.id != 0 && mode.abekobe){
						switch(config.type){
							case "don":
								config.type = "ka";
								break;
							case "daiDon":
								config.type = "daiKa";
								break;
							case "ka":
								config.type = "don";
								break;
							case "daiKa":
								config.type = "daiDon";
						}
					}
					if(config.id != 0 && mode.detarame){
						if(config.type == "don" || config.type == "ka")
							config.type = Math.random() > 0.5 ? "don" : "ka";
						if(config.type == "daiDon" || config.type == "daiKa")
							config.type = Math.random() > 0.5 ? "daiDon" : "daiKa";
					}
					`, `this.id =`)
            }),
            new EditValue(Circle.prototype, "getMode").load(() => this.getMode.bind(this))
        );
        //等速モード
        this.addEdits(
            new EditFunction(ParseTja.prototype, "parseCircles").load((str) => {
                return plugins.insertBefore(str,
                    `if(!this.getTousoku())
                    `, 'scroll = Math.abs(parseFloat(value)) || scroll')
            }),
            new EditValue(ParseTja.prototype, "getTousoku").load(() => this.getTousoku.bind(this))
        )
        //分岐固定
        this.addEdits(
            new EditFunction(Game.prototype, "updateCirclesStatus").load((str) => {
                return plugins.insertBefore(str,
                    `if(this.getBranch() != "none"){
                        this.setBranch(branch, this.getBranch());
                        return;
                    }
                    `, 'if(branch.type){')
            }),
            new EditValue(Game.prototype, "getBranch").load(() => this.getBranch.bind(this))
        )
        //カオスモード
        this.addEdits(
            new EditFunction(Circle.prototype, "init").load((str) => {
                return plugins.insertBefore(str,
                    `var chaos = this.getChaos();
                    var chaosLevel = this.getChaosLevel();
					if(config.id != 0 && chaos == "ドンカマ"){
                        if(config.id != 0 && (config.type == "don" || config.type == "daiDon"))
			                config.speed = 3;
		                else if(config.id != 0 && (config.type == "ka" || config.type == "daiKa"))
			                config.speed = 2;
                    } else if(config.id != 0 && chaos == "ランダム")
                    {
                        config.speed += Math.random() * (chaosLevel*0.7);
                    }
					`, `this.id =`)
            }),
            new EditValue(Circle.prototype, "getChaos").load(() => this.getChaos.bind(this)),
            new EditValue(Circle.prototype, "getChaosLevel").load(() => this.getChaosLevel.bind(this))
        );
    }
    settings() {
        return [
            {
                name: "あべこべ",
                description: "あべこべ",
                type: "toggle",
                getItem: () => this.abekobe,
                setItem: value => {
                    this.abekobe = value;
                }
            },
            {
                name: "でたらめ",
                description: "でたらめ",
                type: "toggle",
                getItem: () => this.detarame,
                setItem: value => {
                    this.detarame = value;
                }
            },
            {
                name: "等速モード",
                description: "等速",
                type: "toggle",
                getItem: () => this.tousoku,
                setItem: value => {
                    this.tousoku = value;
                }
            },
            {
                name: "分岐固定",
                description: "分岐固定",
                type: "select",
                options: ["なし", "通常", "玄人", "達人"],
                getItem: () => this.branch,
                setItem: value => {
                    this.branch = value;
                }
            },
            {
                name: "カオスモード",
                description: "カオスモード",
                type: "select",
                options: ["なし", "ランダム", "ドンカマ"],
                getItem: () => this.chaos,
                setItem: value => {
                    this.chaos = value;
                }
            },
            {
                name: "カオスレベル",
                description: "カオスレベル",
                type: "number",
                min: 0.1,
                max: 2,
                fixedPoint: 1,
                step: 1,
                getItem: () => this.chaosLevel,
                setItem: value => {
                    this.chaosLevel = value;
                }
            }
        ]
    }
}