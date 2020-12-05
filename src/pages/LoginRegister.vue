<template>
  <q-page class="bg-grey-1 " padding >
    <div class=" text-center">
      <div class="row">
        <div class="col-md-4 col-xs-12 col-sm-12 offset-md-4">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey-9"
            active-color="red-8 "
            indicator-color="red-8"
            align="justify"
            narrow-indicator
          >
            <q-tab name="login" :label="$t('login')"/>
            <q-tab name="register" :label="$t('register')"/>
          </q-tabs>
        </div>
      </div>
      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <q-tab-panel name="login">
          <LoginForm :isDialog="false"></LoginForm>
        </q-tab-panel>
        <q-tab-panel name="register">
          <RegisterForm ></RegisterForm>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import LoginForm from 'components/LoginForm'
import RegisterForm from 'components/RegisterForm'
export default {
  name: 'LoginRegisterPage',
  data () {
    return {
      tab: 'login',
      lang: null
    }
  },
  components: {
    LoginForm,
    RegisterForm
  },
  mounted () {
    this.lang = this.$store.getters['config/getSelectedLang']
  }
}
</script>
