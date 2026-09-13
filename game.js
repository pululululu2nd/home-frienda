// ========================================
// 自宅フレンダ 第1版
// ========================================


// ----------------------------------------
// 自作ポケモンデータ
// ----------------------------------------

const pokemonData = {

  "001": {
    name: "リザードン",
    emoji: "🔥",

    hp: 180,
    attack: 150,
    defense: 120,
    speed: 4,

    type: "ほのお"
  },


  "002": {
    name: "カメックス",
    emoji: "💧",

    hp: 170,
    attack: 140,
    defense: 150,
    speed: 3,

    type: "みず"
  },


  "003": {
    name: "フシギバナ",
    emoji: "🌿",

    hp: 190,
    attack: 135,
    defense: 140,
    speed: 3,

    type: "くさ"
  },


  "004": {
    name: "ピカチュウ",
    emoji: "⚡",

    hp: 120,
    attack: 125,
    defense: 80,
    speed: 5,

    type: "でんき"
  }

};


// ----------------------------------------
// 現在のポケモン
// ----------------------------------------

let currentPokemon = null;

let playerHP = 0;
let enemyHP = 0;

let enemyPokemon = null;


// ----------------------------------------
// HTML要素
// ----------------------------------------

const scannerSection =
  document.getElementById("scanner-section");

const pokemonSection =
  document.getElementById("pokemon-section");

const battleSection =
  document.getElementById("battle-section");


// ----------------------------------------
// QR読み取り成功
// ----------------------------------------

function onScanSuccess(decodedText) {

  console.log("QR:", decodedText);


  /*
   * 今はQRコードの内容を
   * そのままPICK IDとして扱います。
   *
   * 例：
   *
   * 001
   * 002
   * 003
   *
   * 将来的にはフレンダQRの実際の
   * 読み取り結果からIDを抽出します。
   */


  let id = extractPokemonId(decodedText);


  if (!pokemonData[id]) {

    document.getElementById("scan-message").textContent =
      "このQRコードには対応するデータがありません。";

    return;
  }


  currentPokemon = pokemonData[id];

  currentPokemon.id = id;


  showPokemon(currentPokemon);


  stopScanner();
}


// ----------------------------------------
// QRからIDを取り出す
// ----------------------------------------

function extractPokemonId(text) {

  text = text.trim();


  // 001 のような直接入力
  if (pokemonData[text]) {
    return text;
  }


  /*
   * 将来URL形式に対応するための処理。
   *
   * 例：
   * https://example.com/pick/001
   */

  const match =
    text.match(/(\d{3})$/);


  if (match) {
    return match[1];
  }


  return text;
}


// ----------------------------------------
// ポケモン表示
// ----------------------------------------

function showPokemon(pokemon) {

  scannerSection.classList.add("hidden");

  pokemonSection.classList.remove("hidden");

  battleSection.classList.add("hidden");


  document.getElementById("pokemon-name").textContent =
    pokemon.name;

  document.getElementById("pokemon-id").textContent =
    "PICK ID: " + pokemon.id;

  document.getElementById("pokemon-emoji").textContent =
    pokemon.emoji;

  document.getElementById("hp").textContent =
    pokemon.hp;

  document.getElementById("attack").textContent =
    pokemon.attack;

  document.getElementById("defense").textContent =
    pokemon.defense;

  document.getElementById("speed").textContent =
    pokemon.speed;
}


// ----------------------------------------
// バトル開始
// ----------------------------------------

document
  .getElementById("battle-button")
  .addEventListener("click", startBattle);


function startBattle() {

  pokemonSection.classList.add("hidden");

  battleSection.classList.remove("hidden");


  // プレイヤー
  playerHP = currentPokemon.hp;


  // CPUポケモンをランダム選択
  const enemyIds =
    Object.keys(pokemonData)
      .filter(id => id !== currentPokemon.id);


  const randomId =
    enemyIds[
      Math.floor(Math.random() * enemyIds.length)
    ];


  enemyPokemon =
    pokemonData[randomId];


  enemyHP =
    enemyPokemon.hp;


  // 表示
  document.getElementById("player-emoji").textContent =
    currentPokemon.emoji;

  document.getElementById("player-name").textContent =
    currentPokemon.name;

  document.getElementById("enemy-emoji").textContent =
    enemyPokemon.emoji;

  document.getElementById("enemy-name").textContent =
    enemyPokemon.name;


  updateHP();


  document.getElementById("battle-log").textContent =
    `${currentPokemon.name}が現れた！`;


  document.getElementById("attack-button").disabled =
    false;
}


