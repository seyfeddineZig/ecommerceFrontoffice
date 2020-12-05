<template>
  <q-page class="bg-grey-1 q-pa-md">
    <!--<div class="row q-pa-md">
      <div class="col-3">
        <ProductCategoriesList :categories="getProductCategoriesBySelectedLang"></ProductCategoriesList>
      </div>
    </div>-->
    <div v-if="getCarouselItems.length > 0" class="row q-pa-sm">
      <div class="col-12">
        <IndexCarousel :items="getCarouselItems"></IndexCarousel>
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-12">
        <q-carousel
          v-model="slide"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="red-8"
          navigation
          padding
          arrows
        >
          <template v-slot:navigation-icon="{ active, btnProps, onClick }">
            <q-btn
              v-if="active"
              size="sm"
              :icon="'eva-radio-button-on-outline'"
              color="red-8"
              flat
              round
              dense
              @click="onClick"
            />
            <q-btn
              v-else
              size="sm"
              :icon="'eva-radio-button-off'"
              color="red-8"
              flat
              round
              dense
              @click="onClick"
            />
          </template>
          <q-carousel-slide
            v-for="(g, i) in getGroupedCategories"
            :key="i"
            :name="i+1"
            class="column no-wrap"
          >
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <div class="col-md-2 col-sm-6 col-xs-6 q-pa-sm" v-for="(e, j) in g" :key="j">
                <CategoryItem :data="e"></CategoryItem>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>

    <div class="row q-pa-lg">
      <div
        class="col-md-3 col-sm-6 col-xs-6 q-pa-sm"
        v-for="(p, i) in getProductsBySelectedLang"
        :key="i"
      >
        <ProductItem :data="p"></ProductItem>
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-12">
        <q-carousel
          v-model="slide"

          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="red-8"
          padding
          arrows
          height="270px"
        >
          <template v-slot:navigation-icon="{ active, btnProps, onClick }">
            <q-btn
              v-if="active"
              size="sm"
              :icon="'eva-radio-button-on-outline'"
              color="red-8"
              flat
              round
              dense
              @click="onClick"
            />
            <q-btn
              v-else
              size="sm"
              :icon="'eva-radio-button-off'"
              color="red-8"
              flat
              round
              dense
              @click="onClick"
            />
          </template>
          <q-carousel-slide
            v-for="(g, i) in getGroupedBrands"
            :key="i"
            :name="i+1"
            class="column no-wrap"
          >
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <div class="col-md-2 col-sm-6 col-xs-6 q-pa-sm" v-for="(e, j) in g" :key="j">
                <BrandItem :data="e"></BrandItem>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
  </q-page>
</template>

<script>
import ProductItem from 'components/ProductItem'
import CategoryItem from 'components/CategoryItem'
import BrandItem from 'components/BrandItem'
import IndexCarousel from 'components/IndexCarousel'
// import ProductCategoriesList from 'components/ProductCategoriesList'
export default {
  name: 'PageIndex',
  data () {
    return {
      slide: 1,
      products: [],
      categories: [],
      brands: [],
      pubs: []
    }
  },
  computed: {
    getCarouselItems () {
      return this.pubs.filter(el => el.position === 'CAROUSEL')
    },
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
    getProductCategoriesBySelectedLang () {
      const lang = this.$store.getters['config/getSelectedLang']
      if (lang) {
        return this.categories.filter(
          el => parseInt(el.lang_id) === parseInt(lang.id)
        )
      }
      return []
    },
    getGroupedCategories () {
      const groups = []
      this.getProductCategoriesBySelectedLang
        .filter(e => e.product_category_id === null)
        .forEach((el, i) => {
          if (i % 6 === 0) {
            groups.push([el])
          } else {
            groups[groups.length - 1].push(el)
          }
        })
      return groups
    },
    getGroupedBrands () {
      const groups = []
      this.getBrandsBySelectedLang.forEach((el, i) => {
        if (i % 6 === 0) {
          groups.push([el])
        } else {
          groups[groups.length - 1].push(el)
        }
      })
      return groups
    },
    getBrandsBySelectedLang () {
      const lang = this.$store.getters['config/getSelectedLang']
      if (lang) {
        return this.brands.filter(
          el => parseInt(el.lang_id) === parseInt(lang.id)
        )
      }
      return []
    }
  },
  components: {
    ProductItem,
    CategoryItem,
    BrandItem,
    IndexCarousel
    // ProductCategoriesList
  },
  mounted () {
    this.getProducts()
    this.getProductCategories()
    this.getBrands()
    this.getPubs()
  },
  methods: {
    getProducts () {
      this.$axios
        .get('/products' + (this.getAuth === null ? 'ForVisitor' : ''))
        .then(res => {
          this.products = res.data
        })
    },
    getPubs () {
      this.$axios.get('/pubs').then(res => {
        this.pubs = res.data
      })
    },
    getProductCategories () {
      this.$axios.get('/product_categories').then(res => {
        this.categories = res.data
      })
    },
    getBrands () {
      this.$axios.get('/brands').then(res => {
        this.brands = res.data
      })
    }
  }
}
</script>
