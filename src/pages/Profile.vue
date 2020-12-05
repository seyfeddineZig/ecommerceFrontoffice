<template>
  <q-page v-if="profile !== null" padding>
    <div class="row q-pa-lg">
      <div class="col-md-4 offset-md-4 col-sm-12 col-xs-12 bg-grey-1 q-pa-md rounded-borders text-center q-mb-md">
        <div>
          <q-img
            :src="profile.image !== null && profile.image !== ''
      ? $axios.defaults.baseURL.replace('api', 'images') + profile.image : 'no_photo.png'"
            :ratio="1"
            spinner-color="red-8"
            class="rounded-borders"
            style="width: 150px"
          />

          <q-file
            dense
            borderless
            color="red-8"
            v-model="image"
            label="Choisir une nouvelle photo"
            :filter="checkFileType"
            @rejected="onRejected"
            @input="changeProfilePic"
          >
            <template v-slot:prepend>
              <q-icon size="xs" name="eva-edit-outline"/>
            </template>
          </q-file>
          <div
            v-if="imageError"
            class="text-caption text-red"
          >La photo doit être de format jpeg, jpg, png.</div>
        </div>
        <div
          v-if="imageSuccess"
          class="text-caption text-teal text-left bg-teal-1 q-pa-md rounded-borders"
        >La photo de profile a été mis à jour avec succés !</div>
      </div>
      <div class="col-12 q-pl-lg q-pr-lg">
        <q-form @submit="onSubmit" ref="form">
          <div class="q-mb-md text-right">
            <q-btn
              flat
              type="button"
              @click="pwdDialog = true"
              class="q-pa-sm q-pl-lg q-pr-lg"
              size="sm"
              :label="$t('inputs.labels.changePwdBtn')"
              color="grey-10"
            />
            <q-btn
              v-if="!updateSuccess"
              flat
              type="submit"
              class="q-pa-sm text-weight-bold bg-red-2 q-pl-lg q-pr-lg"
              size="sm"
              :label="$t('inputs.labels.updateProfile')"
              color="red-8"
            />
            <div
              v-else
              class="text-subtitle1 text-teal text-left bg-teal-1 q-pa-md rounded-borders"
            >Le profile a été mis à jour avec succés !</div>
          </div>

          <q-expansion-item expand-separator expand-icon-toggle label default-opened>
            <template v-slot:header>
              <q-item-section>
                <div class="text-h6">Profile</div>
              </q-item-section>
            </template>
            <div class="row">
              <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
                <q-input
                  color="red-8"
                  bg-color="white"
                  outlined
                  v-model="profile.last_name"
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
                  v-model="profile.first_name"
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
                  v-model="profile.email"
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
                  v-model="profile.phone"
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
            </div>
          </q-expansion-item>
          <q-expansion-item expand-separator expand-icon-toggle label default-opened>
            <template v-slot:header>
              <q-item-section>
                <div class="text-h6">Position GPS</div>
              </q-item-section>
            </template>
            <div class="row">
              <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
                <q-input
                  color="red-8"
                  bg-color="white"
                  outlined
                  v-model="profile.latitude"
                  type="text"
                  :label="$t('inputs.labels.latitude')"
                  :rules="[val => ( !val || !isNaN(val) )  || $t('inputs.validationRules.gps')]"
                ></q-input>
              </div>
              <div class="col-md-6 q-pa-sm col-sm-12 col-xs-12 q-mb-md">
                <q-input
                  color="red-8"
                  bg-color="white"
                  outlined
                  v-model="profile.logtitude"
                  type="text"
                  :label="$t('inputs.labels.longtitude')"
                  :rules="[val => ( !val || !isNaN(val) ) || $t('inputs.validationRules.isNumber')]"
                ></q-input>
              </div>
            </div>
          </q-expansion-item>
        </q-form>
      </div>
    </div>
    <changePasswordComponent :dialog="pwdDialog" v-on:closeDialog="pwdDialog = false"></changePasswordComponent>
  </q-page>
</template>

<script>
import changePasswordComponent from 'components/ChangePasswordComponent'
export default {
  name: 'RegisterForm',
  data () {
    return {
      profile: null,
      customerCategory: '',
      categories: [],
      activities: [],
      category: null,
      activity: null,
      imageError: false,
      image: null,
      updateSuccess: false,
      imageSuccess: false,
      pwdDialog: false
    }
  },
  components: {
    changePasswordComponent
  },
  computed: {
    lang () {
      return this.$store.getters['config/getSelectedLang']
    },
    ConfirmPWD () {
      return [
        v =>
          v === this.$refs.pwd.value ||
          this.$t('inputs.validationRules.confirmPassword')
      ]
    },
    getCategories () {
      if (this.lang) {
        return this.categories.filter(
          el => parseInt(el.lang_id) === parseInt(this.lang.id)
        )
      }
      return []
    },
    getActivities () {
      if (this.lang) {
        return this.activities.filter(
          el => parseInt(el.lang_id) === parseInt(this.lang.id)
        )
      }
      return []
    }
  },
  watch: {
    lang (newVal, oldVal) {
      this.category = this.categories.find(
        el => el.id === this.profile.category_id && el.lang_id === newVal.id
      )
      this.activity = this.activities.find(
        el => el.id === this.profile.activity_id && el.lang_id === newVal.id
      )
    }
  },
  mounted () {
    this.getAuth()
  },
  methods: {
    getAuth () {
      this.$axios.get('auth').then(res => {
        this.profile = res.data
        this.getCustomerCategories()
        this.getCustomerActivities()
      })
    },
    getCustomerCategories () {
      this.$axios.get('/customer_categories').then(res => {
        this.categories = res.data
        const langId = localStorage.getItem('lang') || 1
        this.category = this.categories.find(
          el =>
            el.id === this.profile.category_id &&
            el.lang_id === parseInt(langId)
        )
      })
    },
    getCustomerActivities () {
      this.$axios.get('/customer_activities').then(res => {
        this.activities = res.data
        const langId = localStorage.getItem('lang') || 1
        this.activity = this.activities.find(
          el =>
            el.id === this.profile.activity_id &&
            el.lang_id === parseInt(langId)
        )
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
          data.append('first_name', this.profile.first_name)
          data.append('last_name', this.profile.last_name)
          data.append('email', this.profile.email)
          data.append('phone', this.profile.phone)
          data.append('category_id', this.category.id)
          data.append('activity_id', this.activity.id)

          this.$axios.post('profile', data, config).then(res => {
            this.updateSuccess = true
            this.$store.dispatch('config/setAuth', res.data)
          })
        }
      })
    },
    checkFileType (files) {
      return files.filter(
        file =>
          file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'image/jpeg'
      )
    },

    onRejected (rejectedEntries) {
      this.imageError = true
    },
    changeProfilePic () {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const data = new FormData()
      data.append('image', this.image)

      this.$axios.post('changeProfilePic', data, config).then(res => {
        const profile = this.$store.getters['config/getAuth']
        profile.image = res.data
        this.$store.dispatch('config/setAuth', profile)
        this.image = null
        this.imageSuccess = true
        this.imageError = false
        this.profile.image = res.data
      })
    }
  }
}
</script>
