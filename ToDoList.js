//読み込み完了時に実行する関数を指定
$(loaded);

function loaded() {
    //ボタンタグをクリックしたときの動作を指定
    $("input#inputButton").click(clickButton);
}

function clickButton() {
    saveText();
    showText();
}

function saveText() {
    //ToDoの名前を期間をローカルストレージに保存
    var name = escapeText(("input#formText_name").val());
    var limit = escapeText($("input#formText_limit").val());
    if (checkName(name) != true) {
    }
    else if (checkDate(limit) != true) {
    }
    var todo = [name, limit];
    JSON.stringify(todo);
    localStorage.setItem("todolist", todo);
}

function showText() {
    // すでにある要素を削除する
    var list = $("#list")
    list.children().remove();
    // ローカルストレージに保存された値すべてを要素に追加する
    var key, value, html = [];
    for (var i = 0, len = localStorage.length; i < len; i++) {
        key = localStorage.key(i);
        value = localStorage.getItem(key);
        html.push("<p>" + value + "</p>");
    }
    list.append(html.join(''));
}

// 文字をエスケープする
function escapeText(text) {
    return $("<div>").text(text).html();
}

// 入力チェックを行う
function checkName(text) {
    // 文字数が0または20以上は不可
    if (0 === text.length || 20 < text.length) {
        alert("文字数は1〜20字にしてください");
        return false;
    }

    // すでに入力された値があれば不可
    var length = localStorage.length;
    for (var i = 0; i < length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        // 内容が一致するものがあるか比較
        if (text === value) {
            alert("同じ内容は避けてください");
            return false;
        }
    }

    // すべてのチェックを通過できれば可
    return true;
}

function checkDate(text){
return true;
}