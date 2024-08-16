let players = [
    { name: "玩家1", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家2", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家3", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家4", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家5", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家6", color: "", totalAsset: 0, cash: 0 },
];

let bank = { name: "银行", cash: 1000000 };
let round = 0;
let history = [];

// 初始化页面
document.addEventListener("DOMContentLoaded", function () {
    initializePlayers();
    updatePlayerSelectors();
    document.getElementById("initialize").addEventListener("click", showInitModal);
    document.getElementById("confirmInit").addEventListener("click", initializeCash);
    document.getElementById("nextRound").addEventListener("click", nextRound);
    document.getElementById("transfer").addEventListener("click", transferMoney);
    document.getElementById("buyFromBank").addEventListener("click", buyFromBank);
    document.getElementById("mortgage").addEventListener("click", mortgageAsset);
    document.getElementById("exportData").addEventListener("click", exportData);
    document.getElementById("importDataButton").addEventListener("click", () => document.getElementById("importData").click());
    document.getElementById("importData").addEventListener("change", importData);

    document.getElementById("saveData").addEventListener("click", saveToDatabase);
    document.getElementById("loadData").addEventListener("click", loadFromDatabase);

    initDatabase();
});

let db;

// 初始化数据库
async function initDatabase() {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    createTables();
    loadFromDatabase();
}

// 创建数据库表
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            color TEXT,
            totalAsset INTEGER,
            cash INTEGER
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bank (
            cash INTEGER
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS history (
            round INTEGER,
            player_id INTEGER,
            totalAsset INTEGER,
            cash INTEGER
        );
    `);

    db.run(`
        INSERT OR IGNORE INTO bank (cash) VALUES (1000000);
    `);
}

// 保存数据到数据库
function saveToDatabase() {
    db.run("DELETE FROM players");
    db.run("DELETE FROM history");

    players.forEach((player, index) => {
        db.run(`
            INSERT INTO players (name, color, totalAsset, cash)
            VALUES (?, ?, ?, ?);
        `, [player.name, player.color, player.totalAsset, player.cash]);
    });

    db.run("UPDATE bank SET cash = ?", [bank.cash]);

    history.forEach(roundData => {
        roundData.snapshot.forEach((snapshot, playerIndex) => {
            db.run(`
                INSERT INTO history (round, player_id, totalAsset, cash)
                VALUES (?, ?, ?, ?);
            `, [roundData.round, playerIndex, snapshot.totalAsset, snapshot.cash]);
        });
    });

    alert("数据已保存到数据库");
}

// 从数据库加载数据
function loadFromDatabase() {
    const playersResult = db.exec("SELECT * FROM players");
    const bankResult = db.exec("SELECT * FROM bank");
    const historyResult = db.exec("SELECT * FROM history");

    if (playersResult.length > 0) {
        players = playersResult[0].values.map(row => ({
            name: row[1],
            color: row[2],
            totalAsset: row[3],
            cash: row[4]
        }));
        updatePlayersDisplay();
    }

    if (bankResult.length > 0) {
        bank.cash = bankResult[0].values[0][0];
    }

    if (historyResult.length > 0) {
        history = [];
        let currentRound = -1;
        historyResult[0].values.forEach(row => {
            if (row[0] !== currentRound) {
                history.push({ round: row[0], snapshot: [] });
                currentRound = row[0];
            }
            history[history.length - 1].snapshot[row[1]] = { totalAsset: row[2], cash: row[3] };
        });
    }

    updateCharts();
}

// 初始化玩家信息
function initializePlayers() {
    const playerContainer = document.getElementById("players");
    playerContainer.innerHTML = "";
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F5A623", "#BD10E0", "#50E3C2"];

    players.forEach((player, index) => {
        player.color = colors[index];
        player.totalAsset = 50000;
        player.cash = 50000;

        let playerDiv = document.createElement("div");
        playerDiv.className = "player";
        playerDiv.style.backgroundColor = player.color;

        playerDiv.innerHTML = `
            <input type="text" value="${player.name}" onblur="updatePlayerName(${index}, this.value)">
            <p>总资产: <span class="totalAsset">${player.totalAsset}</span></p>
            <p>现金: <span class="cash">${player.cash}</span></p>
        `;

        playerContainer.appendChild(playerDiv);
    });
}

// 更新玩家昵称
function updatePlayerName(index, name) {
    players[index].name = name;
    updatePlayerSelectors();
}

// 更新玩家选择框
function updatePlayerSelectors() {
    const fromPlayer = document.getElementById("fromPlayer");
    const toPlayer = document.getElementById("toPlayer");

    fromPlayer.innerHTML = "";
    toPlayer.innerHTML = "";

    players.forEach((player, index) => {
        let option1 = document.createElement("option");
        option1.value = index;
        option1.textContent = player.name;

        let option2 = document.createElement("option");
        option2.value = index;
        option2.textContent = player.name;

        fromPlayer.appendChild(option1);
        toPlayer.appendChild(option2);
    });

    let bankOption1 = document.createElement("option");
    bankOption1.value = "bank";
    bankOption1.textContent = bank.name;
    fromPlayer.appendChild(bankOption1);

    let bankOption2 = document.createElement("option");
    bankOption2.value = "bank";
    bankOption2.textContent = bank.name;
    toPlayer.appendChild(bankOption2);
}

// 显示初始化现金弹窗
function showInitModal() {
    const modal = document.getElementById("initModal");
    const initPlayersCash = document.getElementById("initPlayersCash");

    initPlayersCash.innerHTML = "";
    players.forEach((player, index) => {
        let cashInput = document.createElement("div");
        cashInput.innerHTML = `
            <label>${player.name} 初始现金:</label>
            <input type="number" id="cash_${index}" value="${player.cash}">
        `;
        initPlayersCash.appendChild(cashInput);
    });

    modal.style.display = "flex";
}

// 初始化现金
function initializeCash() {
    players.forEach((player, index) => {
        let cash = document.getElementById(`cash_${index}`).value;
        player.cash = parseInt(cash);
        player.totalAsset = player.cash;
    });

    const modal = document.getElementById("initModal");
    modal.style.display = "none";
    updatePlayersDisplay();
}

// 进行下一轮
function nextRound() {
    round++;
    saveHistory();
    updateCharts();
}

// 转账操作
function transferMoney() {
    const fromIndex = document.getElementById("fromPlayer").value;
    const toIndex = document.getElementById("toPlayer").value;
    const amount = parseInt(document.getElementById("amount").value);

    if (fromIndex === toIndex || isNaN(amount) || amount <= 0) {
        alert("请选择有效的玩家并输入有效金额！");
        return;
    }

    if (fromIndex === "bank") {
        bank.cash -= amount;
        players[toIndex].cash += amount;
        players[toIndex].totalAsset += amount;
    } else if (toIndex === "bank") {
        players[fromIndex].cash -= amount;
        players[fromIndex].totalAsset -= amount;
        bank.cash += amount;
    } else {
        players[fromIndex].cash -= amount;
        players[fromIndex].totalAsset -= amount;
        players[toIndex].cash += amount;
        players[toIndex].totalAsset += amount;
    }

    updatePlayersDisplay();
}

// 购买资产
function buyFromBank() {
    const toIndex = document.getElementById("toPlayer").value;
    const amount = parseInt(document.getElementById("amount").value);

    if (toIndex === "bank" || isNaN(amount) || amount <= 0) {
        alert("请选择有效的玩家并输入有效金额！");
        return;
    }

    players[toIndex].cash -= amount;
    players[toIndex].totalAsset += amount;

    updatePlayersDisplay();
}

// 抵押资产
function mortgageAsset() {
    const fromIndex = document.getElementById("fromPlayer").value;
    const amount = parseInt(document.getElementById("amount").value);

    if (fromIndex === "bank" || isNaN(amount) || amount <= 0) {
        alert("请选择有效的玩家并输入有效金额！");
        return;
    }

    players[fromIndex].cash += amount;
    players[fromIndex].totalAsset -= amount;

    updatePlayersDisplay();
}

// 更新玩家显示信息
function updatePlayersDisplay() {
    const playerDivs = document.querySelectorAll(".player");

    players.forEach((player, index) => {
        const playerDiv = playerDivs[index];
        playerDiv.querySelector(".totalAsset").textContent = player.totalAsset;
        playerDiv.querySelector(".cash").textContent = player.cash;
    });
}

// 保存当前回合数据
function saveHistory() {
    const snapshot = players.map(player => ({
        totalAsset: player.totalAsset,
        cash: player.cash
    }));

    history.push({
        round: round,
        snapshot: snapshot
    });
}

// 更新折线图
function updateCharts() {
    const assetData = history.map((h, round) => ({
        round: round + 1,
        values: h.snapshot.map(s => s.totalAsset)
    }));

    const cashData = history.map((h, round) => ({
        round: round + 1,
        values: h.snapshot.map(s => s.cash)
    }));

    renderChart('assetChart', '总资产', assetData);
    renderChart('cashChart', '现金', cashData);
}

// 渲染折线图
function renderChart(canvasId, label, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const labels = data.map(d => `第${d.round}轮`);

    const datasets = players.map((player, index) => ({
        label: player.name,
        data: data.map(d => d.values[index]),
        borderColor: player.color,
        fill: false
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 导出数据
function exportData() {
    const jsonData = JSON.stringify(history);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "game_data.json";
    a.click();

    URL.revokeObjectURL(url);
}

// 导入数据
function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const jsonData = e.target.result;
        history = JSON.parse(jsonData);
        round = history.length;

        history.forEach((roundData, roundIndex) => {
            players.forEach((player, index) => {
                player.totalAsset = roundData.snapshot[index].totalAsset;
                player.cash = roundData.snapshot[index].cash;
            });
        });

        updatePlayersDisplay();
        updateCharts();
    };

    reader.readAsText(file);
}
