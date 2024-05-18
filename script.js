
let prizesList = [{ name: '', quantity: 0 , itemname: ''},]
let _name = '';
let quantity = 0;
let items = [];
let fontsz = 42;
const board = document.getElementById('game-board');


function generateTableWithInputs(rows) {
    var table = '<table border="1">';
    const AZ = ['A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T']
    for (var row = 0; row < rows; row++) {
        table += '<tr>';
        table += '<td><input name="col0" type="text"' + `value="${AZ[row]}賞"` + '></td>';
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
    prizesList = []
    filledInputs.forEach(input => {
        if (input.name === 'col0' && input.value.trim() !== '') {
            _name = input.value.trim();
        } else if (input.name === 'col1' && input.value.trim() !== '') {
            _itemname = parseInt(input.value.trim(), 10);
        } else if (input.name === 'col2' && input.value.trim() !== '') {
            quantity = parseInt(input.value.trim(), 10);
        }
        if (_name && quantity > 0) {
            prizesList.push({ name: _name, quantity: quantity, itemname: _itemname });
            _name = '';
            quantity = 0;
            _item = '';
        }
    });

    if (filledInputs.length === 0) {
        console.log('沒有填入資料的單元格');
    }
    updateBoard();
    adjustBackgroundSize();
    applyImage()
});

document.getElementById('imageupdate').addEventListener('click', () => {
    adjustBackgroundSize();
    applyImage();
})


function getItemName(prizeName) {
    for (let prize of prizesList) {
      if (prize.name === prizeName) {
        return prize.itemname;
      }
    }
    return '銘謝惠顧';
  }

function updateBoard() {
    let col = parseInt(document.getElementById('col').value);
    let row = parseInt(document.getElementById('row').value);
    const checkmsg = document.createElement('div');
    const msgbox = document.createElement('div');
    const msgtext = document.createElement('span');
    const msgbt = document.createElement('button');
    checkmsg.id='check-msg';
    checkmsg.style.display='none';
    msgbox.id='msg-box';
    msgbox.style.display='none';
    msgtext.id='msg-text';
    msgbt.id='msg-bt';
    msgbt.textContent="OK"
    msgbox.appendChild(msgtext)
    msgbox.appendChild(msgbt)
    checkmsg.appendChild(msgbox)

    board.innerHTML = '';
    board.appendChild(checkmsg)
    board.style.gridTemplateColumns = `repeat(${col}, ${fontsz}px)`;
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
                msg(getItemName(cells[i]));
                cell.classList.add('punched');
                punchedCells.add(i);
            }
        };
        board.appendChild(cell);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    col.addEventListener('input', updateBoard);
    row.addEventListener('input', updateBoard);
    updateBoard();

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

function adjustBackgroundSize() {
    //const gameBoard = document.getElementById('game-board');
    size_h = board.offsetHeight
    size_w = board.offsetWidth
    document.querySelectorAll('.cell').forEach(function (cell) {
        cell.style.backgroundSize = `${size_w}px ${size_h}px`;
    });
}

function applyImage() {
    var fileInput = document.getElementById('imageInput');
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var newClassName = "new-background";
            var backgroundImageUrl = `${e.target.result}`;
            var style = document.getElementById('new-background-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'new-background-style';
                document.head.appendChild(style);
            } else {
                while (style.sheet.cssRules.length) {
                    style.sheet.deleteRule(0);
                }
            }
            style.sheet.insertRule(`.${newClassName} { background-image: url('${backgroundImageUrl}'); }`, 0);

            document.querySelectorAll('.cell').forEach(function (element) {
                element.classList.remove("cell");
                element.classList.add("cell-base");
                element.classList.remove("new-background");
                element.classList.add("new-background");
            });
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function msg(m=""){
    const checkmsg = document.getElementById('check-msg');
    const msgBox = document.getElementById('msg-box');
    const msgText = document.getElementById('msg-text');
    const msgBt = document.getElementById('msg-bt');
    checkmsg.style.display='flex';
    msgBox.style.display='flex';
    msgText.textContent = `${m}`;
    msgBt.onclick = function() {
        msgBox.style.display='none'
        checkmsg.style.display='none'
    }
}


document.getElementById('color1').addEventListener('input', function() {
    const color = this.value;
    document.getElementById('game-board').style.borderColor = color;
    document.getElementById('game-board').style.backgroundColor = color;
});

document.getElementById('slider').addEventListener('input', function() {
    const slider = this.value;
    document.getElementById('game-board').style.gap = `${slider}px`;
})

document.getElementById('slider3').addEventListener('input', function() {
    const slider = this.value;
    let col = parseInt(document.getElementById('col').value);
    document.getElementById('game-board').style.fontSize = `${slider}px`;
    let wh=(slider-10)*3+20
    document.getElementById('game-board').style.gridTemplateColumns = `repeat(${col}, ${wh+10}px)`;
    fontsz=wh+10
})

document.getElementById('slider1').addEventListener('input', function() {
    const slider = this.value;
    document.getElementById('game-board').style.maxWidth = `${slider}px`;
})

document.getElementById('slider2').addEventListener('input', function() {
    const slider = this.value;
    document.getElementById('game-board').style.maxHeight = `${slider}px`;
})


