import Translate from './Translate';

class DateTime {
  constructor () {
    this.dateTimeFormats = {
      en: {
        localizeName: 'en-US',
        timeZone: 'America/New_York',
        narrow: {
          weekday: 'narrow'
        },
        day: {
          day: 'numeric'
        },
        month: {
          month: 'short'
        },
        year: {
          year: 'numeric'
        },
        short: {
          year: 'numeric', month: 'short', day: 'numeric'
        },
        medium: {
          year: 'numeric', month: 'numeric', day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      fa: {
        localizeName: 'fa-IR',
        timeZone: 'Asia/Tehran',
        narrow: {
          weekday: 'narrow'
        },
        day: {
          day: 'numeric'
        },
        month: {
          month: 'short'
        },
        year: {
          year: 'numeric'
        },
        short: {
          year: 'numeric', month: 'short', day: 'numeric'
        },
        medium: {
          year: 'numeric', month: 'numeric', day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        }
      }
    };
  }

  formatLocal (value, type = 'long', local = null) {
    local = local === null ? Translate._local : local;
    var opt = this.dateTimeFormats[local][type];
    opt.hour12 = false;
    opt.timeZone = this.dateTimeFormats[local].timeZone;
    try {
      return new Intl.DateTimeFormat(this.dateTimeFormats[local].localizeName, opt).format(value);
    }catch (e) {
      console.error(e)
      return value
    }
  }
}

export default new DateTime();
