Feature: Feature name

    Feature Description
    Scenario: Scenario name
    Given Abro la pagina "google"
    And Leo los datos de "google"
    And Lleno el campo "Barra Buscar" con "hola"
    And Hago click en "Sobre Google"

    
    @prueba
    Scenario: Prueba ale
    Given Abro la pagina "spotify"
    And Leo los datos de "spotify"
    And I set elemento "Email" con texto "hola@probando.com"
    And I set elemento "Confirma email" con texto "hola@probando.com"
    And I set elemento "Password" con texto "holahola1234"
    And I set elemento "Nombre" con texto "Ale-testing"
    And I set elemento "Dia" con texto "14"
    And Selecciono dropdown "Mes" con opcion "Abril"
    And I set elemento "Year" con texto "1910"
    And Scrolleo hasta el elemento "Registrarse"
    And I click on element "Registrarse"
    And Scrolleo hasta el elemento "Error sexo"
    Then verifico que el elemento "Error sexo" incluya el texto "Selecciona tu sexo"
    And activo checkbox "Hombre"
    And desactivo checkbox ""
    
    Scenario: prueba
    Given hago una prueba
    
    Scenario: hola
    * acepto alerta ""
    * cancelo alerta ""