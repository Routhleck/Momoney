import {players, bank, updatePlayers, updateBank} from "../main.js";

export function initializePlayers() {
    const playerContainer = document.getElementById("players");
    playerContainer.innerHTML = "";
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F5A623", "#BD10E0", "#50E3C2"];

    players.forEach((player, index) => {
        player.color = colors[index];
        player.totalAsset = 15000;
        player.cash = 15000;

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

    document.getElementById("playerBuyAssetButton0").style.backgroundColor = players[0].color;
    document.getElementById("playerBuyAssetButton1").style.backgroundColor = players[1].color;
    document.getElementById("playerBuyAssetButton2").style.backgroundColor = players[2].color;
    document.getElementById("playerBuyAssetButton3").style.backgroundColor = players[3].color;
    document.getElementById("playerBuyAssetButton4").style.backgroundColor = players[4].color;
    document.getElementById("playerBuyAssetButton5").style.backgroundColor = players[5].color;

    document.getElementById("playerMortgageButton0").style.backgroundColor = players[0].color;
    document.getElementById("playerMortgageButton1").style.backgroundColor = players[1].color;
    document.getElementById("playerMortgageButton2").style.backgroundColor = players[2].color;
    document.getElementById("playerMortgageButton3").style.backgroundColor = players[3].color;
    document.getElementById("playerMortgageButton4").style.backgroundColor = players[4].color;
    document.getElementById("playerMortgageButton5").style.backgroundColor = players[5].color;
}

export function updatePlayerName(index, name) {
    let newPlayers = [...players];
    newPlayers[index].name = name;
    updatePlayers(newPlayers);
    updatePlayerSelectors();
}

export function updatePlayerSelectors() {
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

    document.getElementById("playerBuyAssetButton0").textContent = players[0].name;
    document.getElementById("playerBuyAssetButton1").textContent = players[1].name;
    document.getElementById("playerBuyAssetButton2").textContent = players[2].name;
    document.getElementById("playerBuyAssetButton3").textContent = players[3].name;
    document.getElementById("playerBuyAssetButton4").textContent = players[4].name;
    document.getElementById("playerBuyAssetButton5").textContent = players[5].name;

    document.getElementById("playerMortgageButton0").textContent = players[0].name;
    document.getElementById("playerMortgageButton1").textContent = players[1].name;
    document.getElementById("playerMortgageButton2").textContent = players[2].name;
    document.getElementById("playerMortgageButton3").textContent = players[3].name;
    document.getElementById("playerMortgageButton4").textContent = players[4].name;
    document.getElementById("playerMortgageButton5").textContent = players[5].name;
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