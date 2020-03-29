var app = new Vue({
    el: '#app',
    data: {
        slides: ['sl01', 'sl02', 'sl03', 'sl04', 'sl05'],
        i: 0,
    },
    components: {
        'sl01': {
            template: `<div>I'm Pete, a Web Developer in Portland Oregon.</div>`
        },
        'sl02': {
            template: `<div>I am a graduate of PDX Code Guild's Full Stack Bootcamp.</div>`
        },
        'sl03': {
            template: `<div>There I learned Python, JavaScript, HTML/CSS, and Django.</div>`
        },
        'sl04': {
            template: `<div>For my Capstone Project, I built a fitness-tracking website.</div>`
        },
        'sl05': {
            template: `<div>Stay tuned, as I develop a frontend demo of my project...</div>`
        }
    },
    methods: {
        forward: function() {
            if (this.i < this.slides.length - 1) {
                this.i++;
            };
        },
        backward: function() {
            if (this.i > 0) {
                this.i--;
            };
        },
    },
})