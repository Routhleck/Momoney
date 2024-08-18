import {players, bank, updatePlayers, updateBank} from "../main.js";
import { setPlayerAsFrom, setPlayerAsTo, setAmount,
    setPlayerBuyAsset, setAmountBuyAsset,
    setPlayerMortgage, setMortgageOriginalPrice, setMortgagePrice
 } from "./transaction.js";
 import { updateCharts } from "./chart.js";

// 顺序调用initializePlayers和updatePlayerSelectors
document.getElementById("PlayerCount").addEventListener("change", initializePlayers);


export function initializePlayers() {
    const playerCount = parseInt(document.getElementById("PlayerCount").value);

    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F5A623", "#BD10E0", "#50E3C2", "#FF9F43", "#33FFF6", "#F533FF", "#93FF33"];

    let newPlayers = [];

    for (let i = 0; i < playerCount; i++) {
        const player = {
            name: `玩家${i + 1}`,
            color: colors[i] || "#000000",
            totalAsset: 15000,
            cash: 15000
        };
        newPlayers.push(player);
    }
    updatePlayers(newPlayers);

    // Create player UI elements
    const playerContainer = document.getElementById("players");
    const transactionFromPlayerButtons = document.getElementById("transaction-from-player-button");
    const transactionToPlayerButtons = document.getElementById("transaction-to-player-button");
    const buyAssetFromPlayerButtons = document.getElementById("buy-asset-player-button");
    const mortgagePlayerButtons = document.getElementById("mortgage-player-button");
    playerContainer.innerHTML = "";
    transactionFromPlayerButtons.innerHTML = "";
    transactionToPlayerButtons.innerHTML = "";
    buyAssetFromPlayerButtons.innerHTML = "";
    mortgagePlayerButtons.innerHTML = "";


    players.forEach((player, index) => {

        let playerDiv = document.createElement("div");
        playerDiv.className = "player";
        playerDiv.style.backgroundColor = player.color;

        let totalAsset_M = Math.floor(player.totalAsset / 1000);
        let cash_M = player.cash / 1000;
        let totalAsset_K = Math.floor(player.totalAsset % 1000);
        let cash_K = player.cash % 1000;

        playerDiv.innerHTML = `
            <input type="text" value="${player.name}" onblur="updatePlayerName(${index}, this.value)">
            <p>总资产: <span class="totalAsset">\$${totalAsset_M}M ${totalAsset_K}k</span></p>
            <p>现金: <span class="cash">\$${cash_M}M ${cash_K}k</span></p>
        `;

        let transactionFromPlayerButton = document.createElement("button");
        transactionFromPlayerButton.id = `playerFromButton${index}`;
        transactionFromPlayerButton.className = "transaction-from-player-button";
        transactionFromPlayerButton.textContent = player.name;
        transactionFromPlayerButton.style.backgroundColor = player.color;
        transactionFromPlayerButton.onclick = function () {
            setPlayerAsFrom(index);
        }

        let transactionToPlayerButton = document.createElement("button");
        transactionToPlayerButton.id = `playerToButton${index}`;
        transactionToPlayerButton.className = "transaction-to-player-button";
        transactionToPlayerButton.textContent = player.name;
        transactionToPlayerButton.style.backgroundColor = player.color;
        transactionToPlayerButton.onclick = function () {
            setPlayerAsTo(index);
        }

        let buyAssetPlayerButton = document.createElement("button");
        buyAssetPlayerButton.id = `playerBuyAssetButton${index}`;
        buyAssetPlayerButton.className = "buy-asset-player-button";
        buyAssetPlayerButton.textContent = player.name;
        buyAssetPlayerButton.style.backgroundColor = player.color;
        buyAssetPlayerButton.onclick = function () {
            setPlayerBuyAsset(index);
        }


        let mortgagePlayerButton = document.createElement("button");
        mortgagePlayerButton.id = `playerMortgageButton${index}`;
        mortgagePlayerButton.className = "mortgage-player-button";
        mortgagePlayerButton.textContent = player.name;
        mortgagePlayerButton.style.backgroundColor = player.color;
        mortgagePlayerButton.onclick = function () {
            setPlayerMortgage(index);
        }

        playerContainer.appendChild(playerDiv);
        transactionFromPlayerButtons.appendChild(transactionFromPlayerButton);
        transactionToPlayerButtons.appendChild(transactionToPlayerButton);
        buyAssetFromPlayerButtons.appendChild(buyAssetPlayerButton);
        mortgagePlayerButtons.appendChild(mortgagePlayerButton);

    });

    // Create bank UI element
    let transactionFromPlayerButton = document.createElement("button");
    transactionFromPlayerButton.id = `playerFromButton${playerCount}`;
    transactionFromPlayerButton.textContent = bank.name;
    transactionFromPlayerButton.style.backgroundColor = bank.color;
    transactionFromPlayerButton.onclick = function () {
        setPlayerAsFrom(playerCount);
    }

    let transactionToPlayerButton = document.createElement("button");
    transactionToPlayerButton.id = `playerToButton${playerCount}`;
    transactionToPlayerButton.textContent = bank.name;
    transactionToPlayerButton.style.backgroundColor = bank.color;
    transactionToPlayerButton.onclick = function () {
        setPlayerAsTo(playerCount);
    }

    transactionFromPlayerButtons.appendChild(transactionFromPlayerButton);
    transactionToPlayerButtons.appendChild(transactionToPlayerButton);
    updatePlayerSelectors();

    updateCharts();
}

export function updatePlayerName(index, name) {
    let newPlayers = [...players];
    newPlayers[index].name = name;
    updatePlayers(newPlayers);
    updatePlayerSelectors();
}

export function updatePlayerSelectors() {
    const playerCount = parseInt(document.getElementById("PlayerCount").value);
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

        document.getElementById(`playerFromButton${index}`).textContent = player.name;
        document.getElementById(`playerToButton${index}`).textContent = player.name;
        document.getElementById(`playerBuyAssetButton${index}`).textContent = player.name;
        document.getElementById(`playerMortgageButton${index}`).textContent = player.name;
    });

    // Add bank options
    let bankOption1 = document.createElement("option");
    bankOption1.value = playerCount;
    bankOption1.textContent = bank.name;
    fromPlayer.appendChild(bankOption1);

    let bankOption2 = document.createElement("option");
    bankOption2.value = playerCount;
    bankOption2.textContent = bank.name;
    toPlayer.appendChild(bankOption2);
}

export function updatePlayersDisplay() {
    const playerDivs = document.querySelectorAll(".player");

    players.forEach((player, index) => {
        const playerDiv = playerDivs[index];
        let totalAsset_M = Math.floor(player.totalAsset / 1000);
        let cash_M = Math.floor(player.cash / 1000);
        let totalAsset_K = player.totalAsset % 1000;
        let cash_K = player.cash % 1000;
        playerDiv.querySelector(".totalAsset").textContent = `$${totalAsset_M}M ${totalAsset_K}k`;
        playerDiv.querySelector(".cash").textContent = `$${cash_M}M ${cash_K}k`;
    });
}