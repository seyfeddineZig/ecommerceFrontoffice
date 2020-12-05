<template>
  <q-list v-if="getAuth !== null">
    <q-item class="bg-grey-2">
      <q-item-section top avatar>
        <q-avatar>
          <img
            :src="getAuth.image !== null && getAuth.image !== ''
      ? $axios.defaults.baseURL.replace('api', 'images') + getAuth.image : 'no_photo.png'"
          >
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ getAuth.last_name + ' ' + getAuth.first_name }}</q-item-label>
        <q-item-label caption>{{ getAuth.email }}</q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-item-label caption>
          <q-icon
            name="eva-edit-outline"
            class="cursor-pointer"
            size="sm"
            @click="$router.push('/profile')"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item clickable @click="$router.push('/Cart')">
      <q-item-section>Mon panier</q-item-section>
    </q-item>
    <q-item clickable @click="$router.push('/Orders')">
      <q-item-section>Mes commandes</q-item-section>
    </q-item>
    <q-item clickable @click="$router.push('/Chat')">
      <q-item-section>Messagerie</q-item-section>
    </q-item>
    <q-item clickable @click="logout">
      <q-item-section avatar>
        <q-icon color="red-8" name="eva-log-out-outline"/>
      </q-item-section>
      <q-item-section class="text-red-8">Deconnexion</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'CustomerSideBar',
  data () {
    return {}
  },
  computed: {
    getAuth () {
      return this.$store.getters['config/getAuth']
    }
  },
  methods: {
    logout () {
      this.$axios.post('disconnect').then(res => {
        localStorage.removeItem('T')
        this.$router.go()
      })
    }
  }
}
</script>
