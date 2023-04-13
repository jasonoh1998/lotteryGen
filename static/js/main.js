import myJson from '../../data.json' assert {type: 'json'}
(function(){
    'use strict'
    $(document).ready(function(){
        $(".money").click(function(){
            $(this).fadeOut(800, function() {
                $(this).prop('hidden', true);
            });
        })
    })

    document.addEventListener('keydown', (e) => {
        if(e.key == "Enter"){ // Enter key
            document.getElementById("confirm").click()
        }
    })

    document.querySelector("#confirm").addEventListener("click", () =>{
        let first_name = document.getElementById('fname').value
        let last_name = document.getElementById('lname').value
        let birthday = document.getElementById('birthday').value
        
        if(first_name == "") changeToRed("fname-div", "fname", "fname-label", "first name")
        else changeToGreen("fname-div", "fname", "fname-label")
        if(last_name == "") changeToRed("lname-div", "lname", "lname-label", "last name")
        else changeToGreen("lname-div", "lname", "lname-label")
        if(birthday == "") changeToRed("birthday-div", "birthday", "birthday-label", "birthday")
        else changeToGreen("birthday-div", "birthday", "birthday-label")

        if(first_name != "" && last_name != "" && birthday != ""){
            content_create()
            let winningNumbers = getLottery(first_name, last_name, birthday)
            swap()
            spin(winningNumbers)
        }
    })

    document.querySelector("#redo").addEventListener("click", ()=> {
        document.getElementById('fname').value = ""
        document.getElementById('lname').value = ""
        document.getElementById('birthday').value = ""
        changeToOriginal("fname-div", "fname", "fname-label")
        changeToOriginal("lname-div", "lname", "lname-label")
        changeToOriginal("birthday-div", "birthday", "birthday-label")
        swap()
    })
    
    document.querySelector("#lotto645").addEventListener("click", ()=>{
        let powerball = $('#powerball')
        let lotto645 = $('#lotto645')
        powerball.removeClass('selected')
        lotto645.addClass('selected')
    })
    document.querySelector("#powerball").addEventListener("click", ()=>{
        let powerball = $('#powerball')
        let lotto645 = $('#lotto645')
        powerball.addClass('selected')
        lotto645.removeClass('selected')
    })
    
    
    async function spin(winningNumbers) {
        const lotto_circles = document.querySelectorAll(".lotto-circle");
        init(false, winningNumbers)

        for (const lotto_circle of lotto_circles) {            
            const lotto_content = lotto_circle.querySelector(".content")
            lotto_content.style.transform = 'translateY(0)' // this validates transform in css to start animation
            await new Promise((resolve) => setTimeout(resolve, 1000)) // make next circle animation start 1s after
        }
    }
})();

function content_create() {
    let lotto_type = document.querySelector(".selected").textContent
    $("#lotto-circles").empty()
    let child = '<div class="lotto-circle"><div class="content"></div></div>'
    let child_extra = '<div id="extra-number" class="lotto-circle"><div class="content"></div></div>'
    if(lotto_type == "PowerBall"){
        for(let i = 0; i < 6; i++){
            if(i!=5) $('#lotto-circles').append(child)
            else $('#lotto-circles').append(child_extra)
        }
    }
    else if(lotto_type == "Lotto 6/45"){
        for(let i = 0; i < 7; i++){
            if(i!=6) $('#lotto-circles').append(child)
            else $('#lotto-circles').append(child_extra)
        }
    }
}

function init(initialized = true, winningNumbers) {
    const lotto_circles = document.querySelectorAll(".lotto-circle")
    for (const [index, lotto_circle] of lotto_circles.entries()) {
        const circles = lotto_circle.querySelector(".content")
        const circlesClone = circles.cloneNode(false)

        const pool = ["🎊"];
        if(!initialized){
            const items = Array.from({length: winningNumbers[index]}, (_, i) => i + 1)
            pool.push(...items)
            for (let i = pool.length - 1; i >= 0; i--) {
                const in_circle = document.createElement("div")
                in_circle.classList.add("lotto")
                in_circle.style.width = lotto_circle.clientWidth + "px"
                in_circle.style.height = lotto_circle.clientHeight + "px"
                in_circle.textContent = pool[i]
                circlesClone.appendChild(in_circle)
            }
            circlesClone.addEventListener(
                "transitionstart",
                function () {
                    this.querySelectorAll(".lotto").forEach((lotto) => {
                        lotto.style.filter = "blur(.5vw)"
                    })
                }
            )
            circlesClone.addEventListener(
                "transitionend",
                function () {
                    this.querySelectorAll(".lotto").forEach((lotto, index) => {
                        lotto.style.filter = "blur(0)"
                        if (index > 0) this.removeChild(lotto)
                    })
                }
            )
        }
        circlesClone.style.transform = 
            `translateY(-${lotto_circle.clientHeight * (pool.length - 1)}px)`
        lotto_circle.replaceChild(circlesClone, circles)
    }
}

function swap(){
    let belowCard = $('.below')
    let aboveCard = $('.above')
    parent = $('.card-container')
    parent.addClass('animation-state-1')
    setTimeout(function(){
        belowCard.removeClass('below')
        aboveCard.removeClass('above')
        belowCard.addClass('above')
        aboveCard.addClass('below')
        setTimeout(function(){
            parent.addClass('animation-state-finish')
            parent.removeClass('animation-state-1')
            setTimeout(function(){
                aboveCard.addClass('turned')
                belowCard.removeClass('turned')
                parent.removeClass('animation-state-finish')
            }, 300)
        }, 10)
    }, 300)
}

function changeToOriginal(errorBox, border, label) {
    document.getElementById(errorBox).innerText = ""
    document.getElementById(border).style.border = "1px solid #ced4da"
    document.getElementById(label).style.color = "#198754"
}

function changeToRed(errorBox, border, label, name){
    document.getElementById(errorBox).innerText = "Please provide a name.".replace('name', name)
    document.getElementById(errorBox).style.color = "red"
    document.getElementById(border).style.borderColor = "red"
    document.getElementById(label).style.color = "red"
}

function changeToGreen(errorBox, border, label){
    document.getElementById(errorBox).innerText = "Looks great!"
    document.getElementById(errorBox).style.color = "#198754"
    document.getElementById(border).style.borderColor = "#198754"
    document.getElementById(label).style.color = "#198754"
}

function getLottery(f, l, b) {
    let lotto_type = document.querySelector(".selected").textContent
    let randomNums = []
    let luckyNumbers = []
    if(lotto_type == "PowerBall"){
        for (let i = 0; i < 10; i++)
            randomNums.push(Math.floor(Math.random()*69+1))
        luckyNumbers = [lifePathNumber(b)]
                        .concat(birthdayNumber(b), nameNumber(f, l), 
                                zodiacNumber(b), animalNumber(b), randomNums)
        
        luckyNumbers = [...new Set(luckyNumbers)]
        luckyNumbers = luckyNumbers.sort(() => 0.5 - Math.random())
        luckyNumbers = luckyNumbers.slice(0, 5)
        luckyNumbers = luckyNumbers.sort(function(a,b){return a - b}).concat([Math.floor(Math.random()*26+1)])
    }
    else if(lotto_type == "Lotto 6/45"){
        for (let i = 0; i < 10; i++)
            randomNums.push(Math.floor(Math.random()*45+1))
        luckyNumbers = [lifePathNumber(b)]
                        .concat(birthdayNumber(b), nameNumber(f, l), 
                                zodiacNumber(b), animalNumber(b), randomNums)
        
        luckyNumbers = [...new Set(luckyNumbers)]
        luckyNumbers = luckyNumbers.filter(function(x) {
            return x<46
        })
        luckyNumbers = luckyNumbers.sort(() => 0.5 - Math.random())
        luckyNumbers = luckyNumbers.slice(0, 6)
        luckyNumbers = luckyNumbers.sort(function(a,b){return a - b}).concat([Math.floor(Math.random()*45+1)])
    }
    return luckyNumbers
    // giveQuote(lifePathNumber(b))
}


function sumAllNumber(i){
    let number = 0
    while(true){
        number += i % 10
        i = Math.floor(i/10)
        if(i == 0) break
    }
    return number
}

function giveQuote(i) {
    return quotes[i]
}

function lifePathNumber(b) {
    let birthday = b.split('-')
    birthday = parseInt(birthday[0]) + parseInt(birthday[1]) + parseInt(birthday[2])
    let luckyNumber = sumAllNumber(birthday)
    return luckyNumber
}

function birthdayNumber(b){
    let birthday = parseInt(b.split('-').join(''))
    let luckyNumber = sumAllNumber(birthday)
    luckyNumber = sumAllNumber(luckyNumber)
    return myJson.numberDic[luckyNumber]
}

function nameNumber(f, l){
    let name = f.concat(l).toLowerCase()
    let luckyNumber = 0
    for(let i = 0; i < name.length; i++){
        for(let val in myJson.nameDic){
            if(myJson.nameDic[val].includes(name[i]))
                luckyNumber += parseInt(val)
        }
    }
    luckyNumber = sumAllNumber(luckyNumber)
    return myJson.dateDic[luckyNumber]
}

function zodiacNumber(b) {
    let birthday = b.split('-')
    let zodiac;
    let zodiacDic = {
        "Aries" : [new Date(birthday[0], 2, 21), new Date(birthday[0], 3, 19)],
        "Taurus" : [new Date(birthday[0], 3, 20), new Date(birthday[0], 4, 20)],
        "Gemini" : [new Date(birthday[0], 4, 21), new Date(birthday[0], 5, 21)],
        "Cancer" : [new Date(birthday[0], 5, 22), new Date(birthday[0], 6, 22)],
        "Leo" : [new Date(birthday[0], 6, 23), new Date(birthday[0], 7, 22)],
        "Virgo" : [new Date(birthday[0], 7, 23), new Date(birthday[0], 8, 22)],
        "Libra" : [new Date(birthday[0], 8, 23), new Date(birthday[0], 9, 23)],
        "Scorpio" : [new Date(birthday[0], 9, 24), new Date(birthday[0], 10, 21)],
        "Sagittarius" : [new Date(birthday[0], 10, 22), new Date(birthday[0], 11, 21)],
        "Capricorn" : [new Date(birthday[0], 11, 22), new Date(birthday[0], 0, 19)], // need seperate condition
        "Aquarius" : [new Date(birthday[0], 0, 20), new Date(birthday[0], 1, 18)],
        "Pisces" : [new Date(birthday[0], 1, 19), new Date(birthday[0], 2, 20)]
    }
    birthday = new Date(birthday[0], birthday[1]-1, birthday[2])
    for (let z in zodiacDic) {
        if(z=='Capricorn'){
            if(zodiacDic[z][0] <= birthday || zodiacDic[z][1] >= birthday) zodiac = z
        }else{
            if(zodiacDic[z][0] <= birthday && zodiacDic[z][1] >= birthday) zodiac = z
        }
    }
    return myJson.zodiacDateDic[zodiac]
}

function animalNumber(p){
    let birthday = parseInt(p.split('-')[0]) % 12
    return myJson.animalDic[birthday]
}
