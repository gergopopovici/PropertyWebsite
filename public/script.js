function clearIndex() {
  document.getElementById('varos').value = '';
  document.getElementById('kerulet').value = '';
  document.getElementById('minar').value = '';
  document.getElementById('maxar').value = '';
}
function clearKep() {
  document.getElementById('kep').value = '';
}
function clearHirdet() {
  document.getElementById('varos').value = '';
  document.getElementById('kerulet').value = '';
  document.getElementById('felszinterulet').value = '';
  document.getElementById('ar').value = '';
  document.getElementById('szobak').value = '';
  document.getElementById('datum').value = '';
}
function clearLogin() {
  document.getElementById('felhasznalonev').value = '';
  document.getElementById('jelszo').value = '';
}
function clearRegisterForm() {
  document.getElementById('felhasznalonev').value = '';
  document.getElementById('jelszo').value = '';
  document.getElementById('email').value = '';
  document.getElementById('nev').value = '';
  document.getElementById('jelszo2').value = '';
}
function checkFormUzenet() {
  const cimzet = document.getElementById('felhasznaloValaszto').value;
  const uzenet = document.getElementById('uzenet').value;
  if (cimzet === '') {
    alert('Válasszon címzettet!');
    return false;
  }
  if (uzenet === '') {
    alert('Írjon üzenetet!');
    return false;
  }
  return true;
}
function checkUzenetMegtekint() {
  const felhasznalo = document.getElementById('felhasznaloValaszto2').value;
  if (felhasznalo === '') {
    alert('Válasszon felhaszálót!');
    return false;
  }
  return true;
}
function checkFormLogin() {
  const felhasznalonev = document.getElementById('felhasznalonev').value;
  const jelszo = document.getElementById('jelszo').value;
  if (felhasznalonev === '') {
    alert('Adja meg a felhasználónevet!');
    return false;
  }
  if (jelszo === '') {
    alert('Adja meg a jelszót!');
    return false;
  }
  return true;
}
function checkFormKep() {
  const adId = document.getElementById('adId').value;
  const image = document.getElementById('kep').value;
  if (/[^0-9]/.test(adId)) {
    alert('Az azonosító csak szám lehet!');
    return false;
  }
  if (adId === '') {
    alert('Adja meg a hirdetés azonosítóját!');
    return false;
  }
  if (image === '') {
    alert('Töltse fel a képet!');
    return false;
  }
  const validImage = ['jpg', 'jpeg', 'png'];
  const ext = image.split('.').pop().toLowerCase();
  if (!validImage.includes(ext)) {
    alert('Csak jpg, jpeg és png formátumú képet lehet feltölteni!');
    return false;
  }
  return true;
}

function checkFormHirdet() {
  const varos = document.getElementById('varos').value;
  const kerulet = document.getElementById('kerulet').value;
  const felszinterulet = document.getElementById('felszinterulet').value;
  const ar = document.getElementById('ar').value;
  const szobak = document.getElementById('szobak').value;
  const datum = document.getElementById('datum').value;
  if (varos === '') {
    alert('Adja meg a város nevét!');
    return false;
  }
  if (/[^a-zA-Z-]/.test(varos)) {
    alert('A város neve nem tartalmazhat szóközt vagy számot!');
    return false;
  }

  if (kerulet === '') {
    alert('Adja meg a kerületet!');
    return false;
  }
  if (felszinterulet < 10) {
    alert('A felszínterület nem lehet kevesebb mint 10m^2!');
    return false;
  }
  if (/[^0-9]/.test(felszinterulet)) {
    alert('A felszínterület csak szám lehet!');
    return false;
  }
  if (ar < 0) {
    alert('Az ár nem lehet negatív szám!');
    return false;
  }
  if (/[^0-9]/.test(ar)) {
    alert('Az ár csak szám lehet!');
    return false;
  }
  if (szobak < 0) {
    alert('A szobák száma nem lehet negatív szám!');
    return false;
  }
  if (/[^0-9]/.test(szobak)) {
    alert('A szobák száma csak szám lehet!');
    return false;
  }
  if (datum === '') {
    alert('Adja meg a hirdetés dátumát!');
    return false;
  }
  if (new Date(datum) > new Date()) {
    alert('A dátum nem lehet a jövőben!');
    return false;
  }
  return true;
}

function checkFormRegister() {
  const felhasznalonev = document.getElementById('felhasznalonev').value;
  const jelszo = document.getElementById('jelszo').value;
  const email = document.getElementById('email').value;
  const nev = document.getElementById('nev').value;
  const jelszo2 = document.getElementById('jelszo2').value;
  if (nev === '') {
    alert('Adja meg a nevet!');
    return false;
  }
  if (felhasznalonev === '') {
    alert('Adja meg a felhasználónevet!');
    return false;
  }
  if (email === '') {
    alert('Adja meg az email címet!');
    return false;
  }
  if (jelszo === '') {
    alert('Adja meg a jelszót!');
    return false;
  }
  if (jelszo2 === '') {
    alert('Adja meg a jelszót mégegyszer!');
    return false;
  }
  if (jelszo !== jelszo2) {
    alert('A két jelszó nem egyezik!');
    return false;
  }
  return true;
}

function moreInfo(data, moreInformation) {
  while (moreInformation.firstChild) {
    moreInformation.removeChild(moreInformation.firstChild);
  }
  const szobak = document.createElement('p');
  szobak.textContent = `Szobák száma: ${data.Szobak}`;
  moreInformation.appendChild(szobak);
  const datum = document.createElement('p');
  datum.textContent = `Hirdetés dátuma: ${data.Datum}`;
  moreInformation.appendChild(datum);
}

