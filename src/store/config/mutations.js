export function setLangs (state, data) {
  state.langs = data
  state.selectedLang = data.find(el => el.default === 1)
}

export function setSelectedLang (state, l) {
  state.selectedLang = l
}

export function setAuth (state, a) {
  state.auth = a
}
