<template>
  <r-container class="container-fluid pa-0">
    <r-modal
      v-model="open"
    >
      <r-text-input
        :label="$t('search')"
        @update:modelValue="searchCountries"
        v-model="search"
      ></r-text-input>
      <r-list>
        <div :class="`list-item`" :key="pb.iso2 + (pb.preferred ? '-preferred' : '')"
             @click.stop="choose(pb)"
             v-for="pb in countries"
             v-ripple
        >
          <div
            :class="pb.iso2.toLowerCase()"
            class="iti-flag"></div>
          <div class="list-title">{{pb.name}}</div>
          <r-spacer></r-spacer>
          <span>+{{ pb.dialCode }}</span>
        </div>
      </r-list>
    </r-modal>
    <r-row
      class="v-center h-center"
    >
      <r-col class="col-12">
        <r-btn class="ltr" :disabled="!select" @click.stop="toggleDropdown" outlined>
          <div :class="activeCountry.iso2.toLowerCase()" class="iti-flag"></div>
          <span class="country-code pa-1"> +{{ activeCountry.dialCode }} </span>
          <span class="dropdown-arrow">{{ open ? "▲" : "▼" }}</span>
        </r-btn>
      </r-col>
      <r-col
        class="col-12"
      >
        <r-mask-input :label="label?label:$t('phone')"
                      @update:model-value="emit"
                      mask="+98 (000) 000-0000"
                      :required="required"
                     v-model="tel.phone"
        >

        </r-mask-input>
      </r-col>
    </r-row>
  </r-container>
</template>

<script>
import Ripple from '../../../directive/ripple/index'
import allCountries from './assets/all-countries'

export default {
  name: 'inputTel',
  directives: { ripple: Ripple },
  props: {
    label: {
      type: String
    },
    modelValue: {
      type: Object
    },
    defaultCountry: {
      // Default country code, ie: 'AU'
      // Will override the current country of user
      type: String,
      default: ''
    },
    required:Boolean,
    select: {
      type: Boolean,
      default: false
    }

  },
  data () {
    return {
      tel: this.modelValue,
      search: '',
      countries: {},
      activeCountry: { iso2: 'US', dialCode: '1' },
      open: false
    }
  },
  mounted () {
    this.initializeCountry()
    this.countries = allCountries
  },
  created () {
    if (this.modelValue) {
      this.activeCountry.dialCode=this.modelValue.country_code
    }
  },
  methods: {
    initializeCountry () {
      /**
                 * 1. Use default country if passed from parent
                 */
      if (this.defaultCountry) {
        const defaultCountry = this.findCountry(this.defaultCountry)
        if (defaultCountry) {
          this.activeCountry = defaultCountry
          return
        }
      }
      /**
                 * 2. Check if fetching country based on user's IP is allowed, set it as the default country
                 */
      fetch('http://ip-api.com/json/', {
        method: 'get'
      }).then((response) => {
        const that = this
        response.json().then(function (data) {
          that.activeCountry = that.findCountry(data.countryCode) || that.activeCountry
        })
      }).catch((error) => {
        return Promise.reject(error)
      })
    },
    /**
             * Get the list of countries from the list of iso2 code
             */
    getCountries (list = []) {
      return list
        .map(countryCode => this.findCountry(countryCode))
        .filter(Boolean)
    },
    findCountry (iso = '') {
      return allCountries.find(country => country.iso2 === iso)
    },
    searchCountries () {
      const Countries = allCountries.map((country) => {
        if (country.name.toLowerCase().search(this.search.toLowerCase()) !== -1) {
          return country
        }
      })
      this.countries = Countries.filter(function (el) {
        return el != null
      })
    },
    choose (country) {
      this.activeCountry = country
      this.emit()
      this.reset()
    },
    reset () {
      this.search = ''
      this.countries = allCountries
      this.open = false
    },
    getItemClass (index, iso2) {
      const highlighted = this.selectedIndex === index
      const lastPreferred = index === this.preferredCountries.length - 1
      const preferred = this.preferredCountries.some(c => c.toUpperCase() === iso2)
      return {
        highlighted,
        'last-preferred': lastPreferred,
        preferred
      }
    },
    emit (e) {
      this.tel.country_code=this.activeCountry.dialCode
      this.$emit('update:modelValue', this.tel)
    },
    toggleDropdown () {
      this.open = !this.open
    },
    clickedOutside () {
      this.open = false
    }
  }
}
</script>

<style src="./assets/sprite.css"></style>
