// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded }
    from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

// Your web app's Firebase configuration

//const firebaseConfig = 
 
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // RealtimeDBに接続
const dbRef = ref(db, "chat"); // RealtimeDB内の"chat"を使う

// 日本時間でのタイムスタンプを生成
function getJSTTimestamp() {
    const now = new Date();
    return now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// データ登録 (Click)
$("#send").on('click', function(){
    const uname = $('#uname').val();
    const gender = $('#gender').val();
    const age = $('#age').val();
    const selectedSymptoms = [];
    const freeText = $('#free-text').val();
    const timestamp = getJSTTimestamp(); // 日本時間のタイムスタンプを取得

    $('input[name="symptom"]:checked').each(function() {
        selectedSymptoms.push($(this).val());
    });

    const msg = {
        uname: uname,
        gender: gender,
        age: age,
        symptoms: selectedSymptoms.join(', '),
        freeText: freeText,
        timestamp: timestamp // タイムスタンプを追加
    };

    const newPostRef = push(dbRef);
    set(newPostRef, msg);

    $('#uname').val("");
    $('#gender').val("");
    $('#age').val("");
    $('input[name="symptom"]').prop('checked', false);
    $('#free-text').val("");
});

// データ取得
onChildAdded(dbRef, function(data){
    const msg = data.val();
    let html = `
        <div class="msg">
            <p>名前: ${msg.uname}</p>
            <p>性別: ${msg.gender}</p>
            <p>年代: ${msg.age}</p>
            <p>症状: ${msg.symptoms}</p>
            <p>質問: ${msg.freeText}</p>
            <p>タイムスタンプ: ${msg.timestamp}</p>
        </div>
    `;
    $("#output").append(html);
});