const clearButton = document.getElementById('clear');
const clearKepButton = document.getElementById('clear-kep');
const clearHirdetButton = document.getElementById('clear-hirdet');
const submitButtonKep = document.getElementById('feltolt');
const submitButtonHirdet = document.getElementById('hirdet');
const sorElements = document.querySelectorAll('.sor');
const deleteKepElements = document.querySelectorAll('.delete-kep');
const deleteLogin = document.getElementById('clear-bejelentkezes');
const submitLogin = document.getElementById('bejelentkezes');
const submitRegister = document.getElementById('regisztracio');
const clearRegister = document.getElementById('clear-regisztracio');
const deleteHirdetes = document.querySelectorAll('.delete-hirdetes');
const deleteHirdetesUser = document.querySelector('.hirdetesTorleseFelhasznalo');
const filterFelhasznalo = document.getElementById('kereses');
const uzenetKuldes = document.getElementById('uzenetkuld');
const uzenetTekint = document.getElementById('uzenetekMegtekint');
document.getElementById('logo').addEventListener('click', () => {
  window.location.href = '/';
});
if (clearButton) {
  clearButton.addEventListener('click', clearIndex);
  sorElements.forEach((sorElement) => {
    sorElement.addEventListener('click', (event) => {
      let { target } = event;
      while (target != null && !target.classList.contains('hirdetes')) {
        target = target.parentElement;
      }
      const id = target.getAttribute('hirdetes-id');
      fetch(`/hirdetes/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Hiba történt a kérés során');
          }
          return res.json();
        })
        .then((hirdetes) => {
          const moreInformation = document.getElementById(id);
          moreInfo(hirdetes[0], moreInformation);
        })
        .catch((err) => {
          console.error(err);
          alert('Hiba történt a kérés során');
        });
    });
  });
}
if (clearKepButton) {
  clearKepButton.addEventListener('click', clearKep);
  deleteKepElements.forEach((deleteKepElement) => {
    deleteKepElement.addEventListener('click', (event) => {
      const id = event.target.getAttribute('kep-id');
      fetch(`/post/kep/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Hiba történt a kérés során');
          }
          return res;
        })
        .then(() => {
          event.target.parentElement.remove();
        })
        .catch((err) => {
          console.error(err);
          alert('hiba történt a kérés során');
        });
    });
  });
}
if (clearHirdetButton) {
  clearHirdetButton.addEventListener('click', clearHirdet);
}
if (submitButtonKep) {
  submitButtonKep.addEventListener('click', (event) => {
    if (!checkFormKep()) {
      event.preventDefault();
    }
  });
}

if (submitButtonHirdet) {
  submitButtonHirdet.addEventListener('click', (event) => {
    if (!checkFormHirdet()) {
      event.preventDefault();
    }
  });
}
if (deleteLogin) {
  deleteLogin.addEventListener('click', clearLogin);
}
if (submitLogin) {
  submitLogin.addEventListener('click', (event) => {
    if (!checkFormLogin()) {
      event.preventDefault();
    }
  });
}

if (submitRegister) {
  submitRegister.addEventListener('click', (event) => {
    if (!checkFormRegister()) {
      event.preventDefault();
    }
  });
}
if (clearRegister) {
  clearRegister.addEventListener('click', clearRegisterForm);
}
if (uzenetKuldes) {
  uzenetKuldes.addEventListener('click', (event) => {
    if (!checkFormUzenet()) {
      event.preventDefault();
    }
  });
}
if (uzenetTekint) {
  uzenetTekint.addEventListener('click', (event) => {
    if (!checkUzenetMegtekint()) {
      event.preventDefault();
    }
  });
}
document.querySelectorAll('.admin-checkbox').forEach((checkbox) => {
  checkbox.addEventListener('change', async (event) => {
    const felhasznaloID = event.target.getAttribute('adminCheckBoxID');
    const csoportID = event.target.checked ? 1 : 2;
    const res = await fetch('/post/updateAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ felhasznaloID, csoportID }),
    });
    if (!res.ok) {
      alert('Hiba történt az adminisztrálás során során');
    }
    window.location.reload();
  });
});
deleteHirdetes.forEach((deleteHirdet) => {
  deleteHirdet.addEventListener('click', (event) => {
    const id = event.target.getAttribute('hirdetes-id');
    fetch(`/post/hirdetesek/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Hiba történt a kérés során');
        }
        return res;
      })
      .then(() => {
        event.target.parentElement.remove();
      })
      .catch((err) => {
        console.error(err);
        alert('hiba történt a kérés során');
      });
  });
});
if (filterFelhasznalo) {
  filterFelhasznalo.addEventListener('input', (e) => {
    const filter = e.target.value.toUpperCase();
    const rows = document.querySelector('.tableUsers').querySelectorAll('tr');
    rows.forEach((row) => {
      const name = row.cells[3].innerText.toUpperCase();
      row.style.display = name.includes(filter) ? '' : 'none';
    });
  });
}
if (deleteHirdetesUser) {
  deleteHirdetesUser.addEventListener('click', (event) => {
    const id = event.currentTarget.getAttribute('hirdetesFelhasznalo-id');
    fetch(`/post/hirdetesUserDelete/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Hiba történt a kérés során');
        }
        return res;
      })
      .then(() => {
        window.location.href = '/';
      })
      .catch((err) => {
        console.error(err);
        alert('hiba történt a kérés során');
      });
  });
}
