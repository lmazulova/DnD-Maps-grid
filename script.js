const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let startX, startY, squareSize;
let userSquare = null; // Сохраняем нарисованный пользователем квадрат
let image = null; // Сохраняем изображение

// Обработчик для загрузки изображения
function drawImageOnCanvas() {
    const input = document.getElementById('imageInput');
    
    input.addEventListener('change', function () {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = function (event) {
            image = new Image();
            image.src = event.target.result;
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
            };
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    });
}

// Обработчик для начала рисования
canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;
});

// Обработчик для завершения рисования
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    userSquare = { x: startX, y: startY, size: squareSize };
    ctx.beginPath(); // Завершает текущее рисование
});

// Обработчик для рисования квадрата во время движения мыши
canvas.addEventListener('mousemove', (event) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Определяем размер квадрата
    squareSize = Math.min(Math.abs(mouseX - startX), Math.abs(mouseY - startY));

    // Очищаем холст и перерисовываем изображение
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    // Рисуем квадрат
    ctx.strokeRect(startX, startY, squareSize, squareSize);
});

// Генерация сетки на основе нарисованного пользователем квадрата
document.getElementById('generateGridBtn').addEventListener('click', () => {
    if (!userSquare) {
        alert('Please draw a square first!');
        return;
    }

    const { x, y, size } = userSquare;

    // Очищаем холст и рисуем изображение снова
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

// Получаем цвет и толщину линий из пользовательского ввода
const gridColorInput = document.getElementById('gridColor').value;
const lineWidthInput = document.getElementById('lineWidth').value;
const lineOpacityInput = document.getElementById('lineOpacity').value;
   
    // Устанавливаем цвет, прозрачность и толщину линий
ctx.strokeStyle = `rgb(${gridColorInput})`; 
const lineOpacity = lineOpacityInput / 100;  // Преобразование значения из диапазона 0-100 в 0-1
ctx.globalAlpha = lineOpacity;  // Устанавливаем прозрачность

ctx.lineWidth = lineWidthInput; // Толщина линий


    // Заполняем картинку сеткой квадратов, начиная с пользовательского квадрата
    for (let row = y; row < canvas.height; row += size) {
        for (let col = x; col < canvas.width; col += size) {
            ctx.strokeRect(col, row, size, size);
        }
    }
    for (let row = y; row >= -100; row -= size) {
        for (let col = x; col >= -100; col -= size) {
            ctx.strokeRect(col, row, size, size);
        }
    }
    for (let row = y; row < canvas.height; row += size) {
        for (let col = x; col >= -100; col -= size) {
            ctx.strokeRect(col, row, size, size);
        }
    }
    for (let row = y; row >= -100; row -= size) {
        for (let col = x; col < canvas.width; col += size) {
            ctx.strokeRect(col, row, size, size);
        }
    }
    
  
});

document.getElementById('lineOpacity').addEventListener('input', (e) => {
    const opacityValue = document.getElementById('opacityValue');
    opacityValue.textContent = `${e.target.value}%`;
});
// Скачивание финального изображения
document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'grid_image.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Инициализация загрузки изображения
drawImageOnCanvas();
