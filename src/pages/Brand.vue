<template>
  <q-page class="bg-grey-1 q-pa-md" padding>
    <div v-if="getBrandBySelectedLang" class="row q-pa-md">
      <div class="col-12">
        <q-card class="no-shadow bg-transparent">
          <q-card-section>
            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="text-h6 text-weight-bold q-mb-md">
                  {{ getBrandBySelectedLang.name }}
                </div>
                <div class="text-caption">
                  {{ getBrandBySelectedLang.description }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-pa-lg" v-if="getProductsBySelectedLang.length>0">
      <div
        class="col-md-3 col-sm-6 col-xs-6 q-pa-sm"
        v-for="(p, i) in getProductsBySelectedLang"
        :key="i"
      >
        <ProductItem :data="p"></ProductItem>
      </div>
    </div>
    <div v-if="getProductsBySelectedLang.length === 0 && fetched"  class="row q-pa-lg text-center text-subtitle1 text-grey-7">
      <div class="col-12">
        {{ $t('productsByBrandEmpty') }}
      </div>
    </div>

  </q-page>
</template>

<script>
import ProductItem from 'components/ProductItem'
// import ProductCategoriesList from 'components/ProductCategoriesList'
export default {
  name: 'PageBrand',
  data () {
    return {
      products: [],
      brand: [],
      fetched: false
    }
  },
  computed: {
    getAuth () {
      return this.$store.getters['config/getAuth']
    },
    getProductsBySelectedLang () {
      const lang = this.$store.getters['config/getSelectedLang']
      if (lang) {
        return this.products.filter(
          el => parseInt(el.lang_id) === parseInt(lang.id)
        )
      }
      return []
    },
    getBrandBySelectedLang () {
      const lang = this.$store.getters['config/getSelectedLang']
      if (lang) {
        return this.brand.find(
          el => parseInt(el.lang_id) === parseInt(lang.id)
        )
      }
      return null
    }
  },
  components: {
    ProductItem
    // ProductCategoriesList
  },
  mounted () {
    this.getBrand()
    this.getProducts()
  },
  methods: {
    getProducts () {
      this.$axios.get('/productsByBrand' + (this.getAuth === null ? 'ForVisitor' : '') + '/' + this.$route.params.id).then(res => {
        this.products = res.data
        this.fetched = true
      })
    },
    getBrand () {
      this.$axios.get('/brands/' + this.$route.params.id).then(res => {
        this.brand = res.data
      })
    }
  }
}
</script>
