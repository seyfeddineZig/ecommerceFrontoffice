<template>
  <q-list>
    <q-item class="bg-grey-1">
      <q-item-section>
        <q-item-label class="text-weight-bold text-red-8">Catégories</q-item-label>
      </q-item-section>
    </q-item>
    <q-expansion-item
      v-for="(c, i) in categories.filter(el => el.product_category_id === null)"
      :key="i"
      expand-separator
      dense-toggle
      :label="c.name"
      class="text-weight-bold"
    >
      <q-list class="bg-white">
        <q-item
        class="q-pl-lg text-weight-regular"
          v-for="(s, j) in categories.filter(el => el.product_category_id === c.id)"
          :key="j"
          clickable
          @click="$router.push('/Category/' + s.id)"
        >
          <q-item-section>{{ s.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
  </q-list>
</template>

<script>
export default {
  name: 'ProductCategoriesList',
  props: ['categories'],
  data () {
    return {}
  }
}
</script>
