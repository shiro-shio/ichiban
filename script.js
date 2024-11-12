// script.js

let prizesList = [{name: '', quantity: 0},]
let _name = '';
let quantity = 0;
let items = [];
const board = document.getElementById('game-board');


function generateTableWithInputs(rows) {
    var table = '<table border="1">';
    const AZ = ['A','B','C','D','E',
                'F','G','H','I','J',
                'K','L','M','N','O',
                'P','Q','R','S','T']
    for (var row = 0; row < rows; row++) {
        table += '<tr>';
        table += '<td><input name="col0" type="text"'+`value="${AZ[row]}賞"`+'></td>';
        table += '<td><input name="col1" type="text"></td>';
        table += '<td><input name="col2" type="number" min=0 value="0"></td>';
        table += '</tr>';
    }
    
    table += '</table>';
    document.getElementById('table-container').innerHTML = table;
}
generateTableWithInputs(20);


document.getElementById('getFilled').addEventListener('click', () => {
    const inputs = document.querySelectorAll('#table-container input');
    const filledInputs = Array.from(inputs).filter(input => input.value.trim() !== '');
    let prizesList = []
    let _name = '';let _itemname = '';let quantity = 0;
    filledInputs.forEach(input => {
        if (input.name === 'col0' && input.value.trim() !== '') {
            _name = input.value.trim();
        } else if (input.name === 'col2' && input.value.trim() !== '') {
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
    board.style.gridTemplateColumns = `repeat(${col}, 50px)`;
    const totalCells = col * row;
    let cells = [];
    const punchedCells = new Set();

    prizesList.forEach(prize => {
        for (let i = 0; i < prize.quantity; i++) {
            cells.push(prize.name);
        }
    });

    while (cells.length < totalCells) {
        cells.push('銘謝惠顧');
    }

    cells.sort(() => Math.random() - 0.5);

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.innerText = `${i}`
        cell.onclick = () => {
            if (!punchedCells.has(i)) {
                cell.textContent = cells[i];
                cell.classList.add('punched');
                punchedCells.add(i);
            }
        };
        board.appendChild(cell);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('#table-container input');
    inputs.forEach(input => {
        input.addEventListener('input', (event) => {
            const currentRow = event.target.closest('tr');
            const rowIndex = Array.from(currentRow.parentNode.children).indexOf(currentRow);
            if (!items[rowIndex]) {
                items[rowIndex] = [];
            }
            const rowInputs = currentRow.querySelectorAll('input');
            items[rowIndex] = Array.from(rowInputs).map(rowInput => {
                return rowInput.name === 'col2' ? parseInt(rowInput.value, 10) : rowInput.value;
            });
            //console.log(items);
            statistical()

        });
    });
});

function statistical() {
    let total = items.reduce((accumulator, currentValue) => {
        return accumulator + currentValue[2];
    }, 0); // 初始化累加器為0
    var messageElement = document.createElement('p');
    messageElement.textContent = `獎品總數: ${total}`;
    var messageContainer = document.getElementById('count');

    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageElement);
}
