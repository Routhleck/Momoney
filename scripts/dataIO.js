import {players, bank, history, updateHistory, updateRound, saveToLocalStorage} from "../main.js";
import { initializePlayers, updatePlayerSelectors, updatePlayersDisplay } from "./playerManager.js";
import { updateCharts } from "./chart.js";

export function exportData() {
    const exportData = JSON.stringify({
        players: players.map(player => ({
            name: player.name,
            totalAsset: player.totalAsset,
            cash: player.cash
        })),
        history: history
    });
    
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const now = new Date();
    // game_data_YYYYMMDD_HHMM的格式
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要+1
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');

    // 拼接日期时间字符串
    const dateString = `${year}${month}${day}_${hour}${minute}`;

    a.download = `game_data_${dateString}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

export function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const jsonData = e.target.result;
        const importedData = JSON.parse(jsonData);
        const playerCount = importedData.players.length;
        document.getElementById("PlayerCount").value = playerCount;

        initializePlayers()


        const playerContainer = document.getElementById("players");

        importedData.players.forEach((playerData, index) => {
            players[index].name = playerData.name;
            players[index].totalAsset = playerData.totalAsset;
            players[index].cash = playerData.cash;
        });

        playerContainer.innerHTML = "";
        players.forEach((player, index) => {
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
        
        updateHistory(importedData.history);
        updateRound(importedData.history.length);

        document.getElementById("roundDisplay").textContent = "轮次: " + importedData.history.length;

        // history.forEach(roundData => {
        //     players.forEach((player, index) => {
        //         player.totalAsset = roundData.snapshot[index].totalAsset;
        //         player.cash = roundData.snapshot[index].cash;
        //     });
        // });

        updatePlayerSelectors();
        updatePlayersDisplay();
        updateCharts();
        saveToLocalStorage();
    };

    reader.readAsText(file);
}