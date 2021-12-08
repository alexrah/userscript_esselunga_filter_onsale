// ==UserScript==
// @name         Esselunga Filtra Offerte
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  aggiungi 2 bottoni per filtrare le offerte
// @author       Alessandro Stoppato
// @match        https://www.esselungaacasa.it/*
// @icon         https://www.google.com/s2/favicons?domain=esselungaacasa.it
// @grant        none
// @noframes
// ==/UserScript==

// choose sort by price
// add button to activate scroll
// add button to stop scroll
// select all product elements
// remove product if no .sconti


(function() {
    'use strict';

class Esselunga{

    constructor(){
        console.log('%cEsselunga filter: Initializing','color: yellow');
        setTimeout(()=>{
            this.container = document.querySelector('.n-prodotti');
            if(this.container === null) {
                console.log('%cEsselunga filter: Not a product page, exiting...','color: purple');
                return;
            }
            console.log('%cEsselunga filter: Starting','color: green');
            this.sortForm = this.container.querySelector('#sortProductSet');
            this.sortForm.addEventListener('change',this.loadAllProducts.bind(this));
            this.scrollHandle = 0;
            this.filterActive = false;
            this.createButton(this.createFilter.bind(this),'Offerte');
            this.createButton(this.resetFilter.bind(this),'X');
        },1000);
    }

    createFilter(){
        const self = this;
        if(!self.sortForm){
            alert('no search results here')
            return;
        }
        self.filterActive = true;
        self.sortForm.querySelector("[label='Prezzo crescente']").setAttribute('selected','selected');
        self.fireChange();
    }

    loadAllProducts() {
        const self = this;

        if(!self.filterActive) return;

        console.log('loadAllProducts');

        let prev_scroll = 0

        self.scrollHandle = setInterval(() => {
            // console.log('prev: ', prev_scroll);
            // console.log('current: ', document.body.scrollHeight);
            if (prev_scroll === document.body.scrollHeight) {
                self.stopScroll()
                self.filterOnSale()
            } else {
                prev_scroll = document.body.scrollHeight;
            }
            window.scrollTo(0, document.body.scrollHeight);
        }, 500);
    }

    stopScroll(){
        clearInterval(this.scrollHandle);
    }

    filterOnSale(){
        const allProducts = document.querySelectorAll('.infiniteScroll.grid > div');
        allProducts.forEach(prod => {
            let sconto = prod.querySelector('.sconti > img');
            if(!sconto){ prod.remove(); }
        });
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    createButton(action,label = ''){
        const buttonItem = document.createElement('button');

        buttonItem.textContent = label.length > 0?label:action.name;
        buttonItem.addEventListener('click',()=>{
            action();
        });
        this.container.appendChild(buttonItem);
    }

    resetFilter(){
        const self = this;
        self.sortForm.querySelectorAll('option').forEach(option => {
            option.removeAttribute('selected');
        });
        self.filterActive = false;
        self.fireChange();


    }

    fireChange(){
        const self = this;
        setTimeout(()=>{
            self.sortForm.dispatchEvent(new Event('change'));
        },1000)
    }


}

new Esselunga();
window.addEventListener('popstate',e => {
    new Esselunga();
})


})();
