import {initializePlayers, initializePlayersWithCache, updatePlayerName, updatePlayerSelectors, updatePlayersDisplay} from './scripts/playerManager.js';
import {showInitModal, openModal, closeModal, closeModals} from './scripts/modelManager.js';
import {initializeCash, nextRound, transferMoney, 
    setPlayerAsFrom, setPlayerAsTo, setAmount, 
    buyAsset, mortgageAsset, setPlayerBuyAsset, 
    setAmountBuyAsset, setPlayerMortgage, setMortgageOriginalPrice, setMortgagePrice} from './scripts/transaction.js';
import {updateCharts, renderChart} from './scripts/chart.js';
import {addLog} from './scripts/logManager.js';
import {exportData, importData} from './scripts/dataIO.js';

export var players = [
    { name: "玩家1", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家2", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家3", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家4", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家5", color: "", totalAsset: 0, cash: 0 },
    { name: "玩家6", color: "", totalAsset: 0, cash: 0 },
];

export var bank = { name: "银行", cash: 1000000 };

export var round = 0;
export var history = [];
export var assetChart, cashChart;

let loadSucess = false;

document.addEventListener("DOMContentLoaded", function () {
    loadFromLocalStorage()
    if (loadSucess) {
        initializePlayersWithCache();
    }
    else {
        initializePlayers();
    }
    document.getElementById("initialize").addEventListener("click", showInitModal);
    document.getElementById("confirmInit").addEventListener("click", initializeCash);
    document.getElementById("nextRound").addEventListener("click", nextRound);
    document.getElementById("transfer").addEventListener("click", transferMoney);
    document.getElementById("exportData").addEventListener("click", exportData);
    document.getElementById("importDataButton").addEventListener("click", () => document.getElementById("importData").click());
    document.getElementById("importData").addEventListener("change", importData);
});

export function updatePlayers(newPlayers) {
    players = newPlayers;
    saveToLocalStorage();
}

export function updateBank(newBank) {
    bank = newBank;
    saveToLocalStorage();
}

export function updateRound(newRound) {
    round = newRound;
    saveToLocalStorage();
}

export function updateHistory(newHistory) {
    history = newHistory;
    saveToLocalStorage();
}

export function updateAssetChart(newAssetChart) {
    assetChart = newAssetChart;
}

export function updateCashChart(newCashChart) {
    cashChart = newCashChart;
}

export function saveToLocalStorage() {
    const data = {
        players,
        bank,
        round,
        history
    }
    localStorage.setItem('gameData', JSON.stringify(data))
}

export function loadFromLocalStorage() {
    const data = localStorage.getItem('gameData');
    if (data) {
        const { players: savedPlayers, bank: savedBank, round: savedRound, history: savedHistory } = JSON.parse(data);
        players = savedPlayers;
        bank = savedBank;
        round = savedRound;
        history = savedHistory;
        loadSucess = true;
    }
}

window.setPlayerAsFrom = setPlayerAsFrom;
window.setPlayerAsTo = setPlayerAsTo;
window.setAmount = setAmount;
window.openModal = openModal;
window.closeModal = closeModal;
window.buyAsset = buyAsset;
window.mortgageAsset = mortgageAsset;
window.updatePlayerName = updatePlayerName;
window.setPlayerBuyAsset = setPlayerBuyAsset;
window.setAmountBuyAsset = setAmountBuyAsset;
window.setPlayerMortgage = setPlayerMortgage;
window.setMortgageOriginalPrice = setMortgageOriginalPrice;
window.setMortgagePrice = setMortgagePrice;