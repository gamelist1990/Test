// ゲームのタイトル
let title = "草原の戦い";

// キャラクターとマップの設定
let hero = {name: "勇者", hp: 100, attack: 20, x: 0, y: 0, color: "blue"};
let demonLord = {name: "魔王", hp: 200, attack: 30, x: 15, y: 15, color: "black"};
let map = Array(16).fill().map(() => Array(16).fill("green"));

// 戦闘シーンの関数
function battle(hero, demonLord) {
    document.getElementById('battle').style.display = "block";
}

// 移動関数
function move(character, direction) {
    let oldX = character.x;
    let oldY = character.y;
    
    if (direction === 'w') character.y--;
    else if (direction === 's') character.y++;
    else if (direction === 'a') character.x--;
    else if (direction === 'd') character.x++;
    
    // マップの範囲内にいるか確認
    if (character.x < 0 || character.y < 0 || character.x >= map[0].length || character.y >= map.length) {
        document.getElementById('message').innerText = character.name + "はマップの外に出ようとしました。";
        character.x = oldX;
        character.y = oldY;
        return;
    }
    
    // 魔王との戦闘
    if (character.x === demonLord.x && character.y === demonLord.y) {
        document.getElementById('message').innerText = character.name + "は" + demonLord.name + "と出会いました。戦闘が始まります...";
        battle(hero, demonLord);
    }
}

// マップを描画する関数
function drawMap() {
    let mapDiv = document.getElementById('map');
    mapDiv.innerHTML = '';
    
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            
            if (x === hero.x && y === hero.y) {
                cellDiv.classList.add(hero.color);
            } else if (x === demonLord.x && y === demonLord.y) {
                cellDiv.classList.add(demonLord.color);
            } else {
                cellDiv.classList.add(map[y][x]);
            }
            
            mapDiv.appendChild(cellDiv);
        }
    }
}

// ゲームの開始
document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('title').innerText = title + "が始まります...";
    document.getElementById('map').style.display = "block";
    drawMap();
    document.addEventListener('keydown', function(event) {
        if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
            move(hero, event.key);
            drawMap();
        }
    });
});

// 戦闘アクション
document.getElementById('attack-button').addEventListener('click', function() {
    let heroAttack = Math.floor(Math.random() * hero.attack);
    demonLord.hp -= heroAttack;
    document.getElementById('demonLord-hp').innerText = demonLord.name + "のHP: " + demonLord.hp;
});
document.getElementById('defend-button').addEventListener('click', function() {
    // 防御アクションの実装
});
document.getElementById('heal-button').addEventListener('click', function() {
    // 回復アクションの実装
});
