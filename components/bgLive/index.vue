<template>
  <div class="r-bg-live" ref="bglive">
    <svg width="100%" height="100%" :key="key">
      <path
        v-for="(circle, i) in shapes['circle']"
        :key="i"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        stroke-width="2"
        d=""
      >
        <animate
          attributeName="d"
          :dur="speed+'s'"
          fill="freeze"
          :from="circle[0]"
          :to="circle[1]"
        />
      </path>
      <polygon
        v-for="(rec, i) in shapes['rect']"
        :key="i"
        points=""
        fill="none"
        stroke="rgba(250,250,150,0.5)"
        stroke-width="2"
      >
        <animate
          attributeName="points"
          :dur="speed+'s'"
          fill="freeze"
          :from="rec[0]"
          :to="rec[1]"
        />
      </polygon>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "rBgLive",
  props: {
    speed: {
      type: Number,
      default: 3
    },rect: {
      type: Number,
      default: 3
    },
    circle: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      key: 0,
      bound: {},
      shapes: {
        rect: [],
        circle: []
      }
    };
  },
  mounted() {
    this.bound = this.$refs.bglive.getBoundingClientRect();
    this.build();
    setInterval(() => {
      this.change();
      this.key++;
    }, this.speed*1000);
  },
  methods: {
    build() {
      this.shapes["rect"] = [];
      let w = this.bound["width"] / this.rect;
      for (let i = 0; i < this.rect; i++) {
        let side = this.$helper.randomInt(3, 7);
        let points = "";
        let s = this.$helper.randomInt(0, this.rect);
        for (let j = 0; j < side; j++) {
          points +=
            this.$helper.randomInt( w * s-100, w + w * s+100) +
            "," +
            this.$helper.randomInt(-100, this.bound["height"]+100) +
            " ";
        }
        this.shapes["rect"].push([points, points]);
      }
      this.shapes["circle"] = [];
      for (let i = 0; i < this.circle; i++) {
        let d = "";
        d += "M ";
        d +=
          this.$helper.randomInt(-50, this.bound["width"]) +
          ", " +
          this.$helper.randomInt(-50, this.bound["height"]);
        d +=
          "a " +
          this.$helper.randomInt(50, 200) +
          "," +
          this.$helper.randomInt(50, 200);
        d += " 0 1,0 1,0";
        this.shapes["circle"].push([d, d]);
      }
    },
    change() {
      let w = this.bound["width"] / this.rect;
      for (let i = 0; i < this.rect; i++) {
        let side = this.shapes["rect"][i][0].split(",").length - 1;
        let points = "";
        let s = this.$helper.randomInt(0, this.rect);
        for (let j = 0; j < side; j++) {
          points +=
            this.$helper.randomInt( w * s+10, w + w * s) +
            "," +
            this.$helper.randomInt(10, this.bound["height"]) +
            " ";
        }
        this.shapes["rect"][i][0] = this.shapes["rect"][i][1];
        this.shapes["rect"][i][1] = points;
      }
      for (let i = 0; i < this.circle; i++) {
        let d = "";
        d += "M ";
        d +=
          this.$helper.randomInt(-100, this.bound["width"]+100) +
          ", " +
          this.$helper.randomInt(-100, this.bound["height"]+100);
        d +=
          "a " +
          this.$helper.randomInt(20, 100) +
          "," +
          this.$helper.randomInt(20, 150);
        d += " 0 1,0 1,0";
        this.shapes["circle"][i][0] = this.shapes["circle"][i][1];
        this.shapes["circle"][i][1] = d;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~renusify/style/include";
.#{$prefix}bg-live {
  width: 100%;
  position: relative;
  z-index: 0;
  svg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
}
</style>
