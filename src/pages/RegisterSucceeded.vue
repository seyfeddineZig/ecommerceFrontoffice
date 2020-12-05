<template>
  <div>
    <div v-if="auth" class="window-height q-pa-lg">
      <div v-if="step === 1 && auth.state_id === 3 && auth.contract === null" class="q-mb-lg q-pa-lg">
        <div class="text-h6 text-grey-10 q-pa-sm text-weight-bold">{{ $t('registerSucceeded') }}</div>
        <div class="text-subtitle1 text-grey-10 q-pa-sm text-weight-bold">{{ $t('fillContract') }}</div>
        <q-form @submit="saveContract" ref="form">
          <q-card class="no-shadow">
            <q-card-section>
              <div class="row">
                <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
                  <q-select
                    v-model="paymentMode"
                    :options="paymentModes"
                    :label="$t('paymentModeSelect')"
                    outlined
                    color="red-8"
                    :rules="[val => !!val || $t('inputs.validationRules.required')]"
                  />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
                  <q-select
                    v-model="paymentDeadline"
                    :options="paymentDeadlines"
                    :label="$t('paymentDeadlineSelect')"
                    outlined
                    color="red-8"
                    :rules="[val => !!val || $t('inputs.validationRules.required')]"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
                  <q-select
                    v-model="maxDebt"
                    :options="maxDebts"
                    :label="$t('maxDebtSelect')"
                    outlined
                    color="red-8"
                    :rules="[val => !!val || $t('inputs.validationRules.required')]"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-12 text-h6 text-weight-bold text-left q-pa-sm">{{ $t('shipping') }}</div>
                <div class="col-12 text-left">
                  <q-radio
                    v-model="shipping"
                    color="red-8"
                    :val="true"
                    :label="$t('shippingTrue')"
                  />
                </div>
                <div class="col-12 text-left">
                  <q-radio
                    v-model="shipping"
                    color="red-8"
                    :val="false"
                    :label="$t('shippingFalse')"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-12 q-pa-sm text-right">
                  <q-btn
                    type="submit"
                    flat
                    class="text-weight-bold bg-red-2 q-pa-xs"
                    color="red-8"
                    label="Finir l'inscription"
                  />
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-12 text-left q-pa-sm" v-for="(p,i) in getPagesByLang" :key="i">
                  <div class="text-weight-bold text-h6">{{ p.name }}</div>
                  <div v-html="p.description"></div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <div v-else class="window-height text-center q-pt-lg">
        <div class="text-h4 text-teal q-mt-lg q-mb-lg q-pt-lg">{{ $t('registerWaiting') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterSucceeded',
  data () {
    return {
      step: 1,
      shipping: true,
      paymentMode: null,
      paymentDeadline: null,
      maxDebt: null,
      paymentModes: [],
      paymentDeadlines: [],
      maxDebts: [],
      error: '',
      pages: []
    }
  },
  mounted () {
    this.getPaymentModes()
    this.getPaymentDeadlines()
    this.getMaxDebts()
    this.getContractItems()
  },
  computed: {
    auth () {
      return this.$store.getters['config/getAuth']
    },
    getPagesByLang () {
      const lang = this.$store.getters['config/getSelectedLang']
      return this.pages.filter(el => el.lang_id === lang.id)
    }
  },
  methods: {
    saveContract () {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.$axios
            .post('/saveContract', {
              shipping: this.shipping,
              payment_mode_id: this.paymentMode.id,
              payment_deadline_id: this.paymentDeadline.id,
              max_debt_id: this.maxDebt.id
            })
            .then(res => {
              this.step = 2
            })
        }
      })
    },
    getContractItems () {
      this.$axios.get('/getContractItems').then(res => {
        this.pages = res.data
      })
    },
    getPaymentModes () {
      this.$axios.get('/getPaymentMode').then(res => {
        this.paymentModes = res.data
      })
    },
    getPaymentDeadlines () {
      this.$axios.get('/getPaymentDeadline').then(res => {
        this.paymentDeadlines = res.data
      })
    },
    getMaxDebts () {
      this.$axios.get('/getMaxDebt').then(res => {
        this.maxDebts = res.data
      })
    }
  }
}
</script>
