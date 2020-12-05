<template>
      <q-card class="no-shadow cursor-pointer text-center" @click="$router.push('/brand/' + data.id)">
      <q-img
      class="bg-grey-3"
      :src="data.image !== null && data.image !== ''
      ? $axios.defaults.baseURL.replace('api', 'images') + data.image : 'no_photo.png'"
      :ratio="16/9" />
    </q-card>

</template>

<script>
export default {
  name: 'CategoryItem',
  props: ['data'],
  data () {
    return {}
  }
}
</script>
