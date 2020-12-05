<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->
    <q-header class="bg-red-8 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <div class="q-mt-sm">
            <img
              class="cursor-pointer"
              src="icon.png"
              style="width: 130px"
              @click="$router.push('/')"
            >
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view/>
      <FooterComponent></FooterComponent>
    </q-page-container>
  </q-layout>
</template>

<script>
import FooterComponent from 'components/Footer'

export default {
  // name: 'LayoutName',

  data () {
    return {}
  },
  components: {
    FooterComponent
  }
}
</script>
