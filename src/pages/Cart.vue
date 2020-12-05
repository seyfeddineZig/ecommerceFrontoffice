<template>
  <q-page padding class="bg-grey-1">
    <div v-if="(cart !== null && cart.detail !== undefined && cart.detail.length > 0) && fetched" class="row">
      <div class="col-12 text-h6 text-weight-bold q-pa-md">Panier</div>
      <div class="col-md-8 col-sm-12 col-xs-12 q-pa-md">
        <q-card class="no-shadow" bordered>
          <q-card-section v-for="(product, i) in getProductsByLang" :key="i">
            <div class="row">
              <div class="col-2">
                <q-img
                  :src="product.default_image !== null && product.default_image !== ''
      ? $axios.defaults.baseURL.replace('api', 'images') + product.default_image : 'no_photo.png'"
                  style="width: 100px"
                  :ratio="1"
                  basic
                  spinner-color="white"
                  class="rounded-borders"
                />
              </div>
              <div class="col-9 q-pa-sm">
                <div class="text-subtitle2 text-weight-bold">
                  {{ product.product_name }}
                  {{ product.module === 'PRODUCT_PACKAGE' ? ( '( ' + product.name + ' x' + product.package_qty) + ' )' : '' }}
                </div>
                <div class="q-mt-sm q-mb-sm" v-if="product.type === 'KIT'">
                  <q-chip
                  v-for="(d,k) in product.kitProducts"
                  :key="k" color="grey-2">
                  <div class="text-caption text-grey-9">
                    {{ d.name }}
                    <span class="text-subtitle2 text-weight-bold text-red-8"> x{{ d.qty }}</span>
                  </div>
                  </q-chip>
                </div>
                <div class="text-subtitle2">
                  Quantité :
                  <span class="text-red-8 text-weight-bold">{{ product.qty }}</span>
                </div>
                <div
                  class="text-subtitle1 text-weight-bold text-red-8"
                >{{ ((product.module === 'PRODUCT_PACKAGE' ? parseInt(product.package_qty) : 1) * parseInt(product.qty)*parseFloat(product.amount)).toFixed(2) + ' ' + $t('currency') }}</div>

              </div>
              <div class="col-1">
                <q-btn
                  round
                  flat
                  class="text-red-8"
                  size="md"
                  icon="eva-trash-2-outline"
                  @click="itemToDelete = product.id, dialog = true"
                />
              </div>
            </div>
            <q-separator horizontal class="q-mt-md"/>
          </q-card-section>
        </q-card>
        <q-card v-if="getShippingFeesByLang.length > 0" class="no-shadow q-mt-md" bordered>
          <q-card-section>
            <div class="text-subtitle2 text-weight-bold">Livraison</div>
            <div class="row q-mt-md">
              <div class="col-md-8 col-sm-12 col-xs-12 q-pa-sm">
                <q-input
                  outlined
                  color="red-8"
                  v-model="shippingAdress"
                  type="text"
                  label="Adresse de livraison"
                />
              </div>
              <div class="col-md-4 col-sm-12 col-xs-12 q-pa-sm">
                <q-select
                  v-model="shippingFee"
                  :options="getShippingFeesByLang"
                  label="Région"
                  outlined
                  color="red-8"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.label"/>
                        <q-item-label
                          class="text-red-8 text-weight-bold"
                          caption
                        >{{ scope.opt.amount + ' ' + $t('currency') }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-4 col-sm-12 col-xs-12 q-pa-md">
        <q-card class="no-shadow" bordered>
          <q-card-section>
            <div class="row">
              <div class="col-6 text-subtitle1 text-weight-bold">Sous total</div>
              <div
                class="col-6 text-right text-subtitle1 text-red-8 text-weight-bold"
              >{{ getSubTotal + ' ' + $t('currency') }}</div>

              <div class="col-6 text-subtitle1 text-weight-bold">Livraison</div>
              <div
                class="col-6 text-right text-subtitle1 text-red-8 text-weight-bold"
              >{{ ( shippingFee !== null ? shippingFee.amount : '0.00' ) + ' ' + $t('currency')}}</div>
              <div class="col-6 text-h6 text-weight-bold q-pt-md">Total</div>
              <div
                class="col-6 text-right text-h6 text-red-8 text-weight-bold q-pt-md"
              >{{ getTotal + ' ' + $t('currency') }}</div>
              <div class="col-12 q-mt-md">
                <q-btn
                  flat
                  color="red-8"
                  class="q-pa-sm bg-red-2 text-weight-bold full-width"
                  label="Acheter"
                  @click="buy"
                />
                <div v-if="error !== ''" class="q-mt-md text-caption text-red">{{ error }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div
      v-if="fetched && ( cart === null || !cart.detail || cart.detail.length === 0)"
      class="text-center q-mt-lg q-pt-lg"
    >
      <q-icon name="eva-shopping-cart-outline" size="200px" color="grey-3"/>
      <div class="text-h5 text-grey-4">Le panier est vide</div>
    </div>
    <q-dialog v-model="dialog" persistent>
      <q-card class="q-pa-sm">
        <q-card-section class="row text-center">
          <div
            class="q-ml-sm full-width text-subtitle1 text-weight-bold q-pa-lg"
          >{{ $t('deleteFromCartDialog') }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            size="sm"
            class="text-weight-bold"
            :label="$t('cancelBtn')"
            color="grey-10"
            @click="dialog = false"
          />
          <q-btn
            flat
            size="sm"
            :label="$t('yesBtn')"
            class="bg-red-2 text-weight-bold"
            color="red-8"
            @click="deleteFromCart"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogBuyCart" persistent>
      <q-card class="q-pa-sm">
        <q-card-section class="row text-center">
          <div
            class="q-ml-sm full-width text-subtitle1 text-weight-bold q-pa-lg"
          >{{ $t('successBuyCart') }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            size="sm"
            class="text-weight-bold"
            :label="$t('cancelBtn')"
            color="grey-10"
            @click="dialogBuyCart = false"
          />
          <q-btn
            flat
            size="sm"
            :label="$t('goToOrders')"
            class="bg-red-2 text-weight-bold"
            color="red-8"
            @click="$router.push('/Orders')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'CartPage',
  data () {
    return {
      cart: null,
      shippingFees: [],
      fetched: false,
      dialog: false,
      dialogBuyCart: false,
      error: '',
      itemToDelete: null,
      shippingFee: null,
      shippingAdress: null
    }
  },
  computed: {
    getTotal () {
      return (
        parseFloat(this.getSubTotal) +
        parseFloat(this.shippingFee !== null ? this.shippingFee.amount : 0)
      ).toFixed(2)
    },
    getSubTotal () {
      let subTotal = 0
      if (this.cart !== null) {
        this.getProductsByLang.forEach(el => {
          subTotal += el.amount * (el.module === 'PRODUCT_PACKAGE' ? el.package_qty : 1) * el.qty
        })
      }
      return subTotal.toFixed(2)
    },
    getLang () {
      return this.$store.getters['config/getSelectedLang']
    },
    getProductsByLang () {
      return this.cart !== null && this.cart.detail
        ? this.cart.detail.filter(el => el.lang_id === this.getLang.id)
        : []
    },
    getShippingFeesByLang () {
      return this.shippingFees.filter(el => el.lang_id === this.getLang.id)
    }
  },
  mounted () {
    this.getCart()
    this.getShippingFees()
    this.fetched = true
  },
  methods: {
    addQty (packageId = null) {
      if (packageId !== null) {
        const i = this.productPackages.findIndex(el => el.id === packageId)
        if (i !== -1) {
          this.productPackages[i].qty += 1
        }
      } else {
        this.qty += 1
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
    getCart () {
      this.$axios.get('getCart').then(res => {
        this.cart = res.data
      })
    },
    getShippingFees () {
      this.$axios.get('shippingFees').then(res => {
        this.shippingFees = res.data
      })
    },
    deleteFromCart () {
      if (this.itemToDelete !== null) {
        this.$axios.post('deleteFromCart/' + this.itemToDelete).then(res => {
          this.cart.detail = this.cart.detail.filter(
            el => el.id !== this.itemToDelete
          )
          this.dialog = false
          this.itemToDelete = null
        })
      }
    },
    buy () {
      this.error = ''
      const auth = this.$store.getters['config/getAuth']
      if (auth.state_id === 3) {
        this.error =
          "Vous ne pouvez pas acheter le panier car votre compte n'est pas encore confirmé"
      }
      if (this.error === '') {
        this.$axios
          .post('buyCart', {
            shipping_fee:
              this.shippingFee !== null ? this.shippingFee.amount : null,
            shipping_adress:
              this.shippingFee !== null
                ? (this.shippingAdress + ', ' || '') + this.shippingFee.label
                : null
          })
          .then(res => {
            this.cart = null
            this.dialogBuyCart = true
          })
      }
    }
  }
}
</script>
