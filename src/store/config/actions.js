export function setLangs (context, data) {
  context.commit('setLangs', data)
}

export function setSelectedLang (context, l) {
  context.commit('setSelectedLang', l)
}

export function setAuth (context, a) {
  context.commit('setAuth', a)
}
