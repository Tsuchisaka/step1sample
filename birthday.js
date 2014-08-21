function getBirthday () {
  var year = document.getElementById("year").value;
  var month = document.getElementById("month").value;
  var day = document.getElementById("day").value;

  return new Date(year, month - 1, day);
}

function getDateDiff(previous, latest) {
  var diff = latest.getTime() - previous.getTime();

  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -=  days * (1000 * 60 * 60 * 24);
  var hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  var mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);
  var seconds = Math.floor(diff / (1000));
  diff -= seconds * (1000);

  return {days:days, hours:hours, mins:mins, seconds:seconds};
}

function calculateBirthday() {
  var now = new Date();
  var birth = getBirthday();

  var diff = getDateDiff(birth, now);
  var message = "あなたが生まれてから" + diff.days + "日経過しました。";

  var result = document.getElementById("result");
  result.textContent = message;
  result.style.display = "";
}