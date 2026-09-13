// ========================================
// 自宅フレンダ
// 方法①：手動選択版
// ========================================


// ========================================
// ポケモンデータ
// ========================================

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

  },


  "005": {

    name: "レックウザ",

    emoji: "🐉",

    hp: 200,

    attack: 180,

    defense: 140,

    speed: 5,

    type: "ドラゴン"

  }

};


// ========================================
// 現在の状態
// ========================================

let currentPokemon = null;

let enemyPokemon = null;

let playerHP = 0;

let enemyHP = 0;


// ========================================
// HTML要素
// ========================================

const selectSection =
  document.getElementById(
    "select-section"
  );


const pokemonSection =
  document.getElementById(
    "pokemon-section"
  );


const battleSection =
  document.getElementById(
    "battle-section"
  );


const pokemonList =
  document.getElementById(
    "pokemon-list"
  );


// ========================================
// ポケモン一覧を作る
// ========================================

function createPokemonList() {

  pokemonList.innerHTML = "";


  for (
    const id in pokemonData
  ) {

    const pokemon =
      pokemonData[id];


    const card =
      document.createElement(
        "div"
      );


    card.className =
      "pokemon-card";


    card.innerHTML = `

      <div class="emoji">
        ${pokemon.emoji}
      </div>

      <div class="name">
        ${pokemon.name}
      </div>

      <div class="pick-id">
        PICK ID: ${id}
      </div>

    `;


    card.addEventListener(
      "click",
      () => {

        selectPokemon(
          id
        );

      }
    );


    pokemonList.appendChild(
      card
    );
  }
}


// ========================================
// ポケモン選択
// ========================================

function selectPokemon(id) {

  currentPokemon =
    pokemonData[id];


  currentPokemon.id =
    id;


  showPokemon();

}


// ========================================
// ポケモン詳細表示
// ========================================

function showPokemon() {

  selectSection.classList.add(
    "hidden"
  );


  pokemonSection.classList.remove(
    "hidden"
  );


  battleSection.classList.add(
    "hidden"
  );


  document.getElementById(
    "pokemon-emoji"
  ).textContent =
    currentPokemon.emoji;


  document.getElementById(
    "pokemon-name"
  ).textContent =
    currentPokemon.name;


  document.getElementById(
    "pokemon-id"
  ).textContent =
    "PICK ID: " +
    currentPokemon.id;


  document.getElementById(
    "pokemon-type"
  ).textContent =
    currentPokemon.type;


  document.getElementById(
    "hp"
  ).textContent =
    currentPokemon.hp;


  document.getElementById(
    "attack"
  ).textContent =
    currentPokemon.attack;


  document.getElementById(
    "defense"
  ).textContent =
    currentPokemon.defense;


  document.getElementById(
    "speed"
  ).textContent =
    currentPokemon.speed;
}


// ========================================
// バトル開始
// ========================================

document
  .getElementById(
    "battle-button"
  )
  .addEventListener(
    "click",
    startBattle
  );


function startBattle() {

  pokemonSection.classList.add(
    "hidden"
  );


  battleSection.classList.remove(
    "hidden"
  );


  // プレイヤーHP
  playerHP =
    currentPokemon.hp;


  // CPUの候補
  const enemyIds =
    Object.keys(
      pokemonData
    ).filter(
      id =>
        id !==
        currentPokemon.id
    );


  // ランダムでCPUを選ぶ
  const randomIndex =
    Math.floor(
      Math.random() *
      enemyIds.length
    );


  const enemyId =
    enemyIds[randomIndex];


  enemyPokemon =
    pokemonData[enemyId];


  enemyHP =
    enemyPokemon.hp;


  // 表示
  document.getElementById(
    "player-emoji"
  ).textContent =
    currentPokemon.emoji;


  document.getElementById(
    "player-name"
  ).textContent =
    currentPokemon.name;


  document.getElementById(
    "player-max-hp"
  ).textContent =
    currentPokemon.hp;


  document.getElementById(
    "enemy-emoji"
  ).textContent =
    enemyPokemon.emoji;


  document.getElementById(
    "enemy-name"
  ).textContent =
    enemyPokemon.name;


  document.getElementById(
    "enemy-max-hp"
  ).textContent =
    enemyPokemon.hp;


  document.getElementById(
    "attack-button"
  ).disabled =
    false;


  updateHP();


  document.getElementById(
    "battle-log"
  ).textContent =
    `${currentPokemon.name}が現れた！`;
}


