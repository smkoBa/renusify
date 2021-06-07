<template>
    <r-input v-bind="$attrs" :model-value="modelValue" @click.prevent="show=true">
        <input
                :value="modelValue?$d(modelValueDate,'medium'):null"
        />
    </r-input>
    <r-modal :model-value="show" @update:model-value="close()" :closebtn="false" closable class="text-center">
        <div class="r-date-picker">
            <div class="r-sheet">
                <r-container>
                    <r-row>
                        <r-col>
                            <r-btn icon @click.prevent="incrementMonth(-1)">
                                <r-icon class="mdi-arrow-left"></r-icon>
                            </r-btn>
                        </r-col>
                        <r-col>
                            <r-menu v-model="showMonth"
                                    :list="createRange(12)"
                                    :label="$d(new Date(currentPeriod.year,currentPeriod.month,1),'month',locale)"
                                    icon="mdi-chevron-down">
                                <template v-slot="props">
                                    <div class="subtitle-2"
                                         @click.prevent="currentPeriod.month=props.item , showMonth=false"
                                    >{{ $d(new Date(currentPeriod.year,props.item,1),'month',locale) }}
                                    </div>
                                </template>

                            </r-menu>
                        </r-col>
                        <r-col>
                            <r-menu v-model="showYear"
                                    ref="yearMenu"
                                    @update:model-value="go()"
                                    :list="yearRange"
                                    :label="$d(new Date(currentPeriod.year,currentPeriod.month,1),'year',locale)"
                                    icon="mdi-chevron-down">
                                <template v-slot="props">
                                    <div :ref="'year-'+props.item" class="subtitle-2"
                                         @click.prevent="currentPeriod.year=props.item , showYear=false"
                                    >{{ $d(new Date(props.item,currentPeriod.month,1),'year',locale) }}
                                    </div>
                                </template>

                            </r-menu>
                        </r-col>
                        <r-col>
                            <r-btn icon @click.prevent="incrementMonth(1)">
                                <r-icon class="mdi-arrow-right"></r-icon>
                            </r-btn>
                        </r-col>
                    </r-row>
                </r-container>

                <table class="table">
                    <thead>
                    <tr>
                        <th class="headCell" v-for="(weekday, weekdayIndex) in weekDays" :key="weekdayIndex">
                            <span class="headCellContent">{{weekday}}</span>
                        </th>
                    </tr>
                    </thead>
                    <transition :name="direction==='next'?'slide-start-to-end':'slide-end-to-start'" mode="out-in">
                        <tbody
                                :key="currentPeriod.year + '-' + currentPeriod.month"
                        >
                        <tr class="table-row" v-for="(week, weekIndex) in currentPeriodDates" :key="weekIndex">
                            <td
                                    class="cell"
                                    v-for="item in week"
                                    :class="{
                         selectable: !readOnly && !item.disabled,
                         selected: item.selected,
                         disabled: item.disabled,
                         today: item.today
                                    }"
                                    :key="item.date"
                                    @click="item.date!==0 &&!readOnly&& selectDateItem(item)"
                            >
                                <div
                                        class="cellContent d-flex h-center v-center"
                                        v-if="item.date!==0"
                                >
                                    {{ $d(item.date,'day',locale) }}
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </transition>
                </table>
            </div>
        </div>
    </r-modal>
</template>

<script>
    import RContainer from "../container/index";

    export default {
        name:'datePicker',
        inheritAttrs: false,
        components: {RContainer},
        props: {
            modelValue: {
                type: String
            },
            lang: {
                type: String
            },
            readOnly: Boolean,
            hasInputElement: {
                type: Boolean,
                default: true
            },
            inputAttributes: {
                type: Object
            },
            selectableYearRange: {
                type: [Number, Object, Function],
                default: 40
            },
            isDateDisabled: {
                type: Function,
                default: () => false
            },
            mobileBreakpointWidth: {
                type: Number,
                default: 500
            },
            firstDay: {
                type: [Number, String]
            }
        },
        data() {
            return {
                show: false,
                showMonth: false,
                showYear: false,
                direction: undefined,
                currentPeriod: {
                    month: (this.modelValue ?new Date(this.modelValue): new Date()).getMonth(),
                    year: (this.modelValue ?new Date(this.modelValue): new Date()).getFullYear()
                }
            }
        },
        computed: {
            firstDayOfWeek() {
                return this.firstDay || (parseInt(this.$t('date_first_day')) || 0)
            },
            locale() {
                return this.lang || this.$r.lang
            },
            today() {
                return new Date()
            },
            timezoneOffset() {
                return new Date().getTimezoneOffset()
            },
            weekDays() {
                const first = parseInt(this.firstDayOfWeek, 10)

                return this.createRange(7).map(i => this.$d(new Date(2020, 2, first + i + 2, 0, this.timezoneOffset, 0), 'narrow', this.locale)) // 2017-02-02 is Sunday
            },
            modelValueDate() {
                return this.modelValue ? new Date(this.modelValue) : new Date()
            },
            rangeLocalDate() {
                const {year, month} = this.currentPeriod
                let firstDay = 1
                let firstmonth = month
                let firstyear = year
                let first = new Date(firstyear, firstmonth, firstDay, 12, this.timezoneOffset, 0)
                for (let i = 0; i < 5; i++) {
                    firstDay--
                    const df = this.$d(first, 'day', this.locale)
                    const date = new Date(firstyear, firstmonth, firstDay, 12, this.timezoneOffset, 0)
                    const d = this.$d(date, 'day', this.locale)
                    if (df.length === 1 && d.length === 2) {
                        i = 100
                    } else {
                        firstDay = date.getDate()
                        firstmonth = date.getMonth()
                        firstyear = date.getFullYear()
                        first = date
                        i--
                    }
                }

                firstDay = 1
                firstmonth = month
                firstyear = year
                let last = new Date(firstyear, firstmonth, firstDay, 12, this.timezoneOffset, 0)
                for (let i = 0; i < 5; i++) {
                    firstDay++
                    const dl = this.$d(last, 'day', this.locale)
                    const date = new Date(firstyear, firstmonth, firstDay, 12, this.timezoneOffset, 0)

                    const d = this.$d(date, 'day', this.locale)
                    if (dl.length === 2 && d.length === 1) {
                        i = 100
                    } else {
                        firstDay = date.getDate()
                        firstmonth = date.getMonth()
                        firstyear = date.getFullYear()
                        last = date
                        i--
                    }
                }

                return {start: first, end: last}
            },
            weekDaysBeforeFirstDayOfTheMonth() {
                const {start} = this.rangeLocalDate
                const weekDay = start.getDay()
                return (weekDay - parseInt(this.firstDayOfWeek) + 7) % 7
            },
            currentPeriodDates() {
                const {start, end} = this.rangeLocalDate
                const children = []
                let firstday = start.getDate()
                let firstmonth = start.getMonth()
                let firstyear = start.getFullYear()
                let rows = []
                let day = this.weekDaysBeforeFirstDayOfTheMonth

                while (day--) {
                    rows.push({
                        date: 0,
                        disabled: true,
                        selected: false,
                        today: false
                    })
                }
                let doJob = true
                while (doJob) {
                    const date = new Date(firstyear, firstmonth, 1, 12, this.timezoneOffset, 0)
                    date.setDate(firstday)
                    firstmonth = date.getMonth()
                    firstyear = date.getFullYear()
                    firstday = date.getDate() + 1
                    if (date.getTime() > end.getTime()) {
                        doJob = false
                    } else {
                        rows.push({
                            date: date,
                            disabled: this.isDateDisabled(date),
                            selected: this.areSameDates(date, this.modelValueDate),
                            today: this.areSameDates(date, this.today)
                        })

                        if (rows.length % 7 === 0) {
                            children.push(rows)
                            rows = []
                        }
                    }
                }

                if (rows.length) {
                    children.push(rows)
                }

                return children
            },
            yearRange() {
                const currentYear = new Date().getFullYear()
                const yearsRange = []
                let start = currentYear - 100
                const end = currentYear + 100
                for (start; start < end; start++) {
                    yearsRange.push(start)
                }
                return yearsRange
            },
        },
        watch: {
            modelValueDate(newVal) {
                this.currentPeriod = {
                    month: newVal.getMonth(),
                    year: newVal.getFullYear()
                }
            },
            currentPeriod(currentPeriod, oldPeriod) {
                const currentDate = new Date(currentPeriod.year, currentPeriod.month).getTime()
                const oldDate = new Date(oldPeriod.year, oldPeriod.month).getTime()
                this.direction = currentDate !== oldDate
                    ? (currentDate > oldDate ? 'next' : 'prev')
                    : undefined
            }
        },
        methods: {
            currentMonth(){
                let m=(this.modelValueDate || new Date()).getMonth()
                console.log(m)
                return m
            },
            scrollParentToChild(parent, child) {
                var parentRect = parent.getBoundingClientRect();
                var parentViewableArea = {
                    height: parent.clientHeight,
                    width: parent.clientWidth
                };

                var childRect = child.getBoundingClientRect();

                var isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height);

                if (!isViewable) {
                    parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top-100
                }


            },
            go() {
                setTimeout(() => {
                    if(this.$refs.yearMenu){
                        const menu = this.$refs.yearMenu.$el.querySelector('.dropdown-menu')
                    const view = this.$refs['year-' + this.currentPeriod.year]
                    if(menu&&view){
                         this.scrollParentToChild(menu,view)
                    }
                    }

                }, 200)

            },
            close() {
                this.show = false
                this.showMonth = false
                this.showYear = false
            },
            createRange(number) {
                const res = []
                for (let i = 0; i < number; i++) {
                    res.push(i)
                }
                return res
            },
            incrementMonth(increment = 1) {
                const refDate = new Date(this.currentPeriod.year, this.currentPeriod.month)
                const incrementDate = new Date(refDate.getFullYear(), refDate.getMonth() + increment)
                this.currentPeriod = {
                    month: incrementDate.getMonth(),
                    year: incrementDate.getFullYear()
                }
            },
            formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [year, month, day].join('-');
            },
            selectDateItem(item) {
                if (!item.disabled) {
                    this.$emit('update:modelValue', this.formatDate(item.date))
                    this.close()
                }
            },
            areSameDates(date1, date2) {
                if (typeof date1.getDate === 'function' && typeof date2.getDate === 'function') {
                    return (date1.getDate() === date2.getDate()) &&
                        (date1.getMonth() === date2.getMonth()) &&
                        (date1.getFullYear() === date2.getFullYear())
                }
                return false
            }
        }
    }

</script>

<style lang="scss">
    @import "../../style/include";

    .r-date-picker {
        position: relative;
        display: inline-block;
        font-size: 10px;
        color: #303030;

        @include dark {
            $Color: map_get($dark, 'one');
            .cell {
                &.today {
                    color: $Color;

                    .cellContent {
                        border: solid 1px $Color;
                    }
                }

                &.selected {
                    .cellContent {
                        color: #fff;
                        background: $Color;

                    }
                }

                &.selectable:hover {
                    .cellContent {

                        color: #fff;
                        background: $Color;

                    }
                }

            }
        }

        @include light {
            $Color: map_get($light, 'one');
            .cell {
                &.today {
                    color: $Color;

                    .cellContent {
                        border: solid 1px $Color;
                    }
                }

                &.selected {
                    .cellContent {

                        color: #fff;
                        background: $Color;

                    }
                }

                &.selectable:hover {
                    .cellContent {

                        color: #fff;
                        background: $Color;

                    }
                }

            }
        }

        .table {

            width: 100%;
            table-layout: fixed;
            position: relative;
            z-index: 5;

        }

        .cell, .headCell {

            text-align: center;
            box-sizing: border-box;

        }

        .cell {

            padding: 0.5em 0;

        }

        .headCell {

            padding: 0.3em 0.5em 1.8em;

        }

        .headCellContent {

            font-size: 1.3em;
            font-weight: normal;
            color: #848484;

        }

        .cellContent {
            padding: 5px;
            font-size: 1.4em;
            margin: 0 auto;
            width: 30px;
            height: 30px;
            text-align: center;
            border-radius: 100%;
            transition: background 0.1s, color 0.1s;

        }

        .cell.outOfRange {
            color: #c7c7c7;
        }

        .cell.selectable {

            cursor: pointer;

        }

        .cell.disabled {

            opacity: 0.5;

        }

    }
</style>