// ----------------------------------------
// 攻撃
// ----------------------------------------

document
  .getElementById("attack-button")
  .addEventListener("click", playerAttack);


function playerAttack() {

  if (enemyHP <= 0 || playerHP <= 0) {
    return;
  }


  /*
   * 仮のダメージ計算。
   *
   * 後でフレンダ風の計算式に変更します。
   */

  const damage =
    Math.max(
      10,
      Math.floor(
        currentPokemon.attack * 0.5
        - enemyPokemon.defense * 0.2
        + Math.random() * 20
      )
    );


  enemyHP -= damage;


  if (enemyHP < 0) {
    enemyHP = 0;
  }


  updateHP();


  document.getElementById("battle-log").textContent =
    `${currentPokemon.name}のこうげき！ ${damage}ダメージ！`;


  if (enemyHP <= 0) {

    endBattle(true);

    return;
  }


  // 少し待ってCPU攻撃
  setTimeout(enemyAttack, 700);
}


// ----------------------------------------
// CPU攻撃
// ----------------------------------------

function enemyAttack() {

  if (playerHP <= 0) {
    return;
  }


  const damage =
    Math.max(
      8,
      Math.floor(
        enemyPokemon.attack * 0.45
        - currentPokemon.defense * 0.2
        + Math.random() * 15
      )
    );


  playerHP -= damage;


  if (playerHP < 0) {
    playerHP = 0;
  }


  updateHP();


  document.getElementById("battle-log").textContent =
    `${enemyPokemon.name}のこうげき！ ${damage}ダメージ！`;


  if (playerHP <= 0) {

    endBattle(false);
  }
}


// ----------------------------------------
// HP表示
// ----------------------------------------

function updateHP() {

  document.getElementById("player-hp").textContent =
    playerHP;

  document.getElementById("enemy-hp").textContent =
    enemyHP;


  const playerPercent =
    (playerHP / currentPokemon.hp) * 100;


  const enemyPercent =
    (enemyHP / enemyPokemon.hp) * 100;


  document.getElementById("player-hp-bar").style.width =
    playerPercent + "%";


  document.getElementById("enemy-hp-bar").style.width =
    enemyPercent + "%";
}


// ----------------------------------------
// バトル終了
// ----------------------------------------

function endBattle(playerWon) {

  document.getElementById("attack-button").disabled =
    true;


  if (playerWon) {

    document.getElementById("battle-log").textContent =
      `🎉 ${currentPokemon.name}の勝利！`;

  } else {

    document.getElementById("battle-log").textContent =
      `💥 ${currentPokemon.name}は倒れてしまった！`;

  }
}


// ----------------------------------------
// スキャンし直す
// ----------------------------------------

document
  .getElementById("scan-again-button")
  .addEventListener("click", () => {

    pokemonSection.classList.add("hidden");

    scannerSection.classList.remove("hidden");

    startScanner();

  });


// ----------------------------------------
// 戻る
// ----------------------------------------

document
  .getElementById("back-button")
  .addEventListener("click", () => {

    battleSection.classList.add("hidden");

    pokemonSection.classList.remove("hidden");

  });


// ----------------------------------------
// QRスキャナー
// ----------------------------------------

let qrScanner = null;


function startScanner() {

  if (qrScanner) {
    return;
  }


  qrScanner =
    new Html5Qrcode("reader");


  qrScanner
    .start(
      {
        facingMode: "environment"
      },
      {
        fps: 10,

        qrbox: {
          width: 250,
          height: 250
        }
      },

      onScanSuccess,

      () => {
        // 読み取り失敗は無視
      }

    )
    .catch(error => {

      console.error(error);

      document.getElementById(
        "scan-message"
      ).textContent =
        "カメラを起動できませんでした。";

    });
}


// ----------------------------------------
// QRスキャナー停止
// ----------------------------------------

function stopScanner() {

  if (!qrScanner) {
    return;
  }


  qrScanner
    .stop()
    .then(() => {

      qrScanner.clear();

      qrScanner = null;

    })
    .catch(error => {

      console.error(error);

    });
}


// ----------------------------------------
// 起動
// ----------------------------------------

window.addEventListener(
  "load",
  () => {

    startScanner();

  }
);