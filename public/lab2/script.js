const form = document.getElementById('form-id');
const startButton = document.getElementById('start');
const balCanvasMeret = 300;
const jobbCanvasMeret = 300;
const magassagCanvas = 600;
const nagyCanvas = document.getElementById('muveletek-canvas');
const randomEredmenyek = [];
let jatekIndult = false;
let kivalasztottTeglalap = null;
const feladatok = [];
const eredmenyek = [];
const vonalak = [];
const helyesVonalak = [];
const kivalasztottTeglalapokBal = [];
const kivalasztottTeglalapokJobb = [];
const befejezettTeglalapokBal = [];
const befejezettTeglalapokJobb = [];

function clickBal(teglalap) {
  if (befejezettTeglalapokBal.includes(teglalap)) {
    return -1;
  }
  kivalasztottTeglalapokBal.push(teglalap);
  return 1;
}

function clickJobb(teglalap) {
  if (befejezettTeglalapokJobb.includes(teglalap)) {
    return -1;
  }
  kivalasztottTeglalapokJobb.push(teglalap);
  return 1;
}

function feladatokGeneralasa(muveletek) {
  for (let i = 0; i < form.kerdesek.value; ++i) {
    const randomMuvelet = Math.random() * muveletek.length;
    const szam1 = Math.floor(Math.random() * 100);
    const szam2 = Math.floor(Math.random() * 100);
    feladatok.push(`${szam1} ${muveletek[Math.floor(randomMuvelet)]} ${szam2}`);
    if (muveletek[Math.floor(randomMuvelet)] === '+') {
      eredmenyek.push(`${szam1 + szam2}`);
      randomEredmenyek.push(`${szam1 + szam2}`);
    } else if (muveletek[Math.floor(randomMuvelet)] === '-') {
      eredmenyek.push(`${szam1 - szam2}`);
      randomEredmenyek.push(`${szam1 - szam2}`);
    } else if (muveletek[Math.floor(randomMuvelet)] === '*') {
      eredmenyek.push(`${szam1 * szam2}`);
      randomEredmenyek.push(`${szam1 * szam2}`);
    } else if (muveletek[Math.floor(randomMuvelet)] === '/') {
      eredmenyek.push(`${szam1 / szam2}`);
      randomEredmenyek.push(`${szam1 / szam2}`);
    }
  }
}
function feladatokRajzolas() {
  const canvas = nagyCanvas.getContext('2d');
  canvas.clearRect(0, 0, balCanvasMeret, magassagCanvas);
  for (let i = 0; i < form.kerdesek.value; ++i) {
    const x = 10;
    const y = i * 50 + 20;
    canvas.fillStyle = 'red';
    canvas.fillRect(x, y, balCanvasMeret - 20, 30);
    canvas.fillStyle = 'white';
    canvas.font = '20px Times New Roman';
    canvas.fillText(feladatok[i], x + 10, y + 20);
  }
}
function keveres() {
  let index = randomEredmenyek.length;

  while (index !== 0) {
    const randomIndex = Math.floor(Math.random() * index);
    index--;
    [randomEredmenyek[index], randomEredmenyek[randomIndex]] = [randomEredmenyek[randomIndex], randomEredmenyek[index]];
  }
}
function megoldasokRajzolas() {
  const canvas = nagyCanvas.getContext('2d');
  canvas.clearRect(balCanvasMeret, 0, jobbCanvasMeret, magassagCanvas);
  if (kivalasztottTeglalap == null) {
    keveres();
  }
  for (let i = 0; i < form.kerdesek.value; ++i) {
    const x = balCanvasMeret + 100;
    const y = i * 50 + 20;
    canvas.fillStyle = 'green';
    canvas.fillRect(x, y, jobbCanvasMeret - 20, 30);
    canvas.fillStyle = 'red';
    canvas.font = '20px Times New Roman';
    canvas.fillText(randomEredmenyek[i], x + 10, y + 20);
  }
}
function FeladatValasztas(event) {
  if (
    event.offsetX < balCanvasMeret &&
    event.offsetY / 50 <= form.kerdesek.value &&
    clickBal(Math.floor(event.offsetY / 50)) === 1
  ) {
    const canvas = nagyCanvas.getContext('2d');
    canvas.clearRect(0, 0, balCanvasMeret, magassagCanvas);
    const kivalasztott = Math.floor(event.offsetY / 50);
    feladatokRajzolas();
    canvas.fillStyle = 'blue';
    canvas.fillRect(10, kivalasztott * 50 + 20, balCanvasMeret - 20, 30);
    canvas.fillStyle = 'white';
    canvas.font = '20px Times New Roman';
    canvas.fillText(feladatok[kivalasztott], 20, kivalasztott * 50 + 40);
    kivalasztottTeglalap = kivalasztott;
  }
}
function MegoldasValasztas(event) {
  if (
    event.offsetX >= balCanvasMeret &&
    event.offsetY / 50 <= form.kerdesek.value &&
    clickBal(kivalasztottTeglalap) === 1 &&
    clickJobb(Math.floor(event.offsetY / 50)) === 1
  ) {
    const canvas = nagyCanvas.getContext('2d');
    if (kivalasztottTeglalap != null) {
      const x1 = balCanvasMeret - 20;
      const y1 = kivalasztottTeglalap * 50 + 40;
      const x2 = balCanvasMeret + 110;
      const y2 = event.offsetY;
      vonalak.push({ x1, y1, x2, y2 });
      befejezettTeglalapokBal.push(kivalasztottTeglalap);
      console.log(kivalasztottTeglalap);
      befejezettTeglalapokJobb.push(Math.floor(event.offsetY / 50));
      console.log(befejezettTeglalapokBal);
      if (randomEredmenyek[Math.floor(y2 / 50)] === eredmenyek[kivalasztottTeglalap]) {
        helyesVonalak.push({ x1, y1, x2, y2 });
      }
      feladatokRajzolas();
      megoldasokRajzolas();
      vonalak.forEach((vonal) => {
        canvas.beginPath();
        canvas.moveTo(vonal.x1, vonal.y1);
        canvas.lineTo(vonal.x2, vonal.y2);
        canvas.strokeStyle = 'black';
        canvas.lineWidth = 2;
        canvas.stroke();
      });
    }
    if (vonalak.length === parseInt(form.kerdesek.value, 10)) {
      console.log('Minden parositas megtortent.');
      nagyCanvas.removeEventListener('click', FeladatValasztas);
      nagyCanvas.removeEventListener('click', MegoldasValasztas);
      helyesVonalak.forEach((vonal) => {
        canvas.beginPath();
        canvas.moveTo(vonal.x1, vonal.y1);
        canvas.lineTo(vonal.x2, vonal.y2);
        canvas.strokeStyle = 'green';
        canvas.lineWidth = 2;
        canvas.stroke();
      });
      canvas.fillStyle = 'red';
      canvas.font = '30px Times New Roman';
      canvas.fillText('Jatek Vege!!', 300, 300);
    }
  }
}