// ========================================
// プレイヤー攻撃
// ========================================

document
  .getElementById(
    "attack-button"
  )
  .addEventListener(
    "click",
    playerAttack
  );


function playerAttack() {

  if (
    playerHP <= 0 ||
    enemyHP <= 0
  ) {

    return;

  }


  /*
   * 現在は仮のダメージ計算。
   *
   * 後で、
   * タイプ相性・技・クリティカル等を
   * 追加します。
   */

  const damage =
    Math.max(
      10,

      Math.floor(

        currentPokemon.attack *
        0.5

        -

        enemyPokemon.defense *
        0.2

        +

        Math.random() * 20

      )
    );


  enemyHP -=
    damage;


  if (
    enemyHP < 0
  ) {

    enemyHP = 0;

  }


  updateHP();


  document.getElementById(
    "battle-log"
  ).textContent =
    `${currentPokemon.name}のこうげき！ ${damage}ダメージ！`;


  if (
    enemyHP <= 0
  ) {

    endBattle(true);

    return;

  }


  // CPUのターン
  setTimeout(
    enemyAttack,
    700
  );
}


// ========================================
// CPU攻撃
// ========================================

function enemyAttack() {

  if (
    playerHP <= 0
  ) {

    return;

  }


  const damage =
    Math.max(
      8,

      Math.floor(

        enemyPokemon.attack *
        0.45

        -

        currentPokemon.defense *
        0.2

        +

        Math.random() * 15

      )
    );


  playerHP -=
    damage;


  if (
    playerHP < 0
  ) {

    playerHP = 0;

  }


  updateHP();


  document.getElementById(
    "battle-log"
  ).textContent =
    `${enemyPokemon.name}のこうげき！ ${damage}ダメージ！`;


  if (
    playerHP <= 0
  ) {

    endBattle(false);

  }
}


// ========================================
// HP更新
// ========================================

function updateHP() {

  document.getElementById(
    "player-hp"
  ).textContent =
    playerHP;


  document.getElementById(
    "enemy-hp"
  ).textContent =
    enemyHP;


  const playerPercent =
    Math.max(
      0,
      (playerHP /
       currentPokemon.hp) *
      100
    );


  const enemyPercent =
    Math.max(
      0,
      (enemyHP /
       enemyPokemon.hp) *
      100
    );


  document.getElementById(
    "player-hp-bar"
  ).style.width =
    playerPercent + "%";


  document.getElementById(
    "enemy-hp-bar"
  ).style.width =
    enemyPercent + "%";
}


// ========================================
// バトル終了
// ========================================

function endBattle(
  playerWon
) {

  document.getElementById(
    "attack-button"
  ).disabled =
    true;


  if (
    playerWon
  ) {

    document.getElementById(
      "battle-log"
    ).textContent =
      `🎉 ${currentPokemon.name}の勝利！`;

  }

  else {

    document.getElementById(
      "battle-log"
    ).textContent =
      `💥 ${currentPokemon.name}は倒れてしまった！`;

  }
}


// ========================================
// ポケモン変更
// ========================================

document
  .getElementById(
    "change-button"
  )
  .addEventListener(
    "click",
    showSelectScreen
  );


document
  .getElementById(
    "back-to-select"
  )
  .addEventListener(
    "click",
    showSelectScreen
  );


function showSelectScreen() {

  battleSection.classList.add(
    "hidden"
  );


  pokemonSection.classList.add(
    "hidden"
  );


  selectSection.classList.remove(
    "hidden"
  );
}


// ========================================
// ゲーム起動
// ========================================

createPokemonList();