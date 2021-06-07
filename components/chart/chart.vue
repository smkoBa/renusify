<template>
    <canvas ref="chart" :width="width" :height="height">
        Your browser does not support the canvas element.
    </canvas>
</template>

<script>
    export default {
        name: "r-chart",
        props: {
            width: String,
            height: String,
            type: String,
            items: Object,
            options: Object
        },
        data() {
            return {
                loaded: false
            };
        },
        mounted() {
            this.add();
            this.build();
        },
        methods: {
            build() {
                if (!this.loaded) {
                    setTimeout(() => {
                        this.build();
                    }, 500);
                    return;
                }

                var ctx = this.$refs.chart;
                //eslint-disable-next-line
                var myChart = new Chart(ctx, {
                    type: this.type,
                    data: this.items,
                    options: this.options
                });
            },
            add() {
                if (document.querySelector('[c="r-chart"]')) {
                    setTimeout(() => {
                        try {
                            if(Chart){
                                this.loaded = true;
                            }else{
                                this.add()
                            }
                        }catch (e) {
                            this.add()
                        }
                    }, 500);
                    return;
                }
                let meta = document.createElement("script");
                meta.setAttribute("c", "r-chart");
                meta.setAttribute(
                    "src",
                    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.bundle.min.js"
                );
                meta.setAttribute(
                    "integrity",
                    "sha512-SuxO9djzjML6b9w9/I07IWnLnQhgyYVSpHZx0JV97kGBfTIsUYlWflyuW4ypnvhBrslz1yJ3R+S14fdCWmSmSA=="
                );
                meta.setAttribute("crossorigin", "anonymous");
                meta.onload = () => {
                    this.loaded = true;
                };
                document.head.appendChild(meta);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~renusify/style/include";
</style>
