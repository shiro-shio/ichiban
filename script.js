// script.js

let prizesList = [{name: '', quantity: 0},]
let _name = '';
let quantity = 0;
const board = document.getElementById('game-board');


function generateTableWithInputs(rows) {
    var table = '<table border="1">';
    
    for (var row = 0; row < rows; row++) {
        console.log()
        table += '<tr>';
        table += '<td><input name="col0" type="text"></td>';
        table += '<td><input name="col1" type="number" min=0></td>';
        table += '</tr>';
    }
    
    table += '</table>';
    document.getElementById('table-container').innerHTML = table;
}

generateTableWithInputs(20); // 請求生成一個4行2列的表格，每個單元格都有輸入框


document.getElementById('getFilled').addEventListener('click', () => {
    const inputs = document.querySelectorAll('#table-container input');
    const filledInputs = Array.from(inputs).filter(input => input.value.trim() !== '');
    prizesList = []
    filledInputs.forEach(input => {
        if (input.name === 'col0' && input.value.trim() !== '') {
            _name = input.value.trim();
        } else if (input.name === 'col1' && input.value.trim() !== '') {
            quantity = parseInt(input.value.trim(), 10);
        }
        if (_name && quantity > 0) {
            prizesList.push({ name: _name, quantity: quantity });
            _name = '';
            quantity = 0;
        }
    });

    if (filledInputs.length === 0) {
        console.log('沒有填入資料的單元格');
    }
    updateBoard();
});


document.addEventListener('DOMContentLoaded', () => {
    col.addEventListener('input', updateBoard);
    row.addEventListener('input', updateBoard);
    updateBoard();
});

function updateBoard() {
    let col = parseInt(document.getElementById('col').value);
    let row = parseInt(document.getElementById('row').value);
    board.innerHTML = ''; // 清空遊戲板
    board.style.gridTemplateColumns = `repeat(${col}, 80px)`;
    const totalCells = col * row;
    let cells = [];
    const punchedCells = new Set();

    // 填充獎品到cells陣列
    prizesList.forEach(prize => {
        for (let i = 0; i < prize.quantity; i++) {
            cells.push(prize.name);
        }
    });

    // 填充剩餘的格子為"銘謝惠顧"
    while (cells.length < totalCells) {
        cells.push('銘謝惠顧');
    }

    // 打亂cells陣列
    cells.sort(() => Math.random() - 0.5);

    // 生成格子
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.onclick = () => {
            if (!punchedCells.has(i)) {
                cell.textContent = cells[i]; // 戳破後顯示獎品名稱或"銘謝惠顧"
                cell.classList.add('punched'); // 標記為已戳破
                punchedCells.add(i); // 記錄索引
            }
        };
        board.appendChild(cell);
    }
}