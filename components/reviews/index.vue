<template>
  <r-container class="container-fluid">
    <r-row>
      <r-col class="col-12 text-center" v-if="!readonly">
        <r-btn @click.prevent="open"
               class="ps-1 color-one-text"
               outlined
               rounded
        >
          <r-icon class="mdi-plus"></r-icon>
          {{$t('reviews_new')}}
        </r-btn>
        <r-modal bottom
                 fullwidth
                 v-model="sheet">
          <r-card class="text-center pa-1" height="250px">
            <r-container>
            <r-form ref="form" v-model="valid">
              <r-rating
                :modelValue="item.score"
                size="large"
                v-model="item.score"
              ></r-rating>
              <r-text-area
                :label="$t('review')"
                :rules="['required','max_len:1000']"
                v-model="item.description"></r-text-area>
              <div class="d-flex h-end mt-2">
                <r-btn @click.stop="sheet = !sheet" class="color-error-text mx-1" outlined rounded>
                  {{$t('cancel')}}
                </r-btn>
                <r-btn :disabled="!valid" :loading="loading" @click.stop="save" class="color-success-text" outlined
                       rounded>
                  {{$t('send')}}
                </r-btn>
              </div>
            </r-form>
              </r-container>
          </r-card>
        </r-modal>
      </r-col>
    </r-row>

    <r-infinite-page :url="link" direction="start" v-if="show" no-item-msg="no_item_reviews">
      <template v-slot="prop">
        <r-card :key="i" class="pa-3 ma-2" flat
                v-for="(item,i) in prop.items">
          <r-row>
            <r-col>
              <div class="subtitle-1">
                {{item.user.name}}
                <r-rating
                :modelValue="item.score"
                readonly
                size="x-small"
              ></r-rating>
              </div>
            </r-col>
            <r-col class="text-end">
              <r-time-ago :time="item.created_at" class="caption teal--text "></r-time-ago>
            </r-col>
          </r-row>

          <div class="body-1 white-space-pre-line">
            {{item.description}}
          </div>
          <div class="text-end">
            <r-divider class="pa-1"></r-divider>
            <r-btn @click.stop="update(item._id,'like')"
                   class="px-1 color-one-text"
                   outlined
                   rounded
                   size="small">
              {{item.likes?item.likes:0}}
              <r-icon class="mx-1 mdi-thumb-up-outline"></r-icon>
            </r-btn>
            <r-btn @click.prevent.stop="update(item._id,'dislike')"
                   class="px-1 mx-1 color-error-text"
                   outlined
                   rounded
                   size="small">
              {{item.dislikes?item.dislikes:0}}
              <r-icon class="mx-1 mdi-thumb-down-outline"></r-icon>
            </r-btn>
          </div>
        </r-card>

      </template>
    </r-infinite-page>
  </r-container>
</template>

<script>
export default {
  name: 'r-reviews',
  props: {
    link: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sheet: false,
      valid: false,
      loading: false,
      show: true,
      item: {
        score: 0,
        description: ''
      }
    }
  },
  methods: {
    open () {
      if (!this.$helper.ifHas(this.$r.store,false,'user','login')) {
        window.storage.set('url.intended', this.$route.fullPath)
        this.$toast('reviews.login_need', { type: 'warning' })
        this.$router.push({ name: 'login' })
      } else {
        this.sheet = !this.sheet
      }
    },
    save () {
      this.loading = true
      this.$axios.post(this.link, this.item)
        .then(() => {
          this.loading = false
          this.sheet = false
          this.show = false
          setTimeout(() => {
            this.show = true
          }, 100)
        }, () => {
          this.loading = false
        })
    },
    update (id, type) {
      this.$axios.put(this.link + '/' + id,
        { 'for': type })
        .then(() => {
          this.show = false
          setTimeout(() => {
            this.show = true
          }, 100)
        })
    }
  }
}
</script>
