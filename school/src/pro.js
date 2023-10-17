let resolveButtonClick = null;
async function q(dataArray, list) {
    var sum = 0;
    var q_sum = 50;
    for (let i = 0; i < q_sum; i++) {
        document.getElementById('num').innerHTML = '問題' + (i + 1);
        document.getElementById('sum').innerHTML = '点数:' + sum + "/" + q_sum;
        document.getElementById('q').innerHTML = dataArray[list[i]][0];
        output_csv = document.getElementById('b1').innerHTML = dataArray[list[i]][1];
        output_csv = document.getElementById('b2').innerHTML = dataArray[list[i]][2];
        output_csv = document.getElementById('b3').innerHTML = dataArray[list[i]][3];
        output_csv = document.getElementById('b4').innerHTML = dataArray[list[i]][4];
        result = await waitButtonClick();
        console.log("Result: ", result);
        console.log("Expected answer: ", dataArray[list[i]][5]);
        if (Number(result) === Number(dataArray[list[i]][5])) {
            alert('正解です。OKで次の問題に進みます。');
            sum += 1;
        }
        else {
            alert('不正解です。正解 >> ' + dataArray[list[i]][5]);
        }
    }
    end(sum);
}

function waitButtonClick() {
    return new Promise(resolve => {
        resolveButtonClick = resolve;
    });
}
function onButtonClick(str) {
    if (resolveButtonClick !== null) {
        resolveButtonClick(str);
    }
}
function generate_randomx(count) {
    //生成した乱数を格納する配列を初期化
    var generated = new Array();
    //生成した乱数を格納している配列の長さ（生成した乱数の数）
    var generatedCount = generated.length;
    //パラメータ count の数だけ Math.random()で乱数を発生
    for (var i = 0; i < count; i++) {
        var candidate = Math.floor(Math.random() * count);
        //今まで生成された乱数と同じ場合は再度乱数を発生
        for (var j = 0; j < generatedCount; j++) {  // このコメントは無視>
            if (candidate == generated[j]) {
                candidate = Math.floor(Math.random() * count);
                j = -1;
            }
        }
        generated[i] = candidate;
        generatedCount++;
    }
    return generated;
}
function end(sum) {
    if (sum >= 40) {
        alert("【合格】＿合計点：" + sum);

    }
    else {
        alert("【不合格】＿合計点：" + sum);
    }
    location = 'q';
}
var qqElement = document.getElementById('qq');//codeが古い記述方法がおかしい
if (qqElement !== null) {
    var dataPath = "data" + qqElement.textContent + ".csv";
}

const request = new XMLHttpRequest(); // HTTPでファイルを読み込む
request.addEventListener('load', (event) => { // ロードさせ実行
    const response = event.target.responseText; // 受け取ったテキストを返す
    const dataArray = []; //配列を用意
    const dataString = response.split('\n'); //改行で分割
    for (let i = 0; i < dataString.length; i++) { //あるだけループ
        dataArray[i] = dataString[i].split(',');
    }
    dataArray.pop();
    dataArray.shift();
    console.log(dataArray.length);
    list = generate_randomx(dataArray.length);
    q(dataArray, list);
});
request.open('GET', dataPath, true); // csvのパスを指定
request.send();
