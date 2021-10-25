/**
 * Estado da Aplicação (state)
 */
const globalState = {
  allDevelopers: [],
  filteredDevelopers: [],
  loadingData: true,
  checkboxJava: true,
  checkboxJavaScript: true,
  checkboxPython: true,
  radioAnd: false,
  radioOr: true
};

const globalInputName = document.querySelector('#inputName');
const globalCheckboxJava = document.querySelector('#checkboxJava');
const globalCheckboxJavaScript = document.querySelector('#checkboxJavaScript');
const globalCheckboxPython = document.querySelector('#checkboxPython');
const globalRadioAnd = document.querySelector('#radioAnd');
const globalRadioOr = document.querySelector('#radioOr');
const globalDivDevelopers = document.querySelector('#divDevelopers');

async function start() {
  await fetchDevelopers();

  globalInputName.addEventListener('input', handleInputChange);

  globalCheckboxJava.addEventListener('input', handleCheckboxClick);
  globalCheckboxJavaScript.addEventListener('input', handleCheckboxClick);
  globalCheckboxPython.addEventListener('input', handleCheckboxClick);

  globalRadioAnd.addEventListener('input', handleRadioClick);
  globalRadioOr.addEventListener('input', handleRadioClick);

  filterDevelopers();
}

async function fetchDevelopers() {
  const res = await fetch('http://localhost:3001/devs');
  const json = await res.json();

  const searchDevelopers = json.map(item => {
    const { name, programmingLanguages } = item;

    const lowerCaseName = name.toLocaleLowerCase();

    return {
      ...item,
      searchName: removeAccentMarksFrom(lowerCaseName)
        .split('')
        .filter(char => char !== ' ')
        .join(''),
      onlyLanguages: getOnlyLanguagesFrom(programmingLanguages)
    };
  });

  globalState.allDevelopers = [...searchDevelopers];
  globalState.filteredDevelopers = [...searchDevelopers];

  setTimeout(() => {
    globalState.loadingData = false;
    filterDevelopers();
  }, 2000);
}

function getPreloader() {
  //prettier-ignore
  return (
    `<div class=flexrow>
      <div class="preloader-wrapper small active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      <span style="margin-left: 20px">Carregando...</span>
    </div>`
  );
}

function handleInputChange() {
  filterDevelopers();
}

function handleRadioClick({ target }) {
  const radioId = target.id;

  globalState.radioAnd = radioId === 'radioAnd';
  globalState.radioOr = radioId === 'radioOr';

  filterDevelopers();
}

function handleCheckboxClick({ target }) {
  const checkboxId = target.id;
  globalState[checkboxId] = !globalState[checkboxId];

  filterDevelopers();
}

function getOnlyLanguagesFrom(programmingLanguages) {
  return programmingLanguages
    .map(({ language }) => language.toLocaleLowerCase())
    .sort();
}

function removeAccentMarksFrom(text) {
  const WITH_ACCENT_MARKS = 'áãâäàéèêëíìîïóôõöòúùûüñ'.split('');
  const WITHOUT_ACCENT_MARKS = 'aaaaaeeeeiiiiooooouuuun'.split('');

  const newText = text
    .toLocaleLowerCase()
    .split('')
    .map(char => {
      const index = WITH_ACCENT_MARKS.indexOf(char);

      if (index > -1) {
        return WITHOUT_ACCENT_MARKS[index];
      }

      return char;
    })
    .join('');

  return newText;
}

function filterDevelopers() {
  const { allDevelopers, radioOr } = globalState;

  const lowerCaseText = globalInputName.value.toLocaleLowerCase().trim();
  const textFromInput = removeAccentMarksFrom(lowerCaseText);

  const filterProgrammingLanguages = getFilteredProgrammingLanguages();

  let filteredDevelopers = allDevelopers.filter(({ onlyLanguages }) => {
    return radioOr
      ? filterProgrammingLanguages.some(item => onlyLanguages.includes(item))
      : filterProgrammingLanguages.join('') === onlyLanguages.join('');
  });

  if (textFromInput) {
    filteredDevelopers = filteredDevelopers.filter(({ searchName }) =>
      searchName.includes(textFromInput)
    );
  }

  globalState.filteredDevelopers = filteredDevelopers;
  renderDevelopers();
}

function getFilteredProgrammingLanguages() {
  const { checkboxJava, checkboxJavaScript, checkboxPython } = globalState;

  let filterProgrammingLanguages = [];

  if (checkboxJava) {
    filterProgrammingLanguages.push('java');
  }

  if (checkboxJavaScript) {
    filterProgrammingLanguages.push('javascript');
  }

  if (checkboxPython) {
    filterProgrammingLanguages.push('python');
  }
  return filterProgrammingLanguages;
}

function renderDevelopers() {
  if (globalState.loadingData) {
    globalDivDevelopers.innerHTML = getPreloader();
    return;
  }

  const { filteredDevelopers } = globalState;

  const developersToShow = filteredDevelopers
    .map(dev => {
      return renderDeveloper(dev);
    })
    .join('');

  const renderedHTML = `
      <div>
        <h2>${filteredDevelopers.length} Dev(s) Encontrados(s)</h2>
        <div class="row">
        <div class="developer-container">
          ${developersToShow}
          </div>
        </div>
      </div>
    `;

  globalDivDevelopers.innerHTML = renderedHTML;
}

function renderDeveloper(dev) {
  const { name, picture, programmingLanguages } = dev;

  return `
 
    <div class="developer-card">
    <img class="img-programming" src="${picture}" alt="${name}" />
    <div class="data">
      <span>${name}</span>
      <span>${renderProgrammingLanguages(programmingLanguages)}</span>
      
    </div>
  
 
  </div>
  `;
}

function renderProgrammingLanguages(programmingLanguages) {
  return programmingLanguages
    .map(({ language }) => {
      const src = `./img/${language.toLocaleLowerCase()}.png`;
      return `<img class='language' src='${src}' alt='${language}' title='${language}'/>`;
    })
    .join(' ');
}

start();
