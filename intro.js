// openFullScreen()
var app = new Vue({
    el: '#app',
    data: {
        slides: ['sl01', 'sl02', 'sl03', 'sl04', 'sl05', 'sl06', 'sl07'],
        i: 0,
    },
    components: {
        'sl01': {
            template: `<div>Welcome to My Portfolio.  Press any key to continue.</div>`
        },
        'sl02': {
            template: `<div>I'm Pete, a Web Developer in Portland Oregon.</div>`
        },
        'sl03': {
            template: `<div>I am a graduate of PDX Code Guild's Full Stack Bootcamp.</div>`
        },
        'sl04': {
            template: `<div>There I learned Python, JavaScript, HTML/CSS, and Django.</div>`
        },
        'sl05': {
            template: `<div>For my Capstone Project, I built a Fitness-Tracking website.</div>`
        },
        'sl06': {
            template: `<div>Here, I've retooled part of my Project into a Frontend Demo.</div>`
        },
        'sl07': {
            template: `<div>Thanks for visiting my Portfolio.</div>`
        },
    },
    methods: {
        forward: function() {
            if (this.i < this.slides.length - 1) {
                this.i++;
            } else {
                window.location = '/macro-tracker.html'
            }
        },
        backward: function() {
            if (this.i > 0) {
                this.i--;
            };
        },
    },
})

window.addEventListener('keypress', (e) => {
    app.forward();
})