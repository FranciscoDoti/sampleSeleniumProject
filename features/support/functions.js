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

    try{
        var elemento = await driver.wait(until.elementLocated(By.xpath(json[element].Valor)), 2500, 500, 8000);
    }catch(error){
        errorTrace = error;
        if (error.name === 'TimeoutError') {
            await log.error('No se pudo localizar al elemento ' + element+ ' porque hubo un error de timeOut');
        } else if(error.name === 'InvalidSelectorError'){
            await log.error('No se pudo localizar al elemento: '+element+' porque hubo un error en el localizador del elemento');
            await log.error(error);
        }else if(error.message == "Cannot read property 'Valor' of undefined"){
            await log.error('No se pudo localizar al elemento: '+element+' porque no se pudo encontrar el valor en el json');
        }
    }
    if(elemento == undefined){
        await driver.sleep(2500);
        var elemento = await driver.findElement(By.xpath(json[element].Valor));
        log.info('Se pudo cargar el elemento por findElement')
    }
    await driver.sleep(500);
    return elemento;
}


module.exports = {
    clickElement,
    llenarCampo,
    searchElement
}