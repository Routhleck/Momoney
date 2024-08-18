import { players, bank, history, round, updatePlayers, updateBank, updateHistory, updateRound } from "../main.js";
import { addLog } from "./logManager.js";
import { updatePlayersDisplay } from "./playerManager.js";
import { updateCharts } from "./chart.js";


export function initializeCash() {
    players.forEach((player, index) => {
        let cash = parseInt(document.getElementById(`cash_${index}`).value);
        player.cash = isNaN(cash) ? 0 : cash;
        player.totalAsset = player.cash;
    });

    updateRound(1);
    let newHistory = [];
    updateHistory(newHistory);
    saveHistory();
    updateCharts();

    document.getElementById("roundDisplay").textContent = "轮次: " + round;
    const modal = document.getElementById("initModal");
    modal.style.display = "none";
    updatePlayersDisplay();
    updateCharts();
}

export function nextRound() {
    updateRound(round + 1);
    saveHistory();
    updateCharts();
    // 清空日志
    document.getElementById("logList").innerHTML = "";
    document.getElementById("roundDisplay").textContent = "轮次: " + round;
}

export function transferMoney() {
    const fromIndex = document.getElementById("fromPlayer").value;
    const toIndex = document.getElementById("toPlayer").value;
    const amount = parseInt(document.getElementById("amount").value);

    if (fromIndex === toIndex || isNaN(amount) || amount <= 0) {
        alert("请选择有效的玩家并输入有效金额！");
        return;
    }

    let logMessage = "";

    if (fromIndex === "6") {
        let newBank = { ...bank };
        newBank.cash -= amount;
        updateBank(newBank);

        let newPlayers = [...players];
        newPlayers[toIndex].cash += amount;
        newPlayers[toIndex].totalAsset += amount;
        updatePlayers(newPlayers);

        logMessage = `银行给 ${players[toIndex].name} 转账 ${amount}`;
    } else if (toIndex === "6") {
        let newBank = { ...bank };
        newBank.cash += amount;
        updateBank(newBank);

        let newPlayers = [...players];
        newPlayers[fromIndex].cash -= amount;
        newPlayers[fromIndex].totalAsset -= amount;
        updatePlayers(newPlayers);

        logMessage = `${players[fromIndex].name} 给银行转账 ${amount}`;
    } else {
        let newPlayers = [...players];
        newPlayers[fromIndex].cash -= amount;
        newPlayers[fromIndex].totalAsset -= amount;
        newPlayers[toIndex].cash += amount;
        newPlayers[toIndex].totalAsset += amount;
        updatePlayers(newPlayers);
        
        logMessage = `${players[fromIndex].name} 给 ${players[toIndex].name} 转账 ${amount}`;
    }

    addLog(logMessage);
    updatePlayersDisplay();
    saveHistory();
    updateCharts();

}

export function saveHistory() {
    const snapshot = players.map(player => ({
        totalAsset: player.totalAsset,
        cash: player.cash
    }));
    // 如果当前轮次已经有数据，则更新；否则新增
    // 查找最新的一轮数据中的round，如果等于当前round，则更新，否则新增
    let newHistory = [...history];
    const latestRound = newHistory.find(h => h.round === round);
    if (latestRound) {
        latestRound.snapshot = snapshot;
    } else {
        newHistory.push({
            round: round,
            snapshot: snapshot
        });
    }
    updateHistory(newHistory);
    // history.push({
    //     round: round,
    //     snapshot: snapshot
    // });
}

// 设置玩家为转出方
export function setPlayerAsFrom(playerIndex) {
    const fromPlayerSelect = document.getElementById('fromPlayer');
    fromPlayerSelect.value = playerIndex;
}

// 设置玩家为转入方
export function setPlayerAsTo(playerIndex) {
    const toPlayerSelect = document.getElementById('toPlayer');
    toPlayerSelect.value = playerIndex;
}

// 设置交易金额
export function setAmount(amount) {
    document.getElementById('amount').value = amount;
}



// 购买资产逻辑
export function buyAsset() {
    const toIndex = document.getElementById('fromPlayer').value;
    const amount = parseInt(document.getElementById('buyAmount').value);
    
    if (toIndex === 'bank' || isNaN(amount) || amount <= 0) {
        alert('请输入有效的金额');
        return;
    }

    let newPlayers = [...players];

    newPlayers[toIndex].cash -= amount; // 扣除现金
    updatePlayers(newPlayers);
    
    addLog(`${players[toIndex].name} 从银行购买资产 ${amount}`);
    updatePlayersDisplay();
    saveHistory();
    updateCharts();
    closeModal('buyAssetModal');
}

// 资产抵押逻辑
export function mortgageAsset() {
    const fromIndex = document.getElementById('fromPlayer').value;
    const originalPrice = parseInt(document.getElementById('mortgageOriginalPrice').value);
    const mortgagePrice = parseInt(document.getElementById('mortgagePrice').value);
    
    if (fromIndex === 'bank' || isNaN(originalPrice) || isNaN(mortgagePrice) || originalPrice <= 0 || mortgagePrice <= 0) {
        alert('请输入有效的原价和抵押价格');
        return;
    }

    let newPlayers = [...players];
    
    newPlayers[fromIndex].totalAsset -= originalPrice; // 扣除原价
    newPlayers[fromIndex].cash += mortgagePrice; // 增加抵押价格
    newPlayers[fromIndex].totalAsset += mortgagePrice; // 增加总资产

    updatePlayers(newPlayers);
    
    addLog(`${players[fromIndex].name} 向银行抵押资产，原价 ${originalPrice}，抵押价格 ${mortgagePrice}`);
    updatePlayersDisplay();
    saveHistory();
    updateCharts();
    closeModal('mortgageModal');
}