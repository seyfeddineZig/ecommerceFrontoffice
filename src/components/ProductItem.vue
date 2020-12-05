<template>
      <q-card class="no-shadow cursor-pointer" @click="$router.push('/product/' + data.id)">
      <q-img
      class="bg-grey-3"
      :src="data.default_image !== null && data.default_image !== ''
      ? $axios.defaults.baseURL.replace('api', 'images') + data.default_image : 'no_photo.png'"
      :ratio="4/3" />

      <q-card-section>
        <div class="text-caption text-weight-bold">{{ data.price + ' DZD' }}</div>
        <div class="text-caption">{{ data.name }}</div>
      </q-card-section>
    </q-card>

</template>

<script>
export default {
  name: 'ProductItem',
  props: ['data'],
  data () {
    return {}
  }
}
</script>
