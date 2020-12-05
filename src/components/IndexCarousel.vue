<template>
  <q-carousel
    animated
    v-model="slide"
    navigation
    infinite
    :autoplay="autoplay"
    arrows
    class="rounded-borders"
    transition-prev="slide-right"
    transition-next="slide-left"
    @mouseenter="autoplay = false"
    @mouseleave="autoplay = true"
    control-type="unelevated"
    control-color="transparent"
    control-text-color="red-8"
  >
    <template v-slot:navigation-icon="{ active, btnProps, onClick }">
      <q-btn
        v-if="active"
        size="md"
        icon="eva-radio-button-on"
        color="red-8"
        flat
        round
        dense
        @click="onClick"
      />
      <q-btn
        v-else
        size="sm"
        icon="eva-radio-button-on-outline"
        color="red-8"
        flat
        round
        dense
        @click="onClick"
      />
    </template>

    <q-carousel-slide
      v-for="(c, i) in items"
      :key="i"
      :name="i + 1"
      :img-src="c.type === 'IMAGE' ?
       $axios.defaults.baseURL.replace('api', 'images') + c.image : ''"
    >
      <q-video v-if="c.type === 'VIDEO'" class="absolute-full" :src="c.link"/>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
export default {
  name: 'indexCarousel',
  props: ['items'],
  data () {
    return {
      slide: 1,
      autoplay: true
    }
  }
}
</script>
