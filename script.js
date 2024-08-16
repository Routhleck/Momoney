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
let assetChart, cashChart;

document.addEventListener("DOMContentLoaded", function () {
    initializePlayers();
    updatePlayerSelectors();
    document.getElementById("initialize").addEventListener("click", showInitModal);
    document.getElementById("confirmInit").addEventListener("click", initializeCash);
    document.getElementById("nextRound").addEventListener("click", nextRound);
    document.getElementById("transfer").addEventListener("click", transferMoney);
    document.getElementById("exportData").addEventListener("click", exportData);
    document.getElementById("importDataButton").addEventListener("click", () => document.getElementById("importData").click());
    document.getElementById("importData").addEventListener("change", importData);
});

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
    document.getElementById("playerFromButton0").style.backgroundColor = players[0].color;
    document.getElementById("playerFromButton1").style.backgroundColor = players[1].color;
    document.getElementById("playerFromButton2").style.backgroundColor = players[2].color;
    document.getElementById("playerFromButton3").style.backgroundColor = players[3].color;
    document.getElementById("playerFromButton4").style.backgroundColor = players[4].color;
    document.getElementById("playerFromButton5").style.backgroundColor = players[5].color;

    document.getElementById("playerToButton0").style.backgroundColor = players[0].color;
    document.getElementById("playerToButton1").style.backgroundColor = players[1].color;
    document.getElementById("playerToButton2").style.backgroundColor = players[2].color;
    document.getElementById("playerToButton3").style.backgroundColor = players[3].color;
    document.getElementById("playerToButton4").style.backgroundColor = players[4].color;
    document.getElementById("playerToButton5").style.backgroundColor = players[5].color;
}

function updatePlayerName(index, name) {
    players[index].name = name;
    updatePlayerSelectors();
}

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

    // Add bank options
    let bankOption1 = document.createElement("option");
    bankOption1.value = "6";
    bankOption1.textContent = bank.name;
    fromPlayer.appendChild(bankOption1);

    let bankOption2 = document.createElement("option");
    bankOption2.value = "6";
    bankOption2.textContent = bank.name;
    toPlayer.appendChild(bankOption2);

    document.getElementById("playerFromButton0").textContent = players[0].name;
    document.getElementById("playerFromButton1").textContent = players[1].name;
    document.getElementById("playerFromButton2").textContent = players[2].name;
    document.getElementById("playerFromButton3").textContent = players[3].name;
    document.getElementById("playerFromButton4").textContent = players[4].name;
    document.getElementById("playerFromButton5").textContent = players[5].name;

    document.getElementById("playerToButton0").textContent = players[0].name;
    document.getElementById("playerToButton1").textContent = players[1].name;
    document.getElementById("playerToButton2").textContent = players[2].name;
    document.getElementById("playerToButton3").textContent = players[3].name;
    document.getElementById("playerToButton4").textContent = players[4].name;
    document.getElementById("playerToButton5").textContent = players[5].name;
}

function showInitModal() {
    const modal = document.getElementById("initModal");
    const initPlayersCash = document.getElementById("initPlayersCash");
    initPlayersCash.innerHTML = "";

    players.forEach((player, index) => {
        const cashInput = document.createElement("div");
        cashInput.innerHTML = `
            <label>${player.name} 初始现金:</label>
            <input type="number" id="cash_${index}" value="${player.cash}">
        `;
        initPlayersCash.appendChild(cashInput);
    });

    modal.style.display = "flex";
}

function initializeCash() {
    players.forEach((player, index) => {
        let cash = parseInt(document.getElementById(`cash_${index}`).value);
        player.cash = isNaN(cash) ? 0 : cash;
        player.totalAsset = player.cash;
    });

    round = 1;
    history = [];
    saveHistory();
    updateCharts();

    document.getElementById("roundDisplay").textContent = "轮次: " + round;
    const modal = document.getElementById("initModal");
    modal.style.display = "none";
    updatePlayersDisplay();
    updateCharts();
}

