//読み込み完了時に実行する関数を指定
$(loaded);

function loaded() {
    //ボタンタグをクリックしたときの動作を指定
    $("input#inputButton").click(click_inputButton);
	$("input#resetButton").click(click_resetButton);
	oneSecClock();
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

function click_completeButton(buttonID){
	console.log("ID=" + buttonID);
	var button = $("input#" + buttonID);
	if(button.val() === "未完了"){
		button.val("完了");
	}else{
		button.val("未完了");
	}
}

function saveText() {
    //ToDoの名前を期間をローカルストレージに保存
    var name = $("input#formText_name");
    var limit = $("input#formText_limit");
	name.val(escapeText(name.val()));
	limit.val(escapeText(limit.val()));
	var check = true;
    if (checkName(name.val()) != true) {
		check = false;
    }
    if (checkLimit(limit.val()) != true) {
		check = false;
    }
	if(check == false)return;
	var date = new Date();
	var datestring = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getHours() + "/" + date.getMinutes() + "/" + date.getSeconds();
    var todo = [name.val(), limit.val(), datestring, "未完了"];
	console.log(todo);
    todo = JSON.stringify(todo);
	console.log(todo);
    localStorage.setItem(getToDoListKey(), todo);
	name.val("");
	limit.val("");
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
		console.log(key + " : " + value);
        //writeToDoListForm(value);
    }
	for (var i = localStorage.length - 1; i >= 0; i--) {
		key = i;
        value = localStorage.getItem(key);
		console.log(key + " : " + value);
        writeToDoListForm(value);
    }
	
	if(localStorage.length <= 0){
		html.push('<p class = "error0">ToDoが作成されていません。</p>');
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
	var inputday = line[2].split("/");
	var html = [];
	var id = "completeButton/" + line[2];
	id = id.replace(/\u002f/g, "\uff0f");
	html.push('<div id="ListElement">\n');
    html.push('<table class="table">\n');
	html.push('<colgroup>\n');
	html.push('<col style="width:60px;">');
	html.push('<col style="width:350px;>');
	html.push('<col style="width:100px;>');
	html.push('</colgroup>\n');
	html.push('<tr>\n');
	html.push('<td colspan = 2 class = "TodoName">' + line[0] + '</td>');
	var num = 2;
	if(line[3]=="完了")num = 3;
	html.push('<td rowspan=3><input type="button" value="' + line[3] + '" id="' + id + '" class="button' + num + '"></td>');
	html.push('</tr>\n');
	html.push('<tr>\n');
    html.push('<td class="Dates">期限：</td><td>' + limit[0] + '年' + limit[1] + '月' + limit[2] + '日' + '</td>\n');
	html.push('</tr>\n');
	html.push('<tr>\n');
    html.push('<td class = "Dates">作成日：</td><td>' + inputday[0] + '年' + inputday[1] + '月' + inputday[2] + '日' + '</td>\n');
	html.push('</tr>\n');
    html.push('</table>\n');
    html.push('</div>\n');
	list.append(html.join(''));
	console.log("ID=" + id);
	var button = document.getElementById(id);
	console.log(button.value);
	button.onclick = function(){
		var key, value;
		for (var i = 0, len = localStorage.length; i < len; i++) {
			key = localStorage.key(i);
			value = JSON.parse(localStorage.getItem(key));
			if(("completeButton/" + value[2]) == id){
				break;
			}
		}
		console.log("完了ボタン clicked.");
		if(button.value == "未完了"){
			button.value = "完了"; 
			button.className = "button3";
		}else{
			button.value = "未完了";
			button.className = "button2";
		}
		value[3] = button.value;
		value = JSON.stringify(value);
		localStorage.setItem(key,value);
	}
}

// 文字をエスケープする
function escapeText(text) {
    return $("<div>").text(text).html();
}

// 入力チェックを行う
function checkName(text) {
	console.log("checkName()");
    // 文字数が0または50以上は不可
	var error1 = $("#error1");
	var html = [];
	error1.children().remove();
    if (0 === text.length || 50 < text.length) {
		html.push('<p class="error">ToDo名は1～50文字の範囲で入力してください。</p>');
		error1.append(html.join(''));
		console.log("checkName error");
        return false;
    }

    // すでに入力された値があれば不可
    var length = localStorage.length;
    for (var i = 0; i < length; i++) {
        var key = localStorage.key(i);
        var value = JSON.parse(localStorage.getItem(key));
		console.log(text + " - " + value[0]);
        // 内容が一致するものがあるか比較
        if (text === value[0]) {
            html.push('<p class="error">そのToDo名は既に使用されています。</p>');
			error1.append(html.join(''));
            return false;
        }
    }

    // すべてのチェックを通過できれば可
    return true;
}

function checkLimit(text){
	console.log("checkLimit()");
	var error2 = $("#error2");
	var html = [];
	error2.children().remove();
	//textの半角スラッシュを全角スラッシュに置き換える
	var str = text.replace(/\u002f/g, "\uff0f");
	
	// 文字数が0または50以上は不可
    if (0 === str.length || 50 < str.length) {
        html.push('<p class="error">期限は1～50文字の範囲で入力してください。</p>');
		error2.append(html.join(''));
        return false;
    }
	
	console.log(str);
	// 文字が日付でなければ不可
	if(str.match(/^[0-9]?[0-9]?[0-9]?[0-9]\uff0f[01]?[0-9]\uff0f[0-3]?[0-9]$/)){
		console.log(str + "は日付でした");
		//日付をチェックする
		var date = text.split("/");
		var result = checkDate(date[0],date[1],date[2]);
		console.log("checkDate(" + date[0] + ", " + date[1] + ", " + date[2] + ") = " + result);
		if(result < 0){
			//過去の日付であれば不可
			console.log("result = -1");
			html.push('<p class="error">過去の日付です。</p>');
			error2.append(html.join(''));
			return false;
		}else if(result > 0){
			//存在しない日付であれば不可
			console.log("result = 1");
			html.push('<p class="error">存在しない日付です。</p>');
			error2.append(html.join(''));
			return false;
		}
		console.log("result = 0");
	}else{
		console.log(str + "は日付ではありませんでした。");
		html.push('<p class="error">yyyy/mm/ddの形式で入力してください。</p>');
		error2.append(html.join(''));
		return false;
	}
	return true;
}

function checkDate(year, month, day){
	console.log("checkDate()に入りました。");
	console.log("入力された値は" + year + ", " + month + ", " + day + "でした。");
	var now = new Date();
	var nowY = now.getFullYear();
	var nowM = now.getMonth() + 1;
	var nowD = now.getDate();
	var lastday = 31;
	
	if(month == 2){
		console.log("2月の最終日を計算します。");
		lastday = 28 + Math.floor(1 / (year % 4 + 1)) * (1 - Math.floor(1 / (year % 100 + 1))) + Math.floor(1 / (year % 400 + 1));
	}else if((month < 8 && month %2 == 1) || (month >= 8 && month %2 == 0)){
		console.log(month + "月の最終日は31日です。");
		lastday = 31;
	}else{
		console.log(month + "月の最終日は30日です。")
		lastday = 30;
	}
	//存在しない日付であれば1を返す
	if(month <= 0 || month > 12) return 1;
	if(day <= 0 || day > lastday) return 1;
	
	if(year < nowY || (year == nowY && month < nowM) || (year == nowY && month == nowM && day < nowD)){
		return -1;
	}
	
	return 0;
}

//1秒ごとに呼び出される関数
function oneSecClock(){
	showNowTime();
}

function showNowTime(){
	var nowTime = $("div#nowTime");
	nowTime.children().remove();
	var date = new Date();
	var datestring = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var html = [];
	html.push('<p class="center">' + datestring + '</p>');
	nowTime.append(html.join(''));
}

