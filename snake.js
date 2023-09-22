var canvas = document.getElementById('snakeCanvas');
var context = canvas.getContext('2d');
var score = 0;
var highScore = 0;


var gridSize = 20; // Ukuran grid yang lebih besar sesuai dengan canvas yang lebih besar

var snake = {
  x: 300, // Setengah dari lebar canvas
  y: 300, // Setengah dari tinggi canvas

  // Kecepatan ular. Bergerak satu panjang grid setiap frame baik di arah x maupun y
  dx: gridSize,
  dy: 0,

  // Melacak semua grid yang diisi oleh tubuh ular
  cells: [],

  // Panjang ular. Bertambah ketika memakan apel
  maxCells: 4
};
var apple = {
  x: getRandomInt(0, canvas.width / gridSize) * gridSize, // Koordinat x awal apel
  y: getRandomInt(0, canvas.height / gridSize) * gridSize // Koordinat y awal apel
};

// Fungsi untuk mendapatkan angka bulat acak dalam rentang tertentu
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Loop permainan
function loop() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Gerakkan ular sesuai dengan kecepatannya
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Bungkus posisi ular secara horizontal pada tepi layar
  if (snake.x < 0) {
    snake.x = canvas.width - gridSize;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // Bungkus posisi ular secara vertikal pada tepi layar
  if (snake.y < 0) {
    snake.y = canvas.height - gridSize;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // Simpan catatan di mana ular telah berada. Bagian depan array selalu kepala
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // Hapus sel-sel saat ular menjauh dari mereka
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  context.shadowColor = 'red'; // Warna bayangan sesuai dengan warna ular
  context.shadowBlur = 25;
  // Gambar apel
  context.fillStyle = 'red';
  context.beginPath();
  context.arc(apple.x + gridSize / 2, apple.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
  context.fill();

  // Gambar ular satu sel pada satu waktu
  context.fillStyle = '#0ef';
  context.shadowColor = '#0ef'; // Warna bayangan sesuai dengan warna ular
  context.shadowBlur = 25; // Ukuran blur bayangan sesuai dengan yang Anda inginkan
  snake.cells.forEach(function (cell, index) {
    // Menggambar 1 piksel lebih kecil dari grid menciptakan efek grid pada tubuh ular sehingga Anda bisa melihat seberapa panjangnya
    context.fillRect(cell.x, cell.y, gridSize, gridSize);

    // Jika ular memakan apel
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      if (score > highScore) {
        highScore = score;
      }
      document.getElementById('score').textContent = 'Score: ' + score;
      document.getElementById('high-score').textContent = 'High Score: ' + highScore;
      // canvas sekarang 600x600 yang setara dengan 20x20 grid (sesuai dengan gridSize)
      apple.x = getRandomInt(0, canvas.width / gridSize) * gridSize;
      apple.y = getRandomInt(0, canvas.height / gridSize) * gridSize;
    }

    // Periksa tabrakan dengan sel-sel setelah sel ini (sortir gelembabung yang diubah)
    for (var i = index + 1; i < snake.cells.length; i++) {
      // Ular menduduki ruang yang sama dengan bagian tubuh lain. Atur ulang permainan
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 300; // Setengah dari lebar canvas
        snake.y = 300; // Setengah dari tinggi canvas
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = gridSize;
        snake.dy = 0;
        
        apple.x = getRandomInt(0, canvas.width / gridSize) * gridSize;
        apple.y = getRandomInt(0, canvas.height / gridSize) * gridSize;
        score = 0;
        document.getElementById('score').textContent = 'Score: ' + score;
      }
    }
  });
}

document.addEventListener('keydown', function (e) {
  // Mencegah ular bergerak mundur dengan memeriksa bahwa ular tidak bergerak pada sumbu yang sama (menekan kiri saat bergerak
  // ke kiri tidak akan berpengaruh, dan menekan kanan saat bergerak ke kiri
  // tidak akan membiarkan Anda bertabrakan dengan tubuh Anda sendiri)

  switch (e.key) {
    case 'ArrowLeft':
      if (snake.dx === 0) {
        snake.dx = -gridSize;
        snake.dy = 0;
      }
      break;
    case 'ArrowUp':
      if (snake.dy === 0) {
        snake.dy = -gridSize;
        snake.dx = 0;
      }
      break;
    case 'ArrowRight':
      if (snake.dx === 0) {
        snake.dx = gridSize;
        snake.dy = 0;
      }
      break;
    case 'ArrowDown':
      if (snake.dy === 0) {
        snake.dy = gridSize;
        snake.dx = 0;
      }
      break;
  }
});

// Memulai loop permainan
setInterval(loop, 1000 / 15); // 60 fps
