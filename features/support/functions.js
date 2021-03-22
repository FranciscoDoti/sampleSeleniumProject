const { getDriver } = require(`${process.cwd()}/driver.js`);
var driver = getDriver();
const { assert } = require('chai');
const { By, Key, until } = require('selenium-webdriver');
const { ExceptionHandler, exceptions } = require('winston');
const { log } = require(`${process.cwd()}/logger`);
const cantReintentos = 5;

async function clickElement(json, element) {

    var elementoEncontrado = false;
    var nroReintento = 1;
    var errorTrace;

    while ((!elementoEncontrado) && (nroReintento <= cantReintentos)) {

        try {
            await log.info('Localizando elemento: ' + element);
            var webElement = await driver.wait(until.elementLocated(By.xpath(json[element].valor)), 5000, 5000, 5000);
            await webElement.click();
            await log.info('Se hizo click en el elemento '+ element);
            elementoEncontrado = true;

        } catch (error) {
            errorTrace = error;
            if (error.name === 'TimeoutError') {
                await log.error('No se pudo localizar al elemento ' + element);
                await log.info('Número de intento ' + nroReintento);
            } else {
                await log.error(error);
            }
            
            nroReintento++;
        }

    }
    if (!elementoEncontrado){
        switch (errorTrace.name) {
            case 'TimeoutError':
                await assert.fail( ' no se pudo localizar al elemento ' + element + '. Error: ' + errorTrace + 
                                    '. REVISAR EL LOCATOR'            
                );
                break;
        
            default:
                await assert.fail('No se pudo hacer click al elemento ' + element +'. Error: ' +errorTrace);
                break;
        }

    }


}


async function llenarCampo(json, element, texto) {


    var elementoEncontrado = false;
    var nroReintento= 1;
    var errorTrace ;

    while ((!elementoEncontrado) && (nroReintento <= cantReintentos)) {

        try {
            await log.info('Localizando elemento: ' + element);
            var webElement = await driver.wait(until.elementLocated(By.xpath(json[element].valor)), 5000, 5000, 5000);
            await webElement.sendKeys(texto);
            await log.info('Se escribió el texto ' + texto + ' en el elemento '+ element);
            elementoEncontrado = true;

        } catch (error) {
            errorTrace = error;
            if (error.name === 'TimeoutError') {
                await log.error('No se pudo localizar al elemento ' + element);
                await log.info('Número de intento ' + nroReintento);
                
            } else {
                await log.error(error);
            }
            
            nroReintento++;
        }
    }

    if (!elementoEncontrado){
        switch (errorTrace.name) {
            case 'TimeoutError':
                await assert.fail( ' no se pudo localizar al elemento ' + element + '. Error: ' + errorTrace+
                            '. REVISAR EL LOCATOR'
                    );
                break;
        
            default:
                await assert.fail('No se pudo llenar los datos al elemento ' + element +'. Error: ' +errorTrace);
                break;
        }

    }


}

async function searchElement(json, element){
    var mistake = 0;
    for(var i=0; i<=3; i++){

        try{
            var elemento = await driver.wait(until.elementLocated(By.xpath(json[element].Valor)), 2500, 500, 8000);
            break;
        }catch(error){
            log.info('no se pudo encontrar el elemento. Intento numero: '+mistake);
            mistake++
            errorTrace = error;
            if (error.name === 'TimeoutError') {
                await log.error('No se pudo localizar al elemento ' + element+ ' porque hubo un error de timeOut');
            } else if(error.name === 'InvalidSelectorError'){
                await log.error('No se pudo localizar al elemento: '+element+' porque hubo un error en el localizador del elemento');
            }else if(error.message == "Cannot read property 'Valor' of undefined"){
                await log.error('No se pudo localizar al elemento: '+element+' porque no se pudo encontrar el valor en el json');
            }

    }
    }
    if(elemento == undefined){
        try{

            await driver.sleep(2500);
            var elemento = await driver.findElement(By.xpath(json[element].Valor));
            log.info('Se pudo cargar el elemento por findElement')
        }catch{
            log.error('El elemento no pudo ser encontrado. Revisar identificadores, localizadores, tiempo de carga o scrolleo');
        }
    }
    await driver.sleep(500);
    return elemento;
}

async function searchElements(json, element){
    var mistake = 0;
    for(var i=0; i<=3; i++){

        try{
            var elementos = await driver.wait(until.elementsLocated(By.xpath(json[element].Valor)), 2500, 500, 8000);
            break;
        }catch(error){
            log.info('no se pudo encontrar el elemento. Intento numero: '+mistake);
            mistake++
            errorTrace = error;
            if (error.name === 'TimeoutError') {
                await log.error('No se pudo localizar al elemento ' + element+ ' porque hubo un error de timeOut');
            } else if(error.name === 'InvalidSelectorError'){
                await log.error('No se pudo localizar al elemento: '+element+' porque hubo un error en el localizador del elemento');
            }else if(error.message == "Cannot read property 'Valor' of undefined"){
                await log.error('No se pudo localizar al elemento: '+element+' porque no se pudo encontrar el valor en el json');
            }

    }
    }
    if(elementos == undefined){
        try{

            await driver.sleep(2500);
            var elementos = await driver.findElements(By.xpath(json[element].Valor));
            log.info('Se pudo cargar el elemento por findElement')
        }catch{
            log.error('El elemento no pudo ser encontrado. Revisar identificadores, localizadores, tiempo de carga o scrolleo');
        }
    }
    await driver.sleep(500);
    return elementos;
}

async function getInt(webElement){
/*    var mistake = 0;
    for(var i=0; i<=3; i++){

        try{
            var elementos = await driver.wait(until.elementsLocated(By.xpath(json[element].Valor)), 2500, 500, 8000);
            break;
        }catch(error){
            log.info('no se pudo encontrar el elemento. Intento numero: '+mistake);
            mistake++
            errorTrace = error;
            if (error.name === 'TimeoutError') {
                await log.error('No se pudo localizar al elemento ' + element+ ' porque hubo un error de timeOut');
            } else if(error.name === 'InvalidSelectorError'){
                await log.error('No se pudo localizar al elemento: '+element+' porque hubo un error en el localizador del elemento');
            }else if(error.message == "Cannot read property 'Valor' of undefined"){
                await log.error('No se pudo localizar al elemento: '+element+' porque no se pudo encontrar el valor en el json');
            }

    }
    }*/
    var string = await webElement.getText();
    if(string.includes('-')){
        var negativString = await string.match(/\d+/g, '');
        var newString = await '-'+negativString;
    }else{
        var newString = await string.match(/\d+/g, '');
    }
    var result = parseFloat(newString);

    return result;
}

async function scrollToBottom(){
    try{

        await driver.sleep(1000);
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(1000);
    }catch{
        var mistake = true;
    }
    if(mistake == true){
        
        try{
            await actions.sendKeys(keys.END);
        }catch{
        log.error('se intento scrollear al final de la pagina sin exito');       
        }
    }
}

async function scrollToElement(json, element){

    var element = await searchElement(json, element);
    try{
        await driver.sleep(1000);
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(2000);
        await driver.executeScript("window.scrollTo(0, 0)");
    }catch{

    }
    try{
        await driver.executeScript("argumets[0].scrollIntoView(true)", element);
    }catch{}
}




module.exports = {
    clickElement,
    llenarCampo,
    searchElement,
    searchElements,
    getInt,
    scrollToBottom,
    scrollToElement
}