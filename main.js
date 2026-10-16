// ==========================================
// 1. メニュー画面（ドロワー）＆オーバーレイの処理
// ==========================================
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");
const overlay = document.getElementById("overlay");

// メニューボタンを押したとき
menuToggle.addEventListener("click", (event) => {
    sideMenu.classList.toggle("open");
    overlay.classList.toggle("open");
    event.stopPropagation(); // 画面クリックイベントへの連鎖を防ぐ
});

// 暗い背景（オーバーレイ）を押したとき
overlay.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    overlay.classList.remove("open");
});

// メニュー外の画面を押したとき
document.addEventListener("click", (event) => {
    if (sideMenu.classList.contains("open")) {
        if (!sideMenu.contains(event.target)) {
            sideMenu.classList.remove("open");
            overlay.classList.remove("open");
        }
    }
});

// メニューの中にあるリンク（<a>タグ）をすべて取得する
const menuLinks = document.querySelectorAll("#side-menu a");

// リンクのパーツを1つずつループで処理する
menuLinks.forEach(link => {
    // 🌟 リンクがクリックされたら
    link.addEventListener("click", () => {
        // メニューと暗い背景（オーバーレイ）を閉じる（openクラスを外す）
        sideMenu.classList.remove("open");
        overlay.classList.remove("open");
    });
});


// ==========================================
// 2. 画像スライダー（横スライド版）の処理
// ==========================================
// ※画像枚数を数えるためのリスト（名前は何でもOKになりました）
const images = ["img1", "img2", "img3"];
let currentIndex = 0;

// 🌟 画像の代わりに「レール（トラック）」を取得します
const sliderTrack = document.getElementById("slider-track");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const dotsContainer = document.getElementById("dots-container");

// ドットを自動で生成する（ここはそのまま）
images.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
    });
    dotsContainer.appendChild(dot);
});

// 🌟 画面（スライド位置とドット）をまとめて更新する関数
function updateSlider() {
    // レールを左に移動させる（1枚目: 0%, 2枚目: -100%, 3枚目: -200%）
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    // ドットの色を切り替える
    const allDots = document.querySelectorAll(".dot");
    allDots.forEach(dot => dot.classList.remove("active"));
    allDots[currentIndex].classList.add("active");
}

// 画像を1つ次に進める関数（そのまま）
function changeToNextImage() {
    currentIndex++;
    if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    updateSlider();
}

// 次へボタン（そのまま）
nextBtn.addEventListener("click", () => {
    changeToNextImage();
});

// 前へボタン（そのまま）
prevBtn.addEventListener("click", () => {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }
    updateSlider();
});

// 3秒ごとに自動再生（そのまま）
setInterval(changeToNextImage, 7500);

(function() {
    // 【設定】表示したいScratchのプロジェクトIDを入力
    const PROJECT_ID = '1288419285'; 

    const targetContainer = document.getElementById('scratch-project-area');
    if (!targetContainer) return;

    targetContainer.innerHTML = '<p style="color: #86868b; font-size: 14px;">Scratchプロジェクトを読み込み中...</p>';

    // 【対策】CORS制限を回避するため、TurboWarpのプロキシ経由でScratch APIを叩きます
    const PROXY_URL = `https://turbowarp.org{PROJECT_ID}`;

    fetch(PROXY_URL)
        .then(response => {
            if (!response.ok) throw new Error('データが取得できませんでした');
            return response.json();
        })
        .then(data => {
            // プロキシ経由の場合、画像のURL構造が少し変わるため安全に取得します
            const thumbnailUrl = data.images ? data.images['480x360'] : `https://mit.edu{PROJECT_ID}.png`;
            const title = data.title || '無題のプロジェクト';
            const username = data.author ? data.author.username : '不明なユーザー';
            const views = data.stats ? data.stats.views.toLocaleString() : '0';
            const loves = data.stats ? data.stats.loves.toLocaleString() : '0';
            const favorites = data.stats ? data.stats.favorites.toLocaleString() : '0';
            
            targetContainer.innerHTML = `
                <div class="sc-project-card">
                    <div class="sc-thumbnail-container">
                        <a href="https://mit.edu{PROJECT_ID}" target="_blank">
                            <img class="sc-thumbnail" src="${thumbnailUrl}" alt="${title}">
                        </a>
                    </div>
                    <div class="sc-content">
                        <h2 class="sc-title" title="${title}">${title}</h2>
                        <a class="sc-author" href="https://mit.edu{username}" target="_blank">
                            By ${username}
                        </a>
                        <div class="sc-stats">
                            <span>👁️ ${views}</span>
                            <span>❤️ ${loves}</span>
                            <span>⭐ ${favorites}</span>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            targetContainer.innerHTML = `<p style="color: #ff3b30; font-size: 14px;">エラー: プロジェクトを読み込めませんでした。<br><small style="color:#86868b;">(IDが正しいか、プロジェクトが「共有」されているかご確認ください)</small></p>`;
            console.error(error);
        });
})();
