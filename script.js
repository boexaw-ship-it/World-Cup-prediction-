let worldCupData = []; // JSON မှ ဒေတာများကို သိမ်းဆည်းမည့် Array
let currentFixtureIndex = 0;

// 📥 ၁။ JSON ဖိုင်အား လှမ်းဖတ်ခြင်း (Fetch Data)
async function fetchWorldCupData() {
    try {
        // data.json ဖိုင်ထံမှ ဒေတာ တောင်းယူခြင်း
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        worldCupData = await response.json();
        
        // ဒေတာ အောင်မြင်စွာရရှိပြီးမှ အပေါ်ဆုံး တက်ဘ်များကို စတင်ဖန်တီးခြင်း
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
        // ပထမဆုံးပွဲစဉ်ကို Active (အနီရောင်လင်းပဟေဠိ) အဖြစ် သတ်မှတ်ခြင်း
        btn.className = `fix-tab-btn ${index === 0 ? 'active' : ''}`;
        btn.innerText = match.tabName;
        btn.onclick = () => switchFixture(index);
        tabsContainer.appendChild(btn);
    });

    // ပထမဆုံးပွဲစဉ်၏ ဒေတာကို ကတ်ပြားထဲသို့ စတင်ထည့်သွင်းခြင်း
    loadFixtureData(currentFixtureIndex);
}

// 🔄 ၃။ အပေါ်ဆုံး ပွဲစဉ်ခလုတ် နှိပ်လိုက်လျှင် ပြောင်းလဲခြင်း
function switchFixture(index) {
    currentFixtureIndex = index;
    
    // ခလုတ်များ၏ Active အရောင်ကို လိုက်ပြောင်းခြင်း
    const buttons = document.querySelectorAll('.fix-tab-btn');
    buttons.forEach((btn, i) => {
        if (i === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    // ဒေတာအသစ်များကို ဆွဲတင်ပြီး အောက်ခြေကတ်ပြားကို နံပါတ် ၁ (Match) သို့ အလိုအလျောက် ပြန်ရွှေ့ခြင်း
    loadFixtureData(index);
    switchCardView(1); 
}

// 📊 ၄။ ရွေးချယ်ထားသော ပွဲစဉ်ဒေတာများကို HTML ထဲသို့ ထည့်သွင်းခြင်း
function loadFixtureData(index) {
    const data = worldCupData[index];
    if (!data) return;

    // 🏆 Stage Title ပြောင်းခြင်း (ဥပမာ- ROUND OF 32, QUARTER-FINAL)
    document.getElementById('card-stage').innerText = data.stage;

    // --- CARD 1: MATCHUP DATA (အလံနှင့် အသင်းအမည်) ---
    document.getElementById('flag-a').src = data.teamA.flag;
    document.getElementById('flag-b').src = data.teamB.flag;
    document.getElementById('name-a').innerText = data.teamA.name;
    document.getElementById('name-b').innerText = data.teamB.name;

    // --- CARD 2: GROUP STAGE RESULTS DATA ---
    document.getElementById('res-name-a').innerText = data.teamA.name;
    document.getElementById('res-name-b').innerText = data.teamB.name;
    document.getElementById('res-text-a').innerText = data.groupResults.teamA;
    document.getElementById('res-text-b').innerText = data.groupResults.teamB;

    // --- CARD 3: TACTICAL FORMATION GENERATOR (ဘောလုံးကွင်းပုံစံ) ---
    const fData = data.formations;
    document.getElementById('badge-team-a').innerText = `${data.teamA.name} ${fData.teamAName}`;
    document.getElementById('badge-team-b').innerText = `${data.teamB.name} ${fData.teamBName}`;

    // Team A (ဘယ်ဘက်ခြမ်း - အစိမ်းရောင် ကစားသမား Icons များစီခြင်း)
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

    // Team B (ညာဘက်ခြမ်း - အနီရောင် ကစားသမား Icons များစီခြင်း)
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

    // --- CARD 4: WIN PROBABILITY DATA (Progress Bars) ---
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
    // သက်ဆိုင်ရာ ကတ်ပြားအတွင်းပိုင်း Content များကို ပိတ်/ဖွင့် လုပ်ခြင်း
    const views = document.querySelectorAll('.card-view');
    views.forEach((view, i) => {
        if ((i + 1) === viewNumber) view.classList.add('active');
        else view.classList.remove('active');
    });

    // အောက်ခြေခလုတ်များ၏ Active အရောင် (နီယွန်ပြာလိုင်း) ကို လိုက်ပြောင်းခြင်း
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach((btn, i) => {
        if ((i + 1) === viewNumber) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

// 🚀 Browser စတင်ပတ်သည်နှင့် JSON ဒေတာကို အရင်ဆုံးဆွဲဖတ်ရန် ခေါ်ယူခြင်း
window.onload = fetchWorldCupData;