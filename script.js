let worldCupData = []; // JSON မှ ဒေတာများကို သိမ်းဆည်းမည့် Array
let currentFixtureIndex = 0;

// 🔊 အသံဖိုင် လမ်းကြောင်း သတ်မှတ်ခြင်း
const clickSound = new Audio('assets/audio/click.mp3');

// အသံကို နှိပ်လိုက်တိုင်း ကွက်တိ ထွက်စေရန် လုပ်ဆောင်သည့် Function
function playClickSound() {
    clickSound.currentTime = 0; // အသံကို အစကနေ ပြန်စရန် (ခလုတ်အမြန်နှိပ်ရင်လည်း အသံမထစ်စေရန်)
    clickSound.play().catch(error => console.log("အသံဖိုင် ဖွင့်မရပါ ဆရာ-", error));
}

// 📥 ၁။ JSON ဖိုင်အား လှမ်းဖတ်ခြင်း (Fetch Data)
async function fetchWorldCupData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        worldCupData = await response.json();
        initTabs();
    } catch (error) {
        console.error("JSON ဖတ်ရတာ အဆင်မပြေပါဘူး ဆရာ။ ဖိုင်အမည်နှင့် လမ်းကြောင်းကို ပြန်စစ်ပေးပါ-", error);
    }
}

// 🎛️ ၂။ အပေါ်ဆုံး ပွဲစဉ်တက်ဘ် (Fixture Tabs) များ တည်ဆောက်ခြင်း
function initTabs() {
    const tabsContainer = document.getElementById('fixture-tabs-container');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = "";
    worldCupData.forEach((match, index) => {
        const btn = document.createElement('button');
        btn.className = `fix-tab-btn ${index === 0 ? 'active' : ''}`;
        btn.innerText = match.tabName;
        
        // ပွဲစဉ်ခလုတ်ကို နှိပ်လျှင် အလုပ်လုပ်မည့်အပြင် အသံပါထွက်စေရန် တွဲပေးထားသည်
        btn.onclick = () => {
            playClickSound();
            switchFixture(index);
        };
        tabsContainer.appendChild(btn);
    });

    loadFixtureData(currentFixtureIndex);
}

// 🔄 ၃။ အပေါ်ဆုံး ပွဲစဉ်ခလုတ် နှိပ်လိုက်လျှင် ပြောင်းလဲခြင်း
function switchFixture(index) {
    currentFixtureIndex = index;
    const buttons = document.querySelectorAll('.fix-tab-btn');
    buttons.forEach((btn, i) => {
        if (i === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    loadFixtureData(index);
    switchCardView(1); 
}

// 📊 ၄။ ရွေးချယ်ထားသော ပွဲစဉ်ဒေတာများကို HTML ထဲသို့ ထည့်သွင်းခြင်း
function loadFixtureData(index) {
    const data = worldCupData[index];
    if (!data) return;

    document.getElementById('card-stage').innerText = data.stage;

    // --- CARD 1: MATCHUP DATA ---
    document.getElementById('flag-a').src = data.teamA.flag;
    document.getElementById('flag-b').src = data.teamB.flag;
    document.getElementById('name-a').innerText = data.teamA.name;
    document.getElementById('name-b').innerText = data.teamB.name;

    // --- CARD 2: GROUP STAGE RESULTS DATA ---
    document.getElementById('res-name-a').innerText = data.teamA.name;
    document.getElementById('res-name-b').innerText = data.teamB.name;
    document.getElementById('res-text-a').innerText = data.groupResults.teamA;
    document.getElementById('res-text-b').innerText = data.groupResults.teamB;

    // --- CARD 3: TACTICAL FORMATION GENERATOR ---
    const fData = data.formations;
    document.getElementById('badge-team-a').innerText = `${data.teamA.name} ${fData.teamAName}`;
    document.getElementById('badge-team-b').innerText = `${data.teamB.name} ${fData.teamBName}`;

    const rowsTeamA = document.getElementById('rows-team-a');
    rowsTeamA.innerHTML = "";
    fData.teamALineup.forEach(count => {
        const rowDiv = document.createElement('div');
        rowDiv.className = "player-row";
        for (let i = 0; i < count; i++) {
            const player = document.createElement('div');
            player.className = "player-icon";
            rowDiv.appendChild(player);
        }
        rowsTeamA.appendChild(rowDiv);
    });

    const rowsTeamB = document.getElementById('rows-team-b');
    rowsTeamB.innerHTML = "";
    fData.teamBLineup.forEach(count => {
        const rowDiv = document.createElement('div');
        rowDiv.className = "player-row";
        for (let i = 0; i < count; i++) {
            const player = document.createElement('div');
            player.className = "player-icon";
            rowDiv.appendChild(player);
        }
        rowsTeamB.appendChild(rowDiv);
    });

    // --- CARD 4: WIN PROBABILITY DATA ---
    const barA = document.getElementById('bar-a');
    const barDraw = document.getElementById('bar-draw');
    const barB = document.getElementById('bar-b');

    barA.style.width = `${data.winPercentage.teamA}%`;
    barA.innerText = `${data.winPercentage.teamA}%`;
    
    barDraw.style.width = `${data.winPercentage.draw}%`;
    barDraw.innerText = `${data.winPercentage.draw}%`;
    
    barB.style.width = `${data.winPercentage.teamB}%`;
    barB.innerText = `${data.winPercentage.teamB}%`;

    document.getElementById('label-name-a').innerText = data.teamA.name.toUpperCase();
    document.getElementById('label-name-b').innerText = data.teamB.name.toUpperCase();

    // --- CARD 5: PREDICTED SCORERS DATA ---
    document.getElementById('scorer-text').innerText = data.scorers;
}

// 🧭 ၅။ အောက်ခြေ ကတ်ပြားတက်ဘ် (၁ မှ ၅) သို့ ကူးပြောင်းခြင်း
function switchCardView(viewNumber) {
    // အောက်ခြေခလုတ်တွေကို နှိပ်တဲ့အခါမှာလည်း အသံထွက်စေရန် ထည့်သွင်းထားသည်
    playClickSound();

    const views = document.querySelectorAll('.card-view');
    views.forEach((view, i) => {
        if ((i + 1) === viewNumber) view.classList.add('active');
        else view.classList.remove('active');
    });

    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach((btn, i) => {
        if ((i + 1) === viewNumber) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

// 🚀 Browser စတင်ပတ်သည်နှင့် JSON ဒေတာကို အရင်ဆုံးဆွဲဖတ်ရန် ခေါ်ယူခြင်း
window.onload = fetchWorldCupData;

