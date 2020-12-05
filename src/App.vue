<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  computed: {
    getLang () {
      return this.$store.getters['config/getSelectedLang']
    }
  },
  mounted () {
    this.getLangs()
    this.getAuth()
  },
  methods: {
    getLangs () {
      this.$axios.get('/langs').then(res => {
        const langs = res.data
        this.$store.dispatch('config/setLangs', langs)
        let id
        if (localStorage.getItem('lang') !== null) {
          id = localStorage.getItem('lang')
        } else {
          localStorage.setItem('lang', 1)
          id = 1
        }
        const selectedLang = langs.find(el => parseInt(id) === parseInt(el.id))
        this.$store.dispatch('config/setSelectedLang', selectedLang)
        this.$i18n.locale = selectedLang.short_name.toLowerCase()
      })
    },
    getAuth () {
      if (localStorage.getItem('T') !== null) {
        this.$axios
          .get('auth')
          .then(res => {
            this.$store.dispatch('config/setAuth', res.data)
          })
          .catch(() => {
            // localStorage.removeItem('T')
            this.$router.push('/')
          })
      }
    }
  }
}
</script>
