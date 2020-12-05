<template>
  <q-dialog
    v-model="dialog"
    persistent
    maximized
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header height-hint="98">
        <q-toolbar class="bg-grey-2 text-white q-pa-sm">
          <q-btn
            flat
            round
            class="text-white bg-grey-3"
            color="red-8"
            icon="eva-arrow-back-outline"
            @click="$emit('closeDialog')"
          />
          <q-toolbar-title>
            <q-input dense color="red-8" label-color="grey-10" v-model="q" filled type="text" :label="$t('searchOnTheWebSite')" class="full-width"/>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  name: 'SearchComponent',
  props: ['dialog'],
  data () {
    return {
      q: ''
    }
  },
  watch: {
    dialog: function () {
      if (this.dialog) {
        this.q = ''
      }
    }
  }
}
</script>
