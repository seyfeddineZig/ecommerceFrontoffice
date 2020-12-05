<template>
  <q-form @submit="onSubmit" ref="form" class="q-gutter-md">
    <div class="row">
      <div v-if="isDialog" class="text-center q-pt-sm col-12 text-h6 text-weight-bold text-grey-10">
        {{ $t('login') }}
      </div>
      <div
        v-bind:class="[isDialog ? 'col-12' : 'col-md-4 offset-md-4', 'q-pa-lg col-sm-12 col-xs-12']">
        <div class="row">
          <div v-if="error !== ''" class="col-12 q-mb-md text-red-8">
            {{ error }}
          </div>
          <div class="col-12 q-mb-md">
            <q-input
              color="red-8"
              bg-color="white"
              outlined
              v-model="email"
              type="text"
              :label="$t('inputs.labels.email')"
              :rules="[val => !!val || $t('inputs.validationRules.required')]"
            >
              <template v-slot:prepend>
                <q-icon name="eva-email-outline"/>
              </template>
            </q-input>
          </div>
          <div class="col-12 q-mb-lg">
            <q-input
              color="red-8"
              bg-color="white"
              outlined
              v-model="password"
              type="password"
              :label="$t('inputs.labels.password')"
              :rules="[val => !!val || $t('inputs.validationRules.required')]"
            >
              <template v-slot:prepend>
                <q-icon name="eva-lock-outline"/>
              </template>
            </q-input>
          </div>
        </div>
        <div class="row">
          <div v-if="isDialog">
            <q-btn
              unelevated
              type="button"
              @click="$emit('closeDialog')"
              class="text-capitalize full-width q-pa-sm"
              size="md"
              :label="$t('inputs.labels.cancelBtn')"
              color="grey-10"
            />
          </div>
          <div v-bind:class="[isDialog ? ' col-6 q-pa-sm ' : ' col-12 ',  ' q-mb-md']">
            <q-btn
              unelevated
              type="submit"
              class="text-capitalize full-width q-pa-sm"
              size="md"
              :label="$t('inputs.labels.connectionBtn')"
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
  name: 'LoginForm',
  props: ['isDialog'],
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      this.error = ''
      this.$refs.form.validate().then(success => {
        if (success) {
          const data = {
            email: this.email,
            password: this.password
          }
          this.$axios
            .post('auth', data)
            .then(res => {
              this.loading = false
              if (res) {
                this.$store.dispatch('config/setAuth', res.data)
                localStorage.setItem('T', res.data.token)
                this.$axios.defaults.headers.common.Authorization =
                  'Bearer ' + res.data.token

                if (this.isDialog) {
                  this.$router.go()
                } else {
                  this.$router.go(-1)
                }
              }
            })
            .catch((err) => {
              this.loading = false
              if (err.response && err.response.data && err.response.data.errors) {
                const errors = err.response.data.errors
                const keys = Object.keys(errors)
                keys.forEach(el => {
                  this.error += ' \n ' + errors[el]
                })
              }
            })
        }
      })
    }
  }
}
</script>
