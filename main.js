import {initializePlayers, updatePlayerName, updatePlayerSelectors, updatePlayersDisplay} from './scripts/playerManager.js';
import {showInitModal, openModal, closeModal, closeModals} from './scripts/modelManager.js';
import {initializeCash, nextRound, transferMoney, setPlayerAsFrom, setPlayerAsTo, setAmount, buyAsset, mortgageAsset} from './scripts/transaction.js';
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

export function updatePlayers(newPlayers) {
    players = newPlayers;
}

export function updateBank(newBank) {
    bank = newBank;
}

export function updateRound(newRound) {
    round = newRound;
}

export function updateHistory(newHistory) {
    history = newHistory;
}

export function updateAssetChart(newAssetChart) {
    assetChart = newAssetChart;
}

export function updateCashChart(newCashChart) {
    cashChart = newCashChart;
}

window.setPlayerAsFrom = setPlayerAsFrom;
window.setPlayerAsTo = setPlayerAsTo;
window.setAmount = setAmount;
window.openModal = openModal;
window.closeModal = closeModal;
window.buyAsset = buyAsset;
window.mortgageAsset = mortgageAsset;