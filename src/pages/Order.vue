<template>
  <q-page class="bg-grey-1" padding>
    <div v-if="order !== null" class="q-pa-md">
      <q-card class="no-shadow q-mb-md" bordered>
        <q-card-section>
          <div class="text-subtitle1">
            Commande N°
            <span class="text-red-8 text-weight-bold">{{ order.code }}</span>
          </div>
          <div class="q-mt-md row">
            <div class="col-6">
                          <q-badge
              :color="getState(order.state_id).color"
              text-color="white"
              :label="getState(order.state_id).name"
            />
            </div>
              <div v-if="order.state_id === 3" class="col-6 text-right">
                  <q-btn flat color="red-8" size="sm"
                  class="bg-red-1 text-weight-bold" label="Annuler la commande"
                  @click="cancelOrderDialog = true"/>
              </div>
          </div>
          <div class="text-subtitle-2 q-mt-md">
            Adresse de livraison:
            <span class="text-weight-bold">{{ order.shipping_adress }}</span>
          </div>
        </q-card-section>
      </q-card>
      <q-table
        title="détail de la commande"
        :data="getProductsByLang"
        :columns="columns"
        row-key="name"
        class="no-shadow"
        bordered
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="avatar" :props="props">
              <q-img
                :src="props.row.default_image !== null && props.row.default_image !== ''
      ? $axios.defaults.baseURL.replace('api', 'images') + props.row.default_image : 'no_photo.png'"
                style="width: 70px"
                :ratio="1"
                basic
                spinner-color="white"
                class="rounded-borders"
              />
            </q-td>
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="qty" :props="props">{{ props.row.qty }}</q-td>
            <q-td key="amount" :props="props">{{ props.row.amount.toFixed(2) }}</q-td>
            <q-td key="total" :props="props">{{ (props.row.amount * props.row.qty).toFixed(2) }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="row">
        <div class="col-md-4 col-sm-12 col-xs-12 offset-md-8 q-mt-md">
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
                >{{ ( order.shipping_fees !== null ? order.shipping_fees : '0.00' ) + ' ' + $t('currency')}}</div>
                <div class="col-6 text-h6 text-weight-bold q-pt-md">Total</div>
                <div
                  class="col-6 text-right text-h6 text-red-8 text-weight-bold q-pt-md"
                >{{ getTotal + ' ' + $t('currency') }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-dialog v-model="cancelOrderDialog" persistent>
      <q-card class="q-pa-sm">
        <q-card-section class="row text-center">
          <div
            class="q-ml-sm full-width text-subtitle1 text-weight-bold q-pa-lg"
          >{{ $t('cancelOrderDialog') }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            size="sm"
            class="text-weight-bold"
            :label="$t('cancelBtn')"
            color="grey-10"
            @click="cancelOrderDialog = false"
          />
          <q-btn
            flat
            size="sm"
            :label="$t('yesBtn')"
            class="bg-red-2 text-weight-bold"
            color="red-8"
            @click="cancelOrder"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'OrderPage',
  data () {
    return {
      order: null,
      cancelOrderDialog: false,
      states: [],
      columns: [
        {
          name: 'avatar',
          required: true,
          label: '',
          align: 'left'
        },
        {
          name: 'name',
          align: 'center',
          label: 'Produit',
          field: 'name'
        },
        {
          name: 'qty',
          label: 'Quantité',
          field: 'qty'
        },
        {
          name: 'amount',
          label: 'Montant',
          field: 'amount'
        },
        {
          name: 'total',
          label: 'Montant total'
        }
      ]
    }
  },
  computed: {
    getLang () {
      return this.$store.getters['config/getSelectedLang']
    },
    getProductsByLang () {
      return this.order !== null && this.order.detail
        ? this.order.detail.filter(el => el.lang_id === this.getLang.id)
        : []
    },
    getSubTotal () {
      let subTotal = 0
      if (this.order !== null && this.order.detail) {
        this.order.detail.forEach(el => {
          subTotal += parseFloat(el.qty) * parseFloat(el.amount)
        })
      }
      return subTotal.toFixed(2)
    },
    getTotal () {
      let total = 0
      if (this.order !== null) {
        total = (this.order.shipping_fees !== null ? this.order.shipping_fees : 0) + this.getSubTotal
      }
      return parseFloat(total).toFixed(2)
    }
  },
  mounted () {
    this.getStates()
    this.getOrder(this.$route.params.id)
  },
  methods: {
    getState (id) {
      return this.states.find(
        el => el.lang_id === this.getLang.id && el.id === id
      )
    },
    getStates () {
      this.$axios.get('states').then(res => {
        this.states = res.data
      })
    },
    getOrder (id) {
      this.$axios.get('orders/' + id).then(res => {
        this.order = res.data
      })
    },
    cancelOrder () {
      this.$axios.post('cancelOrder/' + this.$route.params.id)
        .then(res => {
          this.order.state_id = 9
        })
    }
  }
}
</script>
