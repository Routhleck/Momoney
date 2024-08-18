export function addLog(message) {
    const logList = document.getElementById("logList");
    const logEntry = document.createElement("li");
    logEntry.textContent = message;
    logList.appendChild(logEntry);
}
