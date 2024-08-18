import {players, bank, updatePlayers, updateBank} from "../main.js";

export function initializePlayers() {
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
}

export function updatePlayersDisplay() {
    const playerDivs = document.querySelectorAll(".player");

    players.forEach((player, index) => {
        const playerDiv = playerDivs[index];
        playerDiv.querySelector(".totalAsset").textContent = player.totalAsset;
        playerDiv.querySelector(".cash").textContent = player.cash;
    });
}