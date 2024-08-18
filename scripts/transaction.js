import { players, bank, history, round, updatePlayers, updateBank, updateHistory, updateRound } from "../main.js";
import { addLog } from "./logManager.js";
import { updatePlayersDisplay } from "./playerManager.js";
import { updateCharts } from "./chart.js";

let fromPlayerIndex = 0;
let ToPlayerIndex = 0;
let transferAmount = 0;
let buyAssetPlayerIndex = 0;
let mortgagePlayerIndex = 0;

export function initializeCash() {
    players.forEach((player, index) => {
        let cash_M = parseInt(document.getElementById(`cash_M_${index}`).value);
        let cash_k = parseInt(document.getElementById(`cash_k_${index}`).value);
        let cash = cash_M * 1000 + cash_k;
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
    const fromIndex = fromPlayerIndex;
    const toIndex = ToPlayerIndex;
    transferAmount = parseInt(document.getElementById("amount_M").value) * 1000 + parseInt(document.getElementById("amount_k").value);
    const amount_M = Math.floor(transferAmount / 1000);
    const amount_k = transferAmount % 1000;
    const amount = transferAmount;

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

        logMessage = `银行给 ${players[toIndex].name} 转账 $${amount_M}M ${amount_k}k`;
    } else if (toIndex === "6") {
        let newBank = { ...bank };
        newBank.cash += amount;
        updateBank(newBank);

        let newPlayers = [...players];
        newPlayers[fromIndex].cash -= amount;
        newPlayers[fromIndex].totalAsset -= amount;
        updatePlayers(newPlayers);

        logMessage = `${players[fromIndex].name} 给银行转账 $${amount_M}M ${amount_k}k`;
    } else {
        let newPlayers = [...players];
        newPlayers[fromIndex].cash -= amount;
        newPlayers[fromIndex].totalAsset -= amount;
        newPlayers[toIndex].cash += amount;
        newPlayers[toIndex].totalAsset += amount;
        updatePlayers(newPlayers);
        
        logMessage = `${players[fromIndex].name} 给 ${players[toIndex].name} 转账 $${amount_M} M${amount_k}k`;
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
    fromPlayerIndex = playerIndex;
}

// 设置玩家为转入方
export function setPlayerAsTo(playerIndex) {
    const toPlayerSelect = document.getElementById('toPlayer');
    toPlayerSelect.value = playerIndex;
    ToPlayerIndex = playerIndex;
}

// 设置交易金额
export function setAmount(amount) {
    let amount_M = Math.floor(amount / 1000);
    let amount_k = amount % 1000;
    document.getElementById('amount_M').value = amount_M;
    document.getElementById('amount_k').value = amount_k;
    transferAmount = amount;
}

export function setPlayerBuyAsset(playerIndex) {
    const buyAssetPlayer = document.getElementById('buyAssetPlayerLabel');
    buyAssetPlayer.textContent = "购买方: " + players[playerIndex].name;
    buyAssetPlayerIndex = playerIndex;
}

export function setAmountBuyAsset(amount) {
    let amount_M = Math.floor(amount / 1000);
    let amount_k = amount % 1000;
    document.getElementById('buyAmount_M').value = amount_M;
    document.getElementById('buyAmount_k').value = amount_k;
}

export function setPlayerMortgage(playerIndex) {
    const mortgagePlayer = document.getElementById('mortgagePlayer');
    mortgagePlayer.textContent = "抵押方: " + players[playerIndex].name;
    mortgagePlayerIndex = playerIndex;
}

export function setMortgageOriginalPrice(amount) {
    let amount_M = Math.floor(amount / 1000);
    let amount_k = amount % 1000;
    document.getElementById('mortgageOriginalPrice_M').value = amount_M;
    document.getElementById('mortgageOriginalPrice_k').value = amount_k;
}

export function setMortgagePrice(amount) {
    let amount_M = Math.floor(amount / 1000);
    let amount_k = amount % 1000;
    document.getElementById('mortgagePrice_M').value = amount_M;
    document.getElementById('mortgagePrice_k').value = amount_k;
}

// 购买资产逻辑
export function buyAsset() {
    const toIndex = buyAssetPlayerIndex;
    let amount_M = parseInt(document.getElementById('buyAmount_M').value);
    let amount_k = parseInt(document.getElementById('buyAmount_k').value);
    let amount = amount_M * 1000 + amount_k;
    
    if (toIndex === 'bank' || isNaN(amount) || amount <= 0) {
        alert('请输入有效的金额');
        return;
    }

    let newPlayers = [...players];

    newPlayers[toIndex].cash -= amount; // 扣除现金
    updatePlayers(newPlayers);
    
    addLog(`${players[toIndex].name} 从银行购买资产 \$${amount_M}M ${amount_k}k`);
    updatePlayersDisplay();
    saveHistory();
    updateCharts();
    closeModal('buyAssetModal');
}

// 资产抵押逻辑
export function mortgageAsset() {
    const fromIndex = mortgagePlayerIndex;
    let originalPrice_M = parseInt(document.getElementById('mortgageOriginalPrice_M').value);
    let originalPrice_k = parseInt(document.getElementById('mortgageOriginalPrice_k').value);
    const originalPrice = originalPrice_M * 1000 + originalPrice_k

    let mortgagePrice_M = parseInt(document.getElementById('mortgagePrice_M').value);
    let mortgagePrice_k = parseInt(document.getElementById('mortgagePrice_k').value);
    const mortgagePrice = mortgagePrice_M * 1000 + mortgagePrice_k
    
    if (isNaN(originalPrice) 
        || isNaN(mortgagePrice) 
        || originalPrice <= 0 
        || mortgagePrice <= 0
        || mortgagePrice > originalPrice) {
        alert('请输入有效的原价和抵押价格');
        return;
    }

    let newPlayers = [...players];
    
    newPlayers[fromIndex].totalAsset -= originalPrice; // 扣除原价
    newPlayers[fromIndex].cash += mortgagePrice; // 增加抵押价格
    newPlayers[fromIndex].totalAsset += mortgagePrice; // 增加总资产

    updatePlayers(newPlayers);
    
    addLog(`${players[fromIndex].name} 向银行抵押资产，原价 \$${originalPrice_M}M ${originalPrice_k}k，抵押价格 \$${mortgagePrice_M}M ${mortgagePrice_k}k`);
    updatePlayersDisplay();
    saveHistory();
    updateCharts();
    closeModal('mortgageModal');
}