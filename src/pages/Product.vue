<template>
  <q-page padding class="bg-grey-1">
    <div v-if="product !== null && fetched" class="row q-pa-md bg-white rounded-borders">
      <div class="col-md-6 col-sm-12 col-xs-12 q-pa-md">
        <div class="q-pa-md">
          <q-carousel swipeable animated v-model="slide" infinite :fullscreen.sync="fullscreen">
            <q-carousel-slide v-for="(c, i) in getCarouselItems" :key="i" :name="i+1" :img-src="c"/>
            <template v-slot:control>
              <q-carousel-control position="bottom-right" :offset="[18, 18]">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  class="bg-grey-1"
                  text-color="red-8"
                  :icon="fullscreen ? 'eva-close-outline' : 'eva-monitor-outline'"
                  @click="fullscreen = !fullscreen"
                />
              </q-carousel-control>
            </template>
          </q-carousel>
          <div class="row justify-center q-mt-sm">
            <q-img
              v-for="(c, i) in getCarouselItems"
              :key="i"
              :src="c"
              style="width: 60px"
              :ratio="1"
              basic
              spinner-color="red-8"
              class="rounded-borders q-ma-xs cursor-pointer"
              @click="slide = i+1"
            ></q-img>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12 q-pa-md">
        <div class="text-subtitle1 text-weight-bold">{{ getProductByLang.name }}</div>
        <div class="text-subtitle2 q-mt-md q-mb-md">{{ getProductByLang.description }}</div>
        <div class="q-mt-sm q-mb-sm">
          <q-rating v-model="productRating" size="xs" color="red-8" icon="eva-star" readonly/>
          <span>({{ getRatingAvg.count }} avis)</span>
        </div>
        <q-separator horizontal/>
        <div
          v-if="( product.type === 'PRODUCT' && product.sell_by_unit === 1 ) || product.type === 'KIT'"
          class="text-h6 text-weight-bold q-mt-md q-mb-md"
        >{{ product.price.toFixed(2) + ' ' + $t('currency')}}</div>
        <div
          v-if="product.type === 'PRODUCT' && product.productValues.length > 0"
          class="q-mt-sm q-mb-md"
        >
          <div class="text-subtitle1 text-weight-bold">Caracteristiques</div>
          <div v-for="a in productValues" :key="a.id">
            <q-chip
              color="white"
              text-color="grey-10"
              class="text-bold text-caption"
              :label="a.name + ' : '"
            />
            <q-chip
              v-for="v in a.values"
              class="q-mr-xs"
              size="sm"
              :key="a.values.indexOf(v)"
              color="red-1"
              text-color="red-8"
              :label="a.type !== 'COLOR' ? v.name : ''"
            >
              <q-avatar
                v-if="a.type === 'COLOR'"
                size="20px"
                v-bind:style="{'background' : v.name}"
              />
            </q-chip>
          </div>
        </div>
        <div
          v-if="(product.type === 'PRODUCT' && product.real_qty !== null && product.real_qty > 0) || product.type === 'KIT'"
        >
          <div
            v-if="product.type === 'KIT' || ( product.type === 'PRODUCT' && product.sell_by_unit === 1 )"
          >
            <q-input
              borderless
              style="width: 200px"
              dense
              color="red-8"
              v-model="qty"
              type="number"
              label="Quantité"
            >
              <template v-slot:before>
                <q-btn
                  round
                  class="bg-grey-3"
                  dense
                  flat
                  icon="eva-minus-outline"
                  @click="reduceQty()"
                />
              </template>

              <template v-slot:after>
                <q-btn
                  round
                  class="bg-grey-3"
                  dense
                  flat
                  icon="eva-plus-outline"
                  @click="addQty()"
                />
              </template>
            </q-input>
          </div>
          <div
            class="q-mt-md"
            v-if="product.type === 'PRODUCT' && product.productPackages.length > 0"
          >
            <div v-for="(p, i) in getProductPackages" :key="i">
              <div class="row q-pa-md bg-grey-2 rounded-borders q-mb-sm">
                <div class="col-6">
                  <div class="text-caption">{{ p.name + ' ( x' + p.packageQty + ')' }}</div>
                  <div class="text-weight-bold">{{ p.price.toFixed(2) + ' ' + $t('currency') }}</div>
                </div>
                <div class="col-6">
                  <q-input
                    borderless
                    dense
                    style="width: 200px"
                    color="red-8"
                    v-model="p.qty"
                    type="number"
                    label="Quantité : "
                  >
                    <template v-slot:before>
                      <q-btn
                        round
                        class="bg-grey-4"
                        dense
                        flat
                        icon="eva-minus-outline"
                        @click="reduceQty(p.id)"
                      />
                    </template>

                    <template v-slot:after>
                      <q-btn
                        round
                        class="bg-grey-4"
                        dense
                        flat
                        icon="eva-plus-outline"
                        @click="addQty(p.id)"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="product.type === 'KIT' && product.kitContent.length > 0">
          <div class="text-subtitle2 text-weight-bold q-mt-lg q-mb-md">Contenu du kit</div>
          <div v-for="(p, i) in getKitContent" :key="i">
            <div class="row q-pa-md bg-grey-2 rounded-borders q-mb-sm">
              <div class="col-12">
                <div class="text-caption text-weight-bold">{{ p.name }}</div>
                <div class="text-caption">
                  Quantité:
                  <span class="text-red-8 text-weight-bold">{{ p.qty }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="(product.type === 'PRODUCT' && product.real_qty !== null && product.real_qty > 0) || product.type === 'KIT'"
        >
          <q-card class="no-shadow q-mt-md" bordered>
            <q-card-section>
              <div class="row">
                <div class="col-6 text-subtitle1 text-weight-bold">Quantité</div>
                <div
                  class="col-6 text-subtitle1 text-right text-weight-bold text-red-8"
                >{{ getTotal.qty }}</div>
                <div class="col-6 text-subtitle1 text-weight-bold">Total</div>
                <div
                  class="col-6 text-subtitle1 text-right text-weight-bold text-red-8"
                >{{ getTotal.price.toFixed(2) + ' ' + $t('currency') }}</div>
              </div>
            </q-card-section>
          </q-card>
          <div class="text-right q-pt-md">
            <q-btn
              flat
              class="text-red-8 text-weight-bold bg-red-2 full-width q-pa-sm"
              color="primary"
              :label="$t('addToCart')"
              @click="addToCart"
            />
            <q-btn icon="fab fa-facebook" label="Facebook" color="red-10" push @click="facebook"/>

            <iframe
              :src="'https://www.facebook.com/plugins/share_button.php?href=' + encodeURIComponent(url) + '&layout=button_count&size=small&appId=2875888812648196&width=113&height=20'"
              width="113"
              height="20"
              style="border:none;overflow:hidden"
              scrolling="no"
              frameborder="0"
              allowfullscreen="true"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
            <ShareNetwork
              network="facebook"
              url="http://thebestdeal-dz.tk/product/182"
              title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
              description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
              quote="The hot reload is so fast it\'s near instant. - Evan You"
              hashtags="ezrmlk, klmkqmsldk, qsdqsd"
            >Share on Facebook</ShareNetwork>
          </div>
          <div v-if="error !== ''" class="text-red-8 text-caption">{{ error }}</div>
        </div>
        <div v-else class="q-mt-md">
          <div class="text-subtitle2 text-grey-8">
            <q-icon name="eva-alert-circle-outline" size="sm"/>
            {{ $t('productDoesntExist') }}
          </div>
          <q-btn
            v-if="!notificationCreated"
            flat
            class="q-mt-md text-red-8 text-weight-bold full-width bg-red-2 q-pa-sm"
            color="primary"
            icon="eva-bell-outline"
            :label="$t('alertMeWhenProductArrives')"
            @click="alertWhenProductArrives"
          />
          <div
            v-else
            class="q-pa-md q-mt-md text-subtitle2 text-weight-bold bg-teal-1 rounded-borders text-teal-8"
          >{{ $t('stockNotificationCreated') }}</div>
        </div>
      </div>
      <div
        v-if="getProductByLang.detailed_description !== '' && getProductByLang.detailed_description !== null"
        class="col-12"
      >
        <div class="text-subtitle1 text-weight-bold">Détail</div>
        <div v-html="getProductByLang.detailed_description"></div>
      </div>

      <div class="col-md-12 col-xs-12 col-sm-12 q-pa-lg">
        <div class="text-subtitle1 text-weight-bold q-pa-md">Avis et notes</div>
        <div class="row">
          <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
            <q-card class="my-card no-shadow" bordered>
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Noter le produit</div>
                <div class="q-mt-sm q-mb-sm">
                  <q-rating
                    v-if="!ratingSent"
                    v-model="rating"
                    size="lg"
                    color="red-8"
                    icon="eva-star"
                  />
                  <div
                    v-else
                    class="text-grey-6 text-subtitle2"
                  >Votre note a été enregistré avec succés</div>
                </div>
                <q-separator horizontal class="q-mt-md q-mb-md"/>
                <div class="row">
                  <div class="col-4 text-center">
                    <div
                      class="text-h1 text-weight-bold text-red-8"
                    >{{ getRatingAvg.count !== 0 ? getRatingAvg.rating / getRatingAvg.count : 0 }}</div>
                    <div
                      class="text-subtitle1 text-weight-bold text-grey-9"
                    >{{ getRatingAvg.count }} avis</div>
                  </div>
                  <div class="col-8">
                    <div class="row q-ma-sm" v-for="(r, i) in [1,2,3,4,5]" :key="i">
                      <div class="col-1 text-red-8 text-weight-bold text-subtitle2">{{ r }}</div>
                      <div class="col-11 q-pt-sm">
                        <q-linear-progress
                          rounded
                          color="red-8"
                          size="8px"
                          :value="getRatingProgress(r)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
            <q-card class="my-card no-shadow" bordered>
              <q-card-section>
                <div class="full-width">
                  <div class="q-pa-md">
                    <q-input
                      v-if="!noticeSent"
                      color="red-8"
                      filled
                      v-model="notice"
                      type="text"
                      label="Votre avis ..."
                    >
                      <template v-slot:after>
                        <q-btn
                          flat
                          :disabled="notice === null || notice === ''"
                          rounded
                          size="lg"
                          class="bg-red-1"
                          color="red-8"
                          icon="eva-arrow-ios-forward-outline"
                          @click="saveNotice"
                        />
                      </template>
                    </q-input>
                    <div
                      v-else
                      class="text-grey-6 text-subtitle2"
                    >Merci, votre avis est en attente d'approuvement</div>
                  </div>
                  <q-separator horizontal/>
                </div>
                <div class="full-width q-mt-lg">
                  <q-chat-message
                    v-for="(n, i) in product.notices"
                    :key="i"
                    :name="getNoticeCustomerName(n.last_name + ' ' + n.first_name)"
                    :avatar="n.image !== null ? image : 'person.png'"
                    :text="[n.notice]"
                    :stamp="getStampSpan(n.created_at)"
                    bg-color="grey-2"
                    size="10"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="dialog" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="row text-center">
          <div class="col-12 text-center">
            <q-icon size="lg" color="red-8" name="eva-shopping-bag-outline"/>
          </div>
          <div
            class="q-ml-sm full-width text-subtitle1 text-weight-bold q-pa-lg"
          >{{ $t('addToCartSuccess') }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            size="sm"
            class="text-weight-bold"
            :label="$t('keepShoppingBtn')"
            color="grey-10"
            @click="$router.go(-1)"
          />
          <q-btn
            flat
            size="sm"
            :label="$t('gotToCartBtn')"
            class="bg-red-2 text-weight-bold"
            color="red-8"
            @click="$router.push('/cart')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'ProductPage',
  data () {
    return {
      productPackages: [],
      product: null,
      qty: 0,
      fetched: false,
      error: '',
      slide: 1,
      fullscreen: false,
      dialog: false,
      notificationCreated: false,
      rating: 0,
      notice: null,
      productRating: 0,
      ratingSent: false,
      noticeSent: false,
      url: '',
      title: 'the best deal',
      meta: {}
    }
  },
  watch: {
    product: function () {
      this.title = this.getProductByLang.name || ''
      this.meta = {
        ogType: {
          property: 'og:type',
          content: 'website'
        },
        ogUrl: {
          property: 'og:url',
          content: this.url
        },
        ogTitle: {
          property: 'og:title',
          content: this.title
        },
        ogDesc: {
          property: 'og:description',
          content: this.title
        },
        ogImage: {
          property: 'og:image',
          content: this.$axios.defaults.baseURL.replace('api', 'images') +
                this.product.default_image
        }
      }
    },
    rating: function (newRating, oldRating) {
      if (this.getAuth !== null) {
        this.$axios
          .post('/rateProduct', {
            product_id: this.product.id,
            rating: this.rating
          })
          .then(res => {
            this.ratingSent = true
          })
      } else {
        this.$root.$emit('openLoginDialog')
      }
    }
  },
  computed: {
    getRatingAvg () {
      let rating = 0
      let count = 0
      if (this.product !== null) {
        this.product.rating.forEach(el => {
          rating += parseInt(el.rating)
          count += parseInt(el.rating_count)
        })
      }
      return {
        rating: rating,
        count: count
      }
    },
    getCarouselItems () {
      const items = []
      if (this.product !== null) {
        items.push(
          this.product.default_image !== null &&
            this.product.default_image !== ''
            ? this.$axios.defaults.baseURL.replace('api', 'images') +
                this.product.default_image
            : 'no_photo.png'
        )

        if (this.product.images !== null) {
          this.product.images.split(',').forEach(el => {
            if (el.split(' ').join('') !== '') {
              items.push(
                this.$axios.defaults.baseURL.replace('api', 'images') + el
              )
            }
          })
        }
      }
      return items
    },
    getAuth () {
      return this.$store.getters['config/getAuth']
    },
    getTotal () {
      let qty = 0
      let price = 0
      if (this.product !== null) {
        qty = this.qty
        price = parseInt(this.qty) * parseFloat(this.product.price)
        if (this.productPackages.length > 0) {
          this.productPackages.forEach(el => {
            const q = parseInt(el.packageQty) * parseInt(el.qty)
            qty += q
            price += q * parseFloat(el.price)
          })
        }
      }
      return {
        qty: qty,
        price: price
      }
    },
    getLang () {
      return this.$store.getters['config/getSelectedLang']
    },
    getProductByLang () {
      return this.product.fields.find(el => el.lang_id === this.getLang.id)
    },
    productValues () {
      const data = []
      if (this.product !== null && this.getLang !== null) {
        this.product.productValues
          .filter(e => e.lang_id === this.getLang.id)
          .forEach(element => {
            const i = data.findIndex(
              el => el.attribute_id === element.attribute_id
            )
            if (i !== -1) {
              data[i].values.push(element)
            } else {
              data.push({
                attribute_id: element.attribute_id,
                name: element.attribute,
                values: [element]
              })
            }
          })
      }
      return data
    },
    getProductPackages () {
      if (this.product !== null && this.getLang !== null) {
        return this.productPackages.filter(
          el => el.lang_id === this.getLang.id
        )
      }
      return []
    },
    getKitContent () {
      if (this.product !== null && this.getLang !== null) {
        return this.product.kitContent.filter(
          el => el.lang_id === this.getLang.id
        )
      }
      return []
    }
  },
  meta () {
    return {
      title: this.title,
      meta: this.meta
    }
  },
  mounted () {
    this.getProduct()
    this.fetched = true
    this.url = this.$axios.defaults.baseURL + this.$route.fullPath.replace('/', '')
  },
  methods: {
    facebook () {
      window.open(
        'https://www.facebook.com/dialog/share?app_id=2875888812648196&display=popup&href=' +
          encodeURIComponent(this.url) +
          '&quote=' +
          encodeURIComponent('looool')
      )
    },
    getStampSpan (n) {
      return '<span class="text-caption">' + n + '</span>'
    },
    getNoticeCustomerName (n) {
      return '<span class="text-weight-bold">' + n + '</span>'
    },
    saveNotice () {
      if (this.notice !== null && this.notice !== '') {
        if (this.getAuth !== null) {
          this.$axios
            .post('/saveNotice', {
              notice: this.notice,
              product_id: this.product.id
            })
            .then(res => {
              this.noticeSent = true
            })
        } else {
          this.$root.$emit('openLoginDialog')
        }
      }
    },
    getRatingProgress (r) {
      const el = this.product.rating.find(e => e.rating === r)
      if (el) {
        return parseFloat(el.rating_count / this.getRatingAvg.count)
      }
      return 0
    },
    addQty (packageId = null) {
      if (packageId !== null) {
        const i = this.productPackages.findIndex(el => el.id === packageId)
        if (i !== -1) {
          this.productPackages[i].qty =
            parseFloat(this.productPackages[i].qty) + 1
        }
      } else {
        this.qty = parseFloat(this.qty) + 1
      }
    },
    reduceQty (packageId = null) {
      if (packageId !== null) {
        const i = this.productPackages.findIndex(el => el.id === packageId)
        if (i !== -1) {
          this.productPackages[i].qty =
            this.productPackages[i].qty - 1 >= 0
              ? this.productPackages[i].qty - 1
              : 0
        }
      } else {
        this.qty = this.qty - 1 >= 0 ? this.qty - 1 : 0
      }
    },
    getProduct () {
      const id = this.$route.params.id || null
      if (id) {
        this.$axios
          .get(
            'products' + (this.getAuth === null ? 'ForVisitor' : '') + '/' + id
          )
          .then(res => {
            this.product = res.data
            if (this.product.productPackages !== undefined) {
              this.product.productPackages.forEach(el => {
                this.productPackages.push({
                  id: el.id,
                  qty: 0,
                  packageQty: el.qty,
                  name: el.name,
                  label: el.name,
                  lang_id: el.lang_id,
                  price: el.price
                })
              })
            }

            let rating = 0
            let count = 0
            if (this.product !== null) {
              this.product.rating.forEach(el => {
                rating += parseInt(el.rating)
                count += parseInt(el.rating_count)
              })
            }
            this.productRating = count !== 0 ? parseInt(rating / count) : 0
          })
      }
    },
    addToCart () {
      this.error = ''
      if (this.getTotal.qty <= 0) {
        this.error = this.$t('errors.qty')
      } else if (this.getAuth === null) {
        this.error = this.$t('errors.auth')
        this.$root.$emit('openLoginDialog')
      } else {
        this.error = ''
      }

      if (this.error === '') {
        let rows = []

        if (this.qty !== null && this.qty > 0) {
          rows.push({
            id: this.product.id,
            module: 'PRODUCT',
            qty: this.qty,
            price: this.product.price,
            product_id: this.product.id
          })
        }

        if (this.productPackages.length > 0) {
          rows = rows.concat(
            this.productPackages
              .filter(el => el.lang_id === this.getLang.id)
              .filter(el => el.qty != null && el.qty > 0)
              .map(el => ({
                id: el.id,
                module: 'PRODUCT_PACKAGE',
                qty: el.qty,
                package_qty: el.packageQty,
                price: el.price,
                product_id: this.product.id
              }))
          )
        }
        const data = {
          type: this.product.type,
          rows: rows
        }
        if (data.type === 'KIT') {
          data.qty = this.qty
          data.kit_id = this.product.id
          data.price = this.product.price
        }
        this.$axios
          .post('addToCart', data)
          .then(res => {
            this.qty = 0
            this.productPackages.forEach(el => {
              el.qty = 0
            })
            this.dialog = true
          })
          .catch(err => {
            if (
              err.response &&
              err.response.status === 500 &&
              err.response.data.error
            ) {
              this.error = err.response.data.error
            }
          })
      }
    },
    alertWhenProductArrives () {
      this.$axios
        .post('alertWhenProductArrives/' + this.product.id)
        .then(res => {
          this.notificationCreated = true
        })
    }
  }
}
</script>
