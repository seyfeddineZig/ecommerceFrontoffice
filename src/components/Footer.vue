<template>
        <div class="row bg-grey-1">
        <div class="col-12 text-center">
            <q-btn
            flat
            size="sm"
            v-for="(l,i) in langs"
            :key="i"
            :color="lang.id === l.id ? 'red-8' : ''"
            :label="l.full_name"
            @click="setLang(l)"
            />
        </div>
      </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {
    }
  },
  computed: {
    lang () {
      return this.$store.getters['config/getSelectedLang']
    },
    langs () {
      return this.$store.getters['config/getLangs']
    }
  },

  methods: {
    setLang (l) {
      localStorage.setItem('lang', l.id)
      this.$store.dispatch('config/setSelectedLang', l)
      this.$i18n.locale = l.short_name.toLowerCase()
    }
  }
}
</script>