function nextRound() {
    round++;
    saveHistory();
    updateCharts();
    // 清空日志
    document.getElementById("logList").innerHTML = "";
    document.getElementById("roundDisplay").textContent = "轮次: " + round;
}

function transferMoney() {
    const fromIndex = document.getElementById("fromPlayer").value;
    const toIndex = document.getElementById("toPlayer").value;
    const amount = parseInt(document.getElementById("amount").value);

    if (fromIndex === toIndex || isNaN(amount) || amount <= 0) {
        alert("请选择有效的玩家并输入有效金额！");
        return;
    }

    let logMessage = "";

    if (fromIndex === "6") {
        bank.cash -= amount;
        players[toIndex].cash += amount;
        players[toIndex].totalAsset += amount;
        logMessage = `银行给 ${players[toIndex].name} 转账 ${amount}`;
    } else if (toIndex === "6") {
        players[fromIndex].cash -= amount;
        players[fromIndex].totalAsset -= amount;
        bank.cash += amount;
        logMessage = `${players[fromIndex].name} 给银行转账 ${amount}`;
    } else {
        players[fromIndex].cash -= amount;
        players[fromIndex].totalAsset -= amount;
        players[toIndex].cash += amount;
        players[toIndex].totalAsset += amount;
        logMessage = `${players[fromIndex].name} 给 ${players[toIndex].name} 转账 ${amount}`;
    }

    addLog(logMessage);
    updatePlayersDisplay();
    saveHistory();
    updateCharts();

}

function buyFromBank() {
    const toIndex = document.getElementById("toPlayer").value;
    const amount = parseInt(document.getElementById("amount").value);

    if (toIndex === "6" || isNaN(amount) || amount <= 0) {
        alert("请选择有效的玩家并输入有效金额！");
        return;
    }

    players[toIndex].cash -= amount;
    players[toIndex].totalAsset += amount;

    addLog(`${players[toIndex].name} 从银行购买资产 ${amount}`);
    updatePlayersDisplay();
}

function mortgageAsset() {
    const fromIndex = document.getElementById("fromPlayer").value;
    const amount = parseInt(document.getElementById("amount").value);

    if (fromIndex === "6" || isNaN(amount) || amount <= 0) {
        alert("请选择有效的玩家并输入有效金额！");
        return;
    }

    players[fromIndex].cash += amount;
    players[fromIndex].totalAsset -= amount;

    addLog(`${players[fromIndex].name} 向银行抵押资产 ${amount}`);
    updatePlayersDisplay();
}

function addLog(message) {
    const logList = document.getElementById("logList");
    const logEntry = document.createElement("li");
    logEntry.textContent = message;
    logList.appendChild(logEntry);
}

function updatePlayersDisplay() {
    const playerDivs = document.querySelectorAll(".player");

    players.forEach((player, index) => {
        const playerDiv = playerDivs[index];
        playerDiv.querySelector(".totalAsset").textContent = player.totalAsset;
        playerDiv.querySelector(".cash").textContent = player.cash;
    });
}

function saveHistory() {
    const snapshot = players.map(player => ({
        totalAsset: player.totalAsset,
        cash: player.cash
    }));
    // 如果当前轮次已经有数据，则更新；否则新增
    // 查找最新的一轮数据中的round，如果等于当前round，则更新，否则新增
    const latestRound = history.find(h => h.round === round);
    if (latestRound) {
        latestRound.snapshot = snapshot;
    } else {
        history.push({
            round: round,
            snapshot: snapshot
        });
    }
    // history.push({
    //     round: round,
    //     snapshot: snapshot
    // });
}

function updateCharts() {
    if (assetChart) assetChart.destroy();
    if (cashChart) cashChart.destroy();

    const assetData = history.map(h => ({
        round: h.round,
        values: h.snapshot.map(s => s.totalAsset)
    }));

    const cashData = history.map(h => ({
        round: h.round,
        values: h.snapshot.map(s => s.cash)
    }));

    renderChart('assetChart', '总资产', assetData);
    renderChart('cashChart', '现金', cashData);
}

