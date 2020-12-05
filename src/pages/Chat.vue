<template>
  <q-page class="bg-grey-1" padding>
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12 text-h6 text-weight-bold">Messagerie</div>
      </div>
      <div class="row">
        <div v-if="messages.length > 0" class="col-12">
          <q-chat-message
            v-for="(m, i) in messages"
            :key="i"
            :text="[m.message]"
            :sent="m.sender === 'USER'"
          />
        </div>
        <div v-else class="col-12 text-subtitle1 text-grey-6 q-pt-xl text-center">
          <q-icon name="eva-email-outline" size="20vw" color="grey-2"/>
        </div>
      </div>

      <div class="row bg-white q-pa-md">
        <div class="col-11 q-pa-xs">
          <q-input
            filled
            v-model="newMsg"
            color="red-8"
            type="text"
            label="Ecrivez un message ..."
            autogrow
          />
          <div v-if="msgEmpty" class="text-caption text-red">Veuillez écrire quelque chose</div>
        </div>
        <div class="col-1 q-pa-xs text-center">
          <q-btn
            class="q-pa-sm bg-red-1"
            flat
            round
            size="md"
            color="red-8"
            icon="eva-paper-plane-outline"
            @click="sendMessage"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ChatPage',
  data () {
    return {
      messages: [],
      newMsg: '',
      msgEmpty: false
    }
  },
  computed: {},
  mounted () {
    this.getCustomerMessages()
  },
  methods: {
    getCustomerMessages () {
      this.$axios.get('/getMessages').then(res => {
        this.messages = res.data
      })
    },
    sendMessage () {
      if (this.newMsg === null || this.newMsg === '') {
        this.msgEmpty = true
      } else {
        this.$axios
          .post('/sendMessage', {
            message: this.newMsg
          })
          .then(res => {})
      }
    },
    hasRole (role) {
      return this.$store.getters['config/hasRole'](role)
    }
  }
}
</script>