function jatek(event) {
  let check = false;
  event.preventDefault();
  if (!jatekIndult) {
    form.felhasznalonev.disabled = true;
    form.osszeadas.disabled = true;
    form.kivonas.disabled = true;
    form.szorzas.disabled = true;
    form.osztas.disabled = true;
    form.kerdesek.disabled = true;
    startButton.innerText = 'Újra kezdés';
    jatekIndult = true;
    const muveletek = [];
    if (form.osszeadas.checked) {
      muveletek.push('+');
      check = true;
    }
    if (form.kivonas.checked) {
      muveletek.push('-');
      check = true;
    }
    if (form.szorzas.checked) {
      muveletek.push('*');
      check = true;
    }
    if (form.osztas.checked) {
      muveletek.push('/');
      check = true;
    }
    if (!check) {
      return;
    }
    feladatokGeneralasa(muveletek);
    feladatokRajzolas();
    megoldasokRajzolas();
    nagyCanvas.addEventListener('click', FeladatValasztas);
    nagyCanvas.addEventListener('click', MegoldasValasztas);
  } else {
    form.felhasznalonev.disabled = false;
    form.osszeadas.disabled = false;
    form.kivonas.disabled = false;
    form.szorzas.disabled = false;
    form.osztas.disabled = false;
    form.kerdesek.disabled = false;
    form.osszeadas.checked = false;
    form.kivonas.checked = false;
    form.szorzas.checked = false;
    form.osztas.checked = false;
    form.kerdesek.value = 5;
    startButton.innerText = 'Start';
    nagyCanvas.getContext('2d').clearRect(0, 0, nagyCanvas.width, nagyCanvas.height);
    feladatok.length = 0;
    eredmenyek.length = 0;
    randomEredmenyek.length = 0;
    vonalak.length = 0;
    helyesVonalak.length = 0;
    kivalasztottTeglalap = null;
    jatekIndult = false;
    kivalasztottTeglalapokBal.length = 0;
    kivalasztottTeglalapokJobb.length = 0;
    befejezettTeglalapokBal.length = 0;
    befejezettTeglalapokJobb.length = 0;
  }
}
startButton.addEventListener('click', jatek);
