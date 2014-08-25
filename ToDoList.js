//読み込み完了時に実行する関数を指定
$(loaded);

function loaded() {
    //ボタンタグをクリックしたときの動作を指定
    $("input#inputButton").click(click_inputButton);
	$("input#resetButton").click(click_resetButton);
	showText();
}

function click_inputButton() {
    saveText();
    showText();
}

function click_resetButton(){
	localStorage.clear();
	console.log("ResetButton clicked.");
	showText();
}

function saveText() {
    //ToDoの名前を期間をローカルストレージに保存
    var name = $("input#formText_name");
    var limit = $("input#formText_limit");
	name.val(escapeText(name.val()));
	limit.val(escapeText(limit.val()));
    if (checkName(name.val()) != true) {
		return;
    }
    else if (checkDate(limit.val()) != true) {
		return;
    }
    var todo = [name.val(), limit.val()];
	console.log(todo);
    todo = JSON.stringify(todo);
	console.log(todo);
    localStorage.setItem(getToDoListKey(), todo);
}

function getToDoListKey(){
	return localStorage.length;
}

function showText() {
    // すでにある要素を削除する
    var list = $("#list");
    list.children().remove();
    // ローカルストレージに保存された値すべてを要素に追加する
    var key, value, html = [];
    for (var i = 0, len = localStorage.length; i < len; i++) {
        key = localStorage.key(i);
        value = localStorage.getItem(key);
        writeToDoListForm(value);
    }
    list.append(html.join(''));
}

function writeToDoListForm(text){
	var line = text;
	var list = $("#list");
	console.log(line);
	line = JSON.parse(line);
	console.log(line);
	var limit = line[1].split("/");
	var html = [];
	html.push('<div id="ListElement"><h1>' + line[0] +'</h1>\n');
    html.push('<table>\n');
	html.push('<tr>\n');
    html.push('<td>期限：</td><td>' + limit[0] + '年' + limit[1] + '月' + limit[2] + '日' + '</td>\n');
	html.push('<td rowspan=2><input type="button" value="未完了" id="completeButton" class="button2"></td>');
	html.push('</tr>\n');
	html.push('<tr>\n');
    html.push('<td>作成日：</td><td>' + limit[0] + '年' + limit[1] + '月' + limit[2] + '日' + '</td>\n');
	html.push('</tr>\n');
    html.push('</table>\n');
    html.push('</div>\n');
	list.append(html.join(''));
}

// 文字をエスケープする
function escapeText(text) {
    return $("<div>").text(text).html();
}

// 入力チェックを行う
function checkName(text) {
    // 文字数が0または30以上は不可
    if (0 === text.length || 30 < text.length) {
        alert("文字数は1〜20字にしてください");
		console.log("checkName error");
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
	//textの半角スラッシュを全角スラッシュに置き換える
	var str = text.replace(/\u002f/g, "\uff0f");
	
	// 文字数が0または30以上は不可
    if (0 === str.length || 30 < str.length) {
        alert("文字数は1〜20字にしてください");
        return false;
    }
	
	console.log(str);
	// 文字が日付でなければ不可
	if(str.match(/^[0-9]?[0-9]?[0-9]?[0-9]\uff0f[01]?[0-9]\uff0f[0-3]?[0-9]$/)){
		
	}else{
		alert("おかしな日付です");
		return false;
	}
	return true;
}