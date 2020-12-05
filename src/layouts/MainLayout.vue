<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-grey-10" bordered height-hint="98">
      <q-toolbar class="bg-red-8 text-white">
        <q-btn
          dense
          flat
          round
          class="q-ml-sm bg-red-9 q-pa-xs"
          icon="eva-menu-outline"
          @click="left = !left"
        />

        <q-toolbar-title>
          <div class="q-mt-sm cursor-pointer">
            <img src="icon.png" style="width: 130px" @click="$router.push('/')">
          </div>
        </q-toolbar-title>
        <q-btn
          v-if="$q.platform.is.mobile"
          dense
          flat
          round
          class="q-ml-sm bg-red-9 q-pa-xs"
          icon="eva-search-outline"
          @click=" searchDialog= true"
        />
        <q-btn-dropdown
          v-else
          dense
          flat
          round
          class="q-ml-sm bg-red-9 q-pa-xs"
          dropdown-icon="eva-search-outline"
          style="border-radius: 50%; width: 41.59px; height: 41.59px"
          no-icon-animation
          @click="getRecentSearches(); q = ''; searchResult = []"
          cover
        >
          <q-list style="width: 300px;" class="q-pa-sm">
            <q-item class="q-pa-xs">
              <q-item-section>
                <q-input
                  dense
                  filled
                  round
                  color="grey-10"
                  v-model="q"
                  @input="searchProduct"
                  type="text"
                  :label="$t('searchOnTheWebSite')"
                />
              </q-item-section>
            </q-item>
            <q-item class="q-pa-sm" v-if="filteredRecentSearches.length > 0">
              <q-item-section class="no-padding">
                <div class="text-caption text-weight-bold">Recherches recentes</div>
              </q-item-section>
            </q-item>
            <q-item
              v-for="( n, i) in filteredRecentSearches"
              :key="i"
              class="q-mt-xs q-pa-xs rounded-borders bg-grey-1"
              clickable
              dense
              @click="clickOnSearchResultItem(n)"
              v-close-popup
            >
              <q-item-section avatar>
                <q-avatar size="sm" color="white" icon="eva-search-outline"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-caption">
                  <span class="text-grey-8">{{ n.name }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-pa-xs">
              <q-item-section
                class="text-caption text-weight-bold text-grey-10"
              >Résultat de recherche</q-item-section>
            </q-item>
            <q-item
              v-for="( n, i) in getSearchResultByLang"
              :key="i"
              class="q-mt-xs q-pa-sm rounded-borders bg-grey-1"
              clickable
              @click="clickOnSearchResultItem(n)"
              v-close-popup
            >
              <q-item-section avatar>
                <q-avatar rounded>
                  <img
                    class="bg-grey-2"
                    :src="n.image !== null && n.image !== ''
      ? $axios.defaults.baseURL.replace('api', 'images') + n.image : 'no_photo.png'"
                  >
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-caption">
                  <span class="text-weight-bold">{{ n.name }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="getSearchResultByLang.length === 0">
              <q-item-section class="text-center text-grey-8">{{ $t('noResult') }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown
          v-if="getAuth !== null"
          dense
          flat
          round
          style="border-radius: 50%; width: 41.59px; height: 41.59px"
          class="q-ml-sm bg-red-9 q-pa-xs"
          dropdown-icon="eva-bell-outline"
          no-icon-animation
          @click="markAllNotificationsAsSeen"
        >
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-badge
                color="white"
                class="text-weight-bold"
                text-color="red-8"
                floating
              >{{ getNotificationsByLang.filter(el => el.seen === 0).length }}</q-badge>
            </div>
          </template>
          <q-list style="width: 330px">
            <q-item
              v-for="( n, i) in getNotificationsByLang"
              :key="i"
              :class="'q-pa-md ' + (n.seen === 0 ? ' bg-grey-1' : '')"
              clickable
              v-close-popup
              @click="onClickNotification(n)"
            >
              <q-item-section v-if="n.type === 'STOCK_ARRIVAL'" avatar>
                <q-avatar rounded>
                  <img
                    class="bg-grey-2"
                    :src="n.default_image !== null && n.default_image !== ''
      ? $axios.defaults.baseURL.replace('api', 'images') + n.default_image : 'no_photo.png'"
                  >
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-caption" v-if="n.type === 'STOCK_ARRIVAL'">
                  <span class="text-weight-bold text-red-8">{{ n.name }}</span>
                  {{ ' ' + $t('isAvailableNow') }}
                  <div class="text-caption text-grey-8">{{ n.created_at }}</div>
                </q-item-label>
                <q-item-label v-if="n.type === 'ACCOUNT_CONFIRMED'">
                  <span class="text-weight-bold text-grey-10">{{ $t('accountConfirmed') }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          dense
          flat
          round
          class="q-ml-sm bg-red-9 q-pa-xs"
          icon="eva-shopping-cart-outline"
          @click="$router.push('/Cart')"
        />
        <q-btn
          v-if="getAuth === null"
          dense
          flat
          rounded
          class="q-ml-sm bg-red-9 q-pa-xs"
          icon="eva-person-outline"
          to="/loginRegister"
        />
        <q-btn
          v-else
          dense
          flat
          round
          class="bg-white text-center text-red-8 text-weight-bold q-ml-sm q-pa-xs"
          :label="getAuth.last_name[0]"
          @click="right = !right"
        />
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/" :label="$t('navbar.home')" class="text-capitalize"/>
        <q-route-tab to="/" :label="$t('navbar.promotions')" class="text-capitalize"/>
        <q-route-tab to="/" :label="$t('navbar.cgv')" class="text-capitalize"/>
        <q-route-tab to="/" :label="$t('navbar.contact')" class="text-capitalize"/>
      </q-tabs>
    </q-header>
    <q-drawer v-model="left" side="left" bordered>
      <ProductCategoriesList :categories="getProductCategoriesBySelectedLang"></ProductCategoriesList>
    </q-drawer>

    <q-drawer v-model="right" side="right" bordered>
      <CustomerSideBar></CustomerSideBar>
    </q-drawer>

    <q-page-container>
      <router-view/>
      <FooterComponent></FooterComponent>
    </q-page-container>

    <q-footer v-if="$q.platform.is.mobile" class="bg-red-8 text-white">
      <q-toolbar>
        <q-toolbar-title></q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <SearchComponent
      v-if="$q.platform.is.mobile"
      :dialog="searchDialog"
      v-on:closeDialog="searchDialog = false"
    ></SearchComponent>
    <q-dialog v-model="loginDialog">
      <q-card style="width: 400px">
        <q-card-section class="row items-center">
          <LoginForm :isDialog="true" v-on:closeDialog="loginDialog = false"></LoginForm>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import FooterComponent from 'components/Footer'
import CustomerSideBar from 'components/CustomerSideBar'
import ProductCategoriesList from 'components/ProductCategoriesList'
import SearchComponent from 'components/SearchComponent'
import LoginForm from 'components/LoginForm'

export default {
  data () {
    return {
      left: false,
      right: false,
      categories: [],
      loginDialog: false,
      notifications: [],
      searchDialog: false,
      searchResult: [],
      q: '',
      recentSearches: []
    }
  },
  components: {
    FooterComponent,
    CustomerSideBar,
    ProductCategoriesList,
    SearchComponent,
    LoginForm
  },
  computed: {
    getAuth () {
      return this.$store.getters['config/getAuth']
    },
    getProductCategoriesBySelectedLang () {
      const lang = this.$store.getters['config/getSelectedLang']
      if (lang) {
        return this.categories.filter(
          el => parseInt(el.lang_id) === parseInt(lang.id)
        )
      }
      return []
    },
    getNotificationsByLang () {
      const lang = this.$store.getters['config/getSelectedLang']
      if (lang) {
        return this.notifications.filter(
          el =>
            parseInt(el.lang_id) === parseInt(lang.id) || el.lang_id === null
        )
      }
      return []
    },
    getSearchResultByLang () {
      // const lang = this.$store.getters['config/getSelectedLang']
      // if (lang) {
      //   return this.searchResult.filter(
      //     el => parseInt(el.lang_id) === parseInt(lang.id)
      //   )
      // }
      // return []
      return this.searchResult
    },
    filteredRecentSearches () {
      const array = []

      if (this.getSearchResultByLang.length === 0) {
        this.recentSearches.forEach(el => {
          const item = array.find(
            e => el.module_id === e.module_id && el.module === e.module
          )
          if (!item) {
            array.push(el)
          }
        })
      }

      return array
    }
  },
  mounted () {
    this.getProductCategories()
    this.getNotifications()
    this.$root.$on('openLoginDialog', this.openLoginDialog)
  },
  methods: {
    openLoginDialog () {
      this.loginDialog = true
    },
    getProductCategories () {
      this.$axios.get('/product_categories').then(res => {
        this.categories = res.data
      })
    },
    markAllNotificationsAsSeen () {
      this.$axios.post('/markAllNotificationsAsSeen').then(res => {
        this.notifications.forEach(el => {
          el.seen = 1
        })
      })
    },
    getNotifications () {
      this.$axios.get('/notifications').then(res => {
        this.notifications = res.data
      })
    },
    onClickNotification (n) {
      if (n.type === 'STOCK_ARRIVAL') {
        this.$router.push('/Product/' + n.product_id)
      }
    },
    searchProduct () {
      if (
        this.q !== null &&
        this.q !== '' &&
        this.q.split(' ').join('') !== ''
      ) {
        this.$axios
          .post('/search', {
            q: this.q
          })
          .then(res => {
            this.searchResult = res.data
          })
      } else {
        this.searchResult = []
      }
    },
    getRecentSearches () {
      this.$axios.get('/getRecentSearches').then(res => {
        this.recentSearches = res.data
      })
    },
    clickOnSearchResultItem (s) {
      const page =
        s.module === 'PRODUCT'
          ? 'Product'
          : s.module === 'BRAND'
            ? 'Brand'
            : 'Category'
      this.$axios
        .post('/saveSearch' + (this.getAuth === null ? 'ForVisitor' : ''), {
          module: s.module,
          module_id: s.module_id
        })
        .then(res => {
          this.$router.push('/' + page + '/' + s.module_id)
        })
    }
  }
}
</script>
