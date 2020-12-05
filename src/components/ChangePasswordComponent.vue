<template>
  <q-dialog v-model="dialog" persistent>
    <q-card>
      <q-card-section>
        <q-form @submit="onSubmit" ref="form">
          <div class="row">
            <div class="col-12 text-h6 text-weight-bold q-pa-md">{{ $t('inputs.labels.password') }}</div>
            <div v-if="pwdError" class="col-12 q-pa-sm">
              <div class="text-subtitle2 q-pa-md rounded-borders bg-red-1 text-red-8">
                  Les informations fournis sont incorrectes
              </div>
            </div>
            <div class="col-md-12 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
              <q-input
                color="red-8"
                bg-color="white"
                outlined
                v-model="oldPassword"
                type="password"
                :label="$t('inputs.labels.oldPassword')"
                :rules="[val => !!val || $t('inputs.validationRules.required')]"
              ></q-input>
            </div>
            <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
              <q-input
                color="red-8"
                bg-color="white"
                outlined
                v-model="password"
                type="password"
                :label="$t('inputs.labels.newPassword')"
                :rules="[val => !!val || $t('inputs.validationRules.required')]"
                ref="pwd"
              ></q-input>
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
              ></q-input>
            </div>
            <div class="col-6 q-mb-md q-pa-sm">
              <q-btn
                flat

                type="button"
                @click="$emit('closeDialog')"
                class="text-weight-bold full-width q-pa-sm bg-grey-1"
                size="md"
                :label="$t('inputs.labels.cancelBtn')"
                color="grey-10"
              />
            </div>
            <div class="col-6 q-mb-md q-pa-sm">
              <q-btn
                flat
                type="submit"
                class="full-width q-pa-sm text-weight-bold bg-red-2"
                size="md"
                :label="$t('inputs.labels.updateProfile')"
                color="red-8"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ChangePasswordComponent',
  props: ['dialog'],
  data () {
    return {
      oldPassword: '',
      password: '',
      confirmPassword: '',
      pwdError: false
    }
  },
  computed: {
    ConfirmPWD () {
      return [
        v =>
          v === this.$refs.pwd.value ||
          this.$t('inputs.validationRules.confirmPassword')
      ]
    }
  },
  watch: {
    dialog: function () {
      this.oldPassword = ''
      this.password = ''
      this.confirmPassword = ''
      this.pwdError = false
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (success) {
          this.$axios
            .post('changePassword', {
              password: this.password,
              old_password: this.oldPassword
            })
            .then(res => {
              this.$emit('closeDialog')
            })
            .catch(() => {
              this.pwdError = true
            })
        }
      })
    }
  }
}
</script>