function renderChart(canvasId, label, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    let chart; // 声明一个变量来存储新的 Chart 实例

    // 检查是否已经有 Chart 实例存在，并销毁它
    if (canvasId === 'assetChart' && assetChart) {
        assetChart.destroy();
    } else if (canvasId === 'cashChart' && cashChart) {
        cashChart.destroy();
    }

    const labels = data.map(d => `第${d.round}轮`);

    const datasets = players.map((player, index) => ({
        label: player.name,
        data: data.map(d => d.values[index]),
        borderColor: player.color,
        backgroundColor: 'rgba(0,0,0,0)', // 设置为完全透明，不填充区域
        borderWidth: 2, // 可以根据需要调整线条粗细
        fill: false // 确保不填充区域
    }));

    // 创建新的 Chart 实例并赋值给相应的变量
    chart = new Chart(ctx, {
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
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });

    // 根据 canvasId 将 chart 实例赋值给 assetChart 或 cashChart
    if (canvasId === 'assetChart') {
        assetChart = chart;
    } else if (canvasId === 'cashChart') {
        cashChart = chart;
    }
}

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

function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const jsonData = e.target.result;
        history = JSON.parse(jsonData);
        round = history.length + 1;
        document.getElementById("roundDisplay").textContent = "轮次: " + round;

        history.forEach(roundData => {
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

// 设置玩家为转出方
function setPlayerAsFrom(playerIndex) {
    const fromPlayerSelect = document.getElementById('fromPlayer');
    fromPlayerSelect.value = playerIndex;
}

// 设置玩家为转入方
function setPlayerAsTo(playerIndex) {
    const toPlayerSelect = document.getElementById('toPlayer');
    toPlayerSelect.value = playerIndex;
}

// 设置交易金额
function setAmount(amount) {
    document.getElementById('amount').value = amount;
}

// 显示模态窗口
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// 关闭模态窗口
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// 关闭所有模态窗口
function closeModals() {
    closeModal('buyAssetModal');
    closeModal('mortgageModal');
}

// 购买资产逻辑
function buyAsset() {
    const toIndex = document.getElementById('fromPlayer').value;
    const amount = parseInt(document.getElementById('buyAmount').value);
    
    if (toIndex === 'bank' || isNaN(amount) || amount <= 0) {
        alert('请输入有效的金额');
        return;
    }
    
    players[toIndex].cash -= amount; // 扣除现金
    // players[toIndex].totalAsset += amount; // 增加总资产
    
    addLog(`${players[toIndex].name} 从银行购买资产 ${amount}`);
    updatePlayersDisplay();
    saveHistory();
    updateCharts();
    closeModal('buyAssetModal');
}

// 资产抵押逻辑
function mortgageAsset() {
    const fromIndex = document.getElementById('fromPlayer').value;
    const originalPrice = parseInt(document.getElementById('mortgageOriginalPrice').value);
    const mortgagePrice = parseInt(document.getElementById('mortgagePrice').value);
    
    if (fromIndex === 'bank' || isNaN(originalPrice) || isNaN(mortgagePrice) || originalPrice <= 0 || mortgagePrice <= 0) {
        alert('请输入有效的原价和抵押价格');
        return;
    }
    
    players[fromIndex].totalAsset -= originalPrice; // 扣除原价
    players[fromIndex].cash += mortgagePrice; // 增加抵押价格
    players[fromIndex].totalAsset += mortgagePrice; // 增加总资产
    
    addLog(`${players[fromIndex].name} 向银行抵押资产，原价 ${originalPrice}，抵押价格 ${mortgagePrice}`);
    updatePlayersDisplay();
    saveHistory();
    updateCharts();
    closeModal('mortgageModal');
}