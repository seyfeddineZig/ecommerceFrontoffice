<template>
  <q-page class="bg-grey-1" padding>
    <div class="q-pa-md">
      <div class="col-12 text-h6 text-weight-bold q-pa-md">Commandes</div>

      <q-table class="no-shadow" bordered :data="orders" :columns="columns" row-key="code">
        <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer"
          @click="$router.push('/Order/' + props.row.id )">
            <q-td key="code" :props="props">{{ props.row.code }}</q-td>
            <q-td key="state" :props="props">
              <q-badge
                :color="getState(props.row.state_id).color"
              >{{ getState(props.row.state_id).name }}</q-badge>
            </q-td>
            <q-td key="sub_total" :props="props">{{ props.row.sub_total.toFixed(2) }}</q-td>
            <q-td
              key="shipping_fees"
              :props="props"
            >{{ props.row.shipping_fees !== null ? props.row.shipping_fees.toFixed(2) : '0.00' }}</q-td>
            <q-td key="shipping_adress" :props="props">{{ props.row.shipping_adress }}</q-td>
            <q-td
              key="total"
              :props="props"
            >{{ ( parseFloat(props.row.sub_total) + parseFloat(props.row.shipping_fees || 0 )).toFixed(2) }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<script>
export default {
  name: 'OrdersPage',
  data () {
    return {
      orders: [],
      states: [],
      columns: [
        {
          name: 'code',
          required: true,
          label: 'Code',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'state',
          align: 'center',
          label: 'Etat',
          field: 'state_id',
          sortable: true
        },
        {
          name: 'sub_total',
          label: 'Sous total',
          field: 'sub_total',
          sortable: true
        },
        {
          name: 'shipping_fees',
          label: 'Frais de livraison',
          field: 'shipping_fees'
        },
        {
          name: 'shipping_adress',
          label: 'Adresse de livraison',
          field: 'shipping_adress'
        },
        { name: 'total', label: 'Total' }
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
    }
  },
  mounted () {
    this.getStates()
    this.getOrders()
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
    getOrders () {
      this.$axios.get('orders').then(res => {
        this.orders = res.data
      })
    }
  }
}
</script>
