let customName = {
    props: ['name'],
    template: `<div>
    <span>Name:</span>
    <input id="name-input" value="Chicken Burrito" class="custom" type="text" :name="name" @input="$emit('input', $event.target.value)">
    </div>`
};

let nameInput = document.querySelector('#name-input');

let customKcal = {
    props: ['kcal'],
    template: `<div>
        <span>Calories:</span>
        <input value="990" class="custom" type="number" :kcal="kcal" @input="$emit('input', $event.target.value)">
    </div>`
};

let customFat = {
    props: ['fat'],
    template: `<div>
        <span>Grams of Fat</span>
        <input value="30" class="custom" type="number" :fat="fat" @input="$emit('input', $event.target.value)">
    </div>`
};

let customCarb = {
    props: ['carb'],
    template: `<div>
        <span>Grams of Carbohydrates:</span>
        <input value="124" class="custom" type="number" :carb="carb" @input="$emit('input', $event.target.value)">
    </div>`
};

let customProtein = {
    props: ['protein'],
    template: `<div>
        <span>Grams of Protein:</span>
        <input value="54" class="custom" type="number" :protein="protein" @input="$emit('input', $event.target.value)">
    </div>`
};

let entryTemplate = {
    props: ['entry'],
    template: `<template>
        <div class="name" @click="remove(entry)" :entry="entry">{{ entry.name }}</div>
        <div>{{ entry.kcal }}</div>
        <div>{{ entry.fat }}</div>
        <div>{{ entry.carb }}</div>
        <div>{{ entry.protein }}</div>
    </template>`
}

var tracker = new Vue({
    el: '#tracker',
    data: {
        date: moment().format("MMMM Do, YYYY") + " || Training Day",
        macros: {
            kcal: 2717,
            fat: 56,
            carb: 371,
            protein: 182,
        },
        totals: {
            kcal: 0,
            fat: 0,
            carb: 0,
            protein: 0,
        },
        entries: [],
        name: 'Chicken Burrito',
        kcal: '990',
        fat: '30',
        carb: '124',
        protein: '54',
        showEntry: false,
        blurBk: 'blurry',
        classBk: 'background',
    },
    watch: {
        entries: function() {
            let totalsObj = {
                kcal: 0,
                fat: 0,
                carb: 0,
                protein: 0,
            }
            let keys = Object.keys(totalsObj);
            console.log(keys);
            for (let i=0; i<this.entries.length; i++) {
                let entry = this.entries[i];
                for (let j=0; j<keys.length; j++) {
                    let key = keys[j]
                    console.log(key, 'hey')
                    totalsObj[key] += entry[key];
                    console.log(totalsObj, 'totalsobj')
                }
            }
            console.log(totalsObj)
            this.totals = totalsObj;
            drawGraph();
        },
    },
    methods: {
        toggleEntry: function() {
            this.showEntry = !this.showEntry;
        },
        trackIt: function() {
            this.entries.push({
                name: this.name,
                kcal: parseInt(this.kcal),
                fat: parseInt(this.fat),
                carb: parseInt(this.carb),
                protein: parseInt(this.protein),
            });
            this.name = '';
            this.kcal = '';
            this.fat = '';
            this.carb = '';
            this.protien = '';
        },
        remove: function(entry) {
            console.log('remove', entry)
            let index = this.entries.indexOf(entry)
            console.log(index)
            this.entries.splice(index, 1);
        },
    },
    components: {
        'custom-name': customName,
        'custom-kcal': customKcal,
        'custom-fat': customFat,
        'custom-carb': customCarb,
        'custom-protein': customProtein,
        'entry-template': entryTemplate,
    },
})

// var overUnder = JSON.parse(document.querySelector('#over_under').textContent);

let countUp = {
    kcal: 0,
    fat: 0,
    carb: 0,
    protein: 0,
};
// let countUp = totals

let ctx = document.querySelector('#progCnv').getContext('2d');
let w = 700;
let h = 350;

let yPos = [
    h*.1,
    h*.35,
    h*.6,
    h*.85,
];

let barH = h*(9/60);

let t = w*.65;

let keyToColor = {
    'kcal': 'blue',
    'fat': 'purple',
    'carb': 'yellow',
    'protein': 'red',
}

let keyToLabel = {
    'kcal': 'CALORIES',
    'fat': 'FAT',
    'carb': 'CARBS',
    'protein': 'PROTEIN',
}

let keys = Object.keys(keyToColor);

function drawGraph() {
    ctx.clearRect(0, 0, w, h + 3);

    //target range
    ctx.strokeStyle = 'hsla(0, 0%, 0%, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(t*.9 + 0.5*barH, 0);
    ctx.lineTo(t*.9 + 0.5*barH, h);
    ctx.moveTo(t*1.1 + 0.5*barH, 0);
    ctx.lineTo(t*1.1 + 0.5*barH, h);
    ctx.stroke();

    for (let i=0; i<keys.length; i++) {
        let y = yPos[i];
        let key = keys[i];
        let goal = tracker.macros[key];
        let label = keyToLabel[key];
        let counter = countUp[key];
        let prog = counter/goal;

        //empty bars
        ctx.fillStyle = 'hsla(0, 0%, 0%, 0.25)'
        ctx.fillRect(0, y, w, barH);

        //text
        ////goal
        ctx.font = '2.5rem Odibee Sans';
        ctx.fillStyle = 'black';

        ctx.textAlign = 'end';
        ctx.fillText(
            '/' + goal,
            w,
            y + .775*barH
        );
        
        ////'GOAL'
        // ctx.font = '2.5rem Odibee Sans';
        // ctx.fillStyle = 'black';

        // ctx.textAlign = 'end';
        // ctx.fillText(
        //     'G O A L',
        //     t*1.1 + 0.5*barH,
        //     y+ .775*barH
        // )

        ////label
        ctx.font = '2rem Odibee Sans';
        ctx.textAlign = 'start';
        ctx.fillText(
            label + ':',
            0,
            y - .1125*barH,
        )

        //filled bars
        ctx.fillStyle = keyToColor[key];
        ctx.fillRect(0, y, prog*t, barH);

        //arc
        ctx.beginPath();
        ctx.arc(
            prog*t -.5,
            y + 0.5*barH,
            0.5*barH,
            1.5*Math.PI,
            0.5*Math.PI
        );
        ctx.fill();

        //outline
        let strokeColor = counter < goal*.9 ? 'white'
            : counter >= goal*.9 && counter <= goal*1.1 ? 'green'
            : 'black';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(prog*t, y);
        ctx.arc(
            prog*t,
            y + 0.5*barH,
            0.5*barH,
            1.5*Math.PI,
            0.5*Math.PI
        );
        ctx.lineTo(0, y + barH);
        ctx.stroke();

        //text
        ////progress
        ctx.font = '2.5rem Odibee Sans';
        ctx.fillStyle = 'black';

        ctx.textAlign = 'end';
        ctx.fillText(
            Math.round(counter),
            t*prog + .375*barH,
            y + .775*barH
        );
    };
    //target line
    ctx.strokeStyle = 'hsla(0, 0%, 0%, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(t + 0.5*barH, 0);
    ctx.lineTo(t + 0.5*barH, h);
    ctx.stroke();

    //// 'TARGET' 'RANGE'
    ctx.font = '2rem Odibee Sans';
    ctx.fillStyle = 'black';

    ctx.textAlign = 'end';
    ctx.fillText(
        'TARGET >',
        t*0.9 + 0.5*barH,
        h*.08
    )

    ctx.textAlign = 'start';
    ctx.fillText(
        '< RANGE',
        t*1.1 + 0.5*barH,
        h*.08
    )
    
    //animation
    // if (countUp.kcal < totals.kcal) {
    //     countUp.kcal ++;
    //     requestAnimationFrame(drawGraph);
    if (countUp.kcal < tracker.totals.kcal) {
        countUp.kcal = countUp.kcal + (tracker.macros.kcal / 240)
        if (countUp.kcal > tracker.totals.kcal) {
            countUp.kcal = tracker.totals.kcal
        }
        requestAnimationFrame(drawGraph);
    // } else if (countUp.kcal < tracker.totals.kcal) {
    //     countUp.kcal++
    //     requestAnimationFrame(drawGraph);

    } else if (countUp.kcal > tracker.totals.kcal) {
        countUp.kcal = countUp.kcal - (tracker.macros.kcal / 240)
        if (countUp.kcal < tracker.totals.kcal) {
            countUp.kcal = tracker.totals.kcal
        }
        requestAnimationFrame(drawGraph);
    // } else if (countUp.kcal < tracker.totals.kcal) {
    //     countUp.kcal--
    //     requestAnimationFrame(drawGraph);

    } else if (countUp.fat < tracker.totals.fat) {
        countUp.fat = countUp.fat + (tracker.macros.fat / 240)
        if (countUp.fat > tracker.totals.fat) {
            countUp.fat = tracker.totals.fat
        }
        requestAnimationFrame(drawGraph);
    // } else if (countUp.fat < tracker.totals.fat) {
    //     countUp.fat++
    //     requestAnimationFrame(drawGraph);

    } else if (countUp.fat > tracker.totals.fat) {
        countUp.fat = countUp.fat - (tracker.macros.fat / 240)
        if (countUp.fat < tracker.totals.fat) {
            countUp.fat = tracker.totals.fat
        }
        requestAnimationFrame(drawGraph);
    // } else if (countUp.fat < tracker.totals.fat) {
    //     countUp.fat--
    //     requestAnimationFrame(drawGraph);

    } else if (countUp.carb < tracker.totals.carb) {
        countUp.carb = countUp.carb + (tracker.macros.carb / 240)
        if (countUp.carb > tracker.totals.carb) {
            countUp.carb = tracker.totals.carb
        }
        requestAnimationFrame(drawGraph);
    // } else if (countUp.carb < tracker.totals.carb) {
    //     countUp.carb++
    //     requestAnimationFrame(drawGraph);

    } else if (countUp.carb > tracker.totals.carb) {
        countUp.carb = countUp.carb - (tracker.macros.carb / 240)
        if (countUp.carb < tracker.totals.carb) {
            countUp.carb = tracker.totals.carb
        }
        requestAnimationFrame(drawGraph);
    // } else if (countUp.carb < tracker.totals.carb) {
    //     countUp.carb--
    //     requestAnimationFrame(drawGraph);

    } else if (countUp.protein < tracker.totals.protein) {
        countUp.protein = countUp.protein + (tracker.macros.protein / 240)
        if (countUp.protein > tracker.totals.protein) {
            countUp.protein = tracker.totals.protein
        }
        requestAnimationFrame(drawGraph);
    // } else if (countUp.protein < tracker.totals.protein) {
    //     countUp.protein++
    //     requestAnimationFrame(drawGraph);

    } else if (countUp.protein > tracker.totals.protein) {
        countUp.protein = countUp.protein - (tracker.macros.protein / 240)
        if (countUp.protein < tracker.totals.protein) {
            countUp.protein = tracker.totals.protein
        }
        requestAnimationFrame(drawGraph);
    // } else if (countUp.protein < tracker.totals.protein) {
    //     countUp.protein--
    //     requestAnimationFrame(drawGraph);

    } else {
        console.log('meep');



    // else if (countUp.kcal > totals.kcal) {
    //     countUp.kcal --;
    //     requestAnimationFrame(drawGraph);
    // } else if (countUp.fat < totals.fat) {
    //     countUp.fat ++;
    //     requestAnimationFrame(drawGraph);
    // } else if (countUp.fat > totals.fat) {
    //     countUp.fat --;
    //     requestAnimationFrame(drawGraph);
    // } else if (countUp.carb < totals.carb) {
    //     countUp.carb ++;
    //     requestAnimationFrame(drawGraph);
    // } else if (countUp.carb > totals.carb) {
    //     countUp.carb --;
    //     requestAnimationFrame(drawGraph);
    // } else if (countUp.protein < totals.protein) {
    //     countUp.protein ++;
    //     requestAnimationFrame(drawGraph); 
    // } else if (countUp.protein > totals.protein) {
    //     countUp.protein --;
    //     requestAnimationFrame(drawGraph);
        // return;
    };
};

drawGraph();

// function drawGraph(startObj, endObj, addOrRemove) {
//     ctx.clearRect(0, 0, w, h + 3);
//     console.log(startObj, endObj, addOrRemove)
//     //target range
//     ctx.strokeStyle = 'hsla(0, 0%, 0%, 0.5)';
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     ctx.moveTo(t*.9 + 0.5*barH, 0);
//     ctx.lineTo(t*.9 + 0.5*barH, h);
//     ctx.moveTo(t*1.1 + 0.5*barH, 0);
//     ctx.lineTo(t*1.1 + 0.5*barH, h);
//     ctx.stroke();

//     for (let i=0; i<keys.length; i++) {
//         let y = yPos[i];
//         let key = keys[i];
//         let goal = macros[key];
//         let label = keyToLabel[key];
//         let counter = startObj[key];
//         // console.log(counter)
//         let prog = counter/goal;

//         //empty bars
//         ctx.fillStyle = 'hsla(0, 0%, 0%, 0.25)'
//         ctx.fillRect(0, y, w, barH);

//         //text
//         ////goal
//         ctx.font = '2.5rem Odibee Sans';
//         ctx.fillStyle = 'black';

//         ctx.textAlign = 'end';
//         ctx.fillText(
//             '/' + goal,
//             w,
//             y + .775*barH
//         );

//         ////label
//         ctx.font = 'italic 2rem Odibee Sans';
//         ctx.textAlign = 'start';
//         ctx.fillText(
//             label + ':',
//             0,
//             y - .1125*barH,
//         );

//         //filled bars
//         ctx.fillStyle = keyToColor[key];
//         ctx.fillRect(0, y, prog*t, barH);
//         //arc
//         ctx.beginPath();
//         ctx.arc(
//             prog*t -.5,
//             y + 0.5*barH,
//             0.5*barH,
//             1.5*Math.PI,
//             0.5*Math.PI
//         );
//         ctx.fill();

//         //outline
//         let strokeColor = counter < goal*.9 ? 'white'
//             : counter >= goal*.9 && counter <= goal*1.1 ? 'green'
//             : 'black';
//         ctx.strokeStyle = strokeColor;
//         ctx.lineWidth = 2;
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(prog*t, y);
//         ctx.arc(
//             prog*t,
//             y + 0.5*barH,
//             0.5*barH,
//             1.5*Math.PI,
//             0.5*Math.PI
//         );
//         ctx.lineTo(0, y + barH);
//         ctx.stroke();

//         //text
//         ////progress
//         ctx.font = '2.5rem Odibee Sans';
//         ctx.fillStyle = 'black';

//         ctx.textAlign = 'end';
//         ctx.fillText(
//             counter,
//             t*prog + .375*barH,
//             y + .775*barH
//         );
//     };
//     //target line
//     ctx.strokeStyle = 'hsla(0, 0%, 0%, 0.5)';
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     ctx.moveTo(t + 0.5*barH, 0);
//     ctx.lineTo(t + 0.5*barH, h);
//     ctx.stroke();
    
//     //animation
//     if (addOrRemove) {
//         // console.log('hey')
//         if (startObj.kcal < endObj.kcal) {
//             console.log('kcal')
//             // console.log(startObj, endObj, addOrRemove)
//             startObj.kcal += 10;
//             // console.log(startObj, endObj, addOrRemove)
//             requestAnimationFrame(drawGraph(startObj, endObj, addOrRemove));
//         } else if (startObj.fat < endObj.fat) {
//             console.log('fat')
//             startObj.fat ++;
//             requestAnimationFrame(drawGraph(startObj, endObj, addOrRemove));
//         }  else if (startObj.carb < endObj.carb) {
//             console.log('carb')
//             startObj.carb ++;
//             requestAnimationFrame(drawGraph(startObj, endObj, addOrRemove));
//         }  else if (startObj.protein < endObj.protein) {
//             console.log('protein')
//             startObj.protein ++;
//             requestAnimationFrame(drawGraph(startObj, endObj, addOrRemove)); 
//         } else {
//             console.log('meep');
//             // return;
//         };

//     }

// };
