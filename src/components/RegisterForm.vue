<template>
  <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
    <div class="row">
      <div class="col-md-6 q-pa-md col-sm-12 col-xs-12 offset-md-3">
        <div class="row">
          <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
            <q-input
              color="red-8"
              bg-color="white"
              outlined
              v-model="lastName"
              type="text"
              :label="$t('inputs.labels.lastName')"
              :rules="[val => !!val || $t('inputs.validationRules.required')]"
            >
              <template v-slot:prepend>
                <q-icon name="eva-person-outline"/>
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
            <q-input
              color="red-8"
              bg-color="white"
              outlined
              v-model="firstName"
              type="text"
              :label="$t('inputs.labels.firstName')"
              :rules="[val => !!val || $t('inputs.validationRules.required')]"
            >
              <template v-slot:prepend>
                <q-icon name="eva-person-outline"/>
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
            <q-select
              color="red-8"
              bg-color="white"
              v-model="category"
              :options="getCategories"
              :label="$t('inputs.labels.category')"
              outlined
            />
          </div>
                    <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
            <q-select
              color="red-8"
              bg-color="white"
              v-model="activity"
              :options="getActivities"
              :label="$t('inputs.labels.activity')"
              outlined
            />
          </div>
          <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
            <q-input
              color="red-8"
              bg-color="white"
              outlined
              v-model="email"
              type="email"
              :label="$t('inputs.labels.email')"
              :rules="[val => !!val || $t('inputs.validationRules.required')]"
            >
              <template v-slot:prepend>
                <q-icon name="eva-email-outline"/>
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
            <q-input
              color="red-8"
              bg-color="white"
              outlined
              v-model="phone"
              type="text"
              :label="$t('inputs.labels.phone')"
              mask="#### ## ## ##"
              :rules="[val => !!val || $t('inputs.validationRules.required')]"
            >
              <template v-slot:prepend>
                <q-icon name="eva-phone-outline"/>
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
            <q-input
              color="red-8"
              bg-color="white"
              outlined
              v-model="password"
              type="password"
              :label="$t('inputs.labels.password')"
              ref="pwd"
            >
              <template v-slot:prepend>
                <q-icon name="eva-lock-outline"/>
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
            <q-input
              color="red-8"
              bg-color="white"
              outlined
              v-model="confirmPassword"
              type="password"
              :label="$t('inputs.labels.confirmPassword')"
              v-bind:rules="ConfirmPWD"
            >
              <template v-slot:prepend>
                <q-icon name="eva-lock-outline"/>
              </template>
            </q-input>
          </div>
          <div class="col-12 q-mb-md q-pa-sm">
            <q-btn
              unelevated
              type="submit"
              class="text-capitalize full-width q-pa-sm"
              size="md"
              :label="$t('inputs.labels.createAccountBtn')"
              color="red-8"
            />
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script>
export default {
  name: 'RegisterForm',
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      customerCategory: '',
      password: '',
      confirmPassword: '',
      category: null,
      activity: null,
      categories: [],
      activities: []
    }
  },
  computed: {
    ConfirmPWD () {
      return [
        v =>
          v === this.$refs.pwd.value ||
          this.$t('inputs.validationRules.confirmPassword')
      ]
    },

    getCategories () {
      const lang = this.$store.getters['config/getSelectedLang']
      if (lang) { return this.categories.filter(el => parseInt(el.lang_id) === parseInt(lang.id)) }
      return []
    },
    getActivities () {
      const lang = this.$store.getters['config/getSelectedLang']
      if (lang) { return this.activities.filter(el => parseInt(el.lang_id) === parseInt(lang.id)) }
      return []
    }
  },
  mounted () {
    this.getCustomerCategories()
    this.getCustomerActivities()
  },
  methods: {
    getCustomerCategories () {
      this.$axios
        .get(
          '/customer_categories'
        )
        .then(res => {
          this.categories = res.data
        })
    },
    getCustomerActivities () {
      this.$axios
        .get(
          '/customer_activities'
        )
        .then(res => {
          this.activities = res.data
        })
    },
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (success) {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }

          const data = new FormData()
          data.append('first_name', this.firstName)
          data.append('last_name', this.lastName)
          data.append('email', this.email)
          data.append('password', this.password)
          data.append('phone', this.phone)
          data.append('category_id', this.category.id)
          data.append('activity_id', this.activity.id)

          this.$axios
            .post('register', data, config)
            .then(res => {
              localStorage.setItem('T', res.data.token)
              this.$axios.defaults.headers.common.Authorization = 'Bearer ' + res.data.token
              this.$store.dispatch('config/setAuth', res.data)
              this.$router.push('/registerSucceeded')
            })
            .catch(() => {
              this.loading = false
              this.$q.notify({
                type: 'negative',
                message: 'une erreur est survenue au niveau du serveur, veuillez reéssayer ultérierement'
              })
            })
        }
      })
    }
  }
}
</script>
