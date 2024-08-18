import { players } from '../main.js';

export function showInitModal() {
    const modal = document.getElementById("initModal");
    const initPlayersCash = document.getElementById("initPlayersCash");
    initPlayersCash.innerHTML = "";

    players.forEach((player, index) => {
        const cashInput = document.createElement("div");
        cashInput.innerHTML = `
            <label style="font-size=20px">${player.name} 初始现金: $</label>
            <input type="number" id="cash_M_${index}" style="font-size=20px" value="15">
            <label style="font-size=20px">M</label>
            <input type="number" id="cash_k_${index}" style="font-size=20px" value="0">
            <label style="font-size=20px">K</label>
        `;
        initPlayersCash.appendChild(cashInput);
    });

    modal.style.display = "flex";
}

// 显示模态窗口
export function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// 关闭模态窗口
export function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// 关闭所有模态窗口
export function closeModals() {
    closeModal('buyAssetModal');
    closeModal('mortgageModal');
}