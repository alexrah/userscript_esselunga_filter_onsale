// ==UserScript==
// @name         Esselunga Filtra Offerte
// @namespace    http://tampermonkey.net/
// @version      3.0
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

        this.container = document.querySelector('.n-prodotti');
        this.sortForm = document.getElementById('sortProductSet');
        this.scrollHandle = 0;
        this.createButton(this.createFilter.bind(this),'Offerte');
        this.createButton(this.resetFilter.bind(this),'X');

    }

    createFilter(){
        const self = this;

        if(!self.sortForm){
            alert('no search results here')
            return;
        }

        self.sortForm.addEventListener('change',self.loadAllProducts.bind(self));

        self.sortList();


    }

    loadAllProducts() {
        const self = this;

        console.log('loadAllProducts');

        let prev_scroll = 0

        self.scrollHandle = setInterval(() => {
            console.log('prev: ', prev_scroll);
            console.log('current: ', document.body.scrollHeight);
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
        self.sortForm.removeEventListener('change',self.loadAllProducts);
        self.sortList();


    }

    sortList(){
        const self = this;
        self.sortForm.querySelector("[label='Prezzo crescente']").setAttribute('selected','selected');
        const event = new Event('change');
        setTimeout(()=>{
            self.sortForm.dispatchEvent(event);
        },1000)
    }


}

new Esselunga();
window.addEventListener('popstate',e => {
    new Esselunga();
})


})();
