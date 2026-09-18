// ===== 当選番号の設定 =====
// 番号はすべて5桁で、digits は「下何桁を照合するか」。
const LOTTERY = {
  round: "第2回",
  drawDate: "11月◯日 抽選済",
  prizes: [
    { rank: 4, prize: "タレ増量", digits: 1, numbers: ["7"] },
    { rank: 3, prize: "50円引き", digits: 2, numbers: ["38", "61"] },
    { rank: 2, prize: "トッピング無料", digits: 3, numbers: ["184", "540", "329", "756", "091"] },
    { rank: 1, prize: "100円引き", digits: 3, numbers: ["402", "915", "263"] },
  ],
};

const TOTAL_DIGITS = 5;

// 番号1つ分の表示（照合しない上の桁は「－」）
function numberHTML(num) {
  const skip = TOTAL_DIGITS - num.length;
  let html = '<div class="num">';
  for (let i = 0; i < skip; i++) html += '<span class="skip">－</span>';
  for (const d of num) html += `<span data-digit="${d}">${d}</span>`;
  return html + "</div>";
}

function coverSlide() {
  return `
    <section class="slide cover">
      <div class="round">${LOTTERY.round}</div>
      <h1>焼き鳥くじ<br>当選番号発表</h1>
      <div class="date">${LOTTERY.drawDate}</div>
      <p class="lead">お手元のくじ券の番号と<br>ご照合ください</p>
      <div class="hint">↓ スワイプ</div>
    </section>`;
}

function prizeSlide(p) {
  const list = p.numbers.map(numberHTML).join("");
  const head = `
      <div class="rank">${p.rank}等</div>
      <div class="prize">${p.prize}</div>
      <div class="cond">下${p.digits}桁が次の番号の方</div>`;

  // 1等だけはタップで発表する
  if (p.rank === 1) {
    return `
    <section class="slide rank-1">
      <div class="rank" style="color: var(--gold)">1等</div>
      <p class="teaser" id="teaser">いよいよ1等の発表です</p>
      <button class="btn reveal-btn" id="reveal">タップして発表</button>
      <div id="rank1-body" hidden>
        <div class="prize">${p.prize}</div>
        <div class="cond">下${p.digits}桁が次の番号の方</div>
        <div class="numbers">${list}</div>
        <div class="congrats" id="congrats">おめでとうございます！</div>
      </div>
      <div class="hint">↓ スワイプ</div>
    </section>`;
  }
  return `
    <section class="slide rank-${p.rank}">
      ${head}
      <div class="numbers">${list}</div>
      <div class="hint">↓ スワイプ</div>
    </section>`;
}

function closingSlide() {
  return `
    <section class="slide closing">
      <h2>当選された方へ</h2>
      <div class="board">
        <ul>
          <li>くじ券を店頭のスタッフにお渡しください</li>
          <li>券1枚につき1回、ご利用いただけます</li>
          <li>他の割引との併用はできません</li>
        </ul>
      </div>
      <div class="links">
        <a class="btn" href="menu.html">メニューを見る</a>
        <a class="btn secondary" href="index.html">サイトトップへ</a>
      </div>
    </section>`;
}

// 1等の数字をスロットのように回してから順に止める
function reveal() {
  document.getElementById("teaser").hidden = true;
  document.getElementById("reveal").hidden = true;
  const body = document.getElementById("rank1-body");
  body.hidden = false;

  const rows = [...body.querySelectorAll(".num")];
  rows.forEach((row, i) => {
    const cells = [...row.querySelectorAll("span[data-digit]")];
    const timer = setInterval(() => {
      cells.forEach((c) => (c.textContent = Math.floor(Math.random() * 10)));
    }, 60);
    // 1行ずつ間を空けて確定させる
    setTimeout(() => {
      clearInterval(timer);
      cells.forEach((c) => (c.textContent = c.dataset.digit));
      if (i === rows.length - 1) document.getElementById("congrats").classList.add("show");
    }, 1200 + i * 700);
  });
}

// 下の等級から順に並べる
const prizesLowToHigh = [...LOTTERY.prizes].sort((a, b) => b.rank - a.rank);
document.getElementById("slides").innerHTML =
  coverSlide() + prizesLowToHigh.map(prizeSlide).join("") + closingSlide();
document.getElementById("reveal").addEventListener("click", reveal);
