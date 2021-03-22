const { assert } = require('chai');
const { Given, And, When, Then } = require('cucumber');
const { clickElement , llenarCampo, searchElement, getInt } = require('../support/functions');
const { log } = require(`${process.cwd()}/logger`);
const urls  = require(`${process.cwd()}/urls.json`);
require(`${process.cwd()}/features/support/functions.js`);
const { getDriver } = require(`${process.cwd()}/driver.js`);
var driver = getDriver();
const { By, Key, until } = require('selenium-webdriver');

Given('hago una prueba', async function(){

    await driver.get('https://www.youtube.com/');
    await driver.manage().window().maximize();
    await driver.sleep(5000);
    var elemeto = await driver.findElements(By.xpath('//yt-formatted-string[@id="video-title"]'));
    for(var i=0; i<=5; i++){

        var numer = await getInt(elemeto[i]);
        console.log(numer);
    }

})

Given(/^Abro la pagina "(.*)"$/, async function (web) {

    try {
        await this.driver.get(urls[this.env[web]][web]);
        await log.info ('Ejecutando la prueba en el ambiente: '+ this.env[web]);
        await log.info('abriendo la pagina: ' + urls[this.env[web]][web]) ;
        
    } catch (error) {
        if (error.message.includes("ERR_CONNECTION_TIMED_OUT")){
            await log.error("Error de timeout al intentar abrir la página");
            
        }else{
            await log.error('No se pudo abrir la página. Revisar los archivos urls y config');
        }
        await log.error(error);
        await process.exit();
    }
    await driver.manage().window().maximize();
    await driver.sleep(5000);
});

Given(/^Leo los datos de "(.*)"$/ , async function(json){
     this.page = require(`${process.cwd()}/features/pages/${json}.json`);
});

Given(/^Hago click en "(.*)"$/ , async function(elementKey){
    await clickElement( this.page , elementKey);
});

Given(/^Lleno el campo "(.*)" con "(.*)"$/ , async function(elementKey, texto){
    await llenarCampo( this.page , elementKey, texto);
});

When(/^I set elemento "(.*)" con texto "(.*)"$/, async function(elementKey, text){

    var elemento = await searchElement( this.page , elementKey);
    await elemento.sendKeys(text);


})

When(/^Scrolleo hasta el elemento "(.*)"$/, async function(elementKey){

var elemento = await searchElement(this.page, elementKey);
await driver.sleep(2500);
await driver.executeScript("arguments[0].scrollIntoView(true)", elemento)
await driver.sleep(1500);
})

When(/^Selecciono dropdown "(.*)" con opcion "(.*)"$/, async function(elementKey, option){

    var elemento = await searchElement(this.page, elementKey);
    await elemento.sendKeys(option);
    await driver.sleep(500);
});


Then(/^verifico que el elemento "(.*)" incluya el texto "(.*)"$/, async function(elementKey, text){

    var elemento = await searchElement(this.page, elementKey);
    var verificacion = await elemento.getText();
    await assert(verificacion.includes(text), 'se busco que: '+elementKey+' incluya el texto: '+text+' pero ocurrio un error y se encontró: '+verificacion)
});

When(/^I click on element "(.*)"$/, async function(elementKey){
    var elemento = await searchElement(this.page, elementKey);
    await elemento.click();
    log.info('se realizo un click sobre el elemento: '+elementKey);
})

When(/^activo checkbox "(.*)"$/, async function (elementKey){

    var elemento = await searchElement(this.page, elementKey);
    var activo = await elemento.isSelected();
    if(activo == true){

    }else{
        await elemento.click();
    }
    await driver.sleep(1000);
    var verificar = await elemento.isSelected();
    if(activo == true){
        log.info('el elemento: '+elementKey+' ahora se encuentra activado');
    }else{
        await elemento.click();
        log.info('el elemento: '+elementKey+' ahora se encuentra activado');
    }

});

When(/^desactivo checkbox "(.*)"$/, async function(elementKey){
    try{
        var elemento = await searchElement(this.page, elementKey);
    }catch{
        log.error('no se pudo encontrar el elemento');
    }
    var activo = await elemento.isSelected();
    if(activo == false){

    }else{
        await elemento.click();
    } 
    var verifico = await elemento.isSelected();
    if(activo == false){
        log.info('el elemento: '+elementKey+' ahora se encuentra desactivado');
    }else{
        await elemento.click();
        log.info('el elemento: '+elementKey+' ahora se encuentra desactivado');
    } 
});















