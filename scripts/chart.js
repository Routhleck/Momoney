import { players, history, assetChart, cashChart, updateAssetChart, updateCashChart } from '../main.js';


export function updateCharts() {
    if (assetChart) assetChart.destroy();
    if (cashChart) cashChart.destroy();

    const assetData = history.map(h => ({
        round: h.round,
        values: h.snapshot.map(s => s.totalAsset)
    }));

    const cashData = history.map(h => ({
        round: h.round,
        values: h.snapshot.map(s => s.cash)
    }));

    renderChart('assetChart', '总资产', assetData);
    renderChart('cashChart', '现金', cashData);
}

export function renderChart(canvasId, label, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    let chart; // 声明一个变量来存储新的 Chart 实例

    // 检查是否已经有 Chart 实例存在，并销毁它
    if (canvasId === 'assetChart' && assetChart) {
        assetChart.destroy();
    } else if (canvasId === 'cashChart' && cashChart) {
        cashChart.destroy();
    }

    const maxY = Math.ceil(Math.max(...data.map(d => Math.max(...d.values))));
    const minY = Math.floor(Math.min(...data.map(d => Math.min(...d.values))));
    const range = maxY - minY;
    const extraPadding = range * 0.1; // 添加10%的额外空间

    const labels = data.map(d => `第${d.round}轮`);

    const datasets = players.map((player, index) => ({
        label: player.name,
        data: data.map(d => d.values[index]),
        borderColor: player.color,
        backgroundColor: 'rgba(0,0,0,0)', // 设置为完全透明，不填充区域
        borderWidth: 2, // 可以根据需要调整线条粗细
        fill: false // 确保不填充区域
    }));

    // 创建新的 Chart 实例并赋值给相应的变量
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        min: minY - extraPadding,
                        max: maxY + extraPadding,
                        callback: function(value, index, values) {
                            // 自定义刻度标签的格式，如果需要的话
                            return value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });

    // 根据 canvasId 将 chart 实例赋值给 assetChart 或 cashChart
    if (canvasId === 'assetChart') {
        updateAssetChart(chart);
    } else if (canvasId === 'cashChart') {
        updateCashChart(chart);
    }
}