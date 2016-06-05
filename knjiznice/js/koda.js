
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
  ehrId = "";
  sessionId = getSessionId();
  
  $.ajaxSetup({
        headers: {"Ehr-Session": sessionId}
    });
    $.ajax({
        url: baseUrl + "/ehr",
        type: 'POST',
        success: function (data) {
            var ehrId = data.ehrId;



            if (stPacienta==1) {
            var partyData = {
                firstNames: 'Janez',
                lastNames: 'Novak',
                dateOfBirth: "1972-4-22T12:22",
                partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
            };
            }
            else if (stPacienta==2) {
             var partyData = {
                firstNames: 'Tina',
                lastNames: 'Maze',
                dateOfBirth: "1982-7-19T19:00",
                partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
            };  
            }
            else 
            {
              var partyData = {
                firstNames: 'Luka',
                lastNames: 'Skoraj',
                dateOfBirth: "1990-12-1T23:59",
                partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
            }; 

            }







            $.ajax({
                url: baseUrl + "/demographics/party",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(partyData),
                success: function (party) {
                    if (party.action == 'CREATE') {
                        $("#sporocilo").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreirani podatki</span>");
                        $('#izberiBolnika').append('<option value='+ ehrId +'>'+partyData.firstNames+' '+ partyData.lastNames+'</option>');

                        if (stPacienta==1) {
                          dodajMeritveVitalnihZnakov(1,ehrId);
                        }
                        else if (stPacienta==2) {
                          setTimeout(function() {dodajMeritveVitalnihZnakov(2,ehrId)}, 200);
                        }
                        else
                        {
                          setTimeout(function() {dodajMeritveVitalnihZnakov(3,ehrId)}, 500);
                        }

                    }
                },
                error: function(err) {
                  $("#sporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
                }
            });
        }
    });


}

function dodajMeritveVitalnihZnakov(stpacienta, ehr) {
  sessionId = getSessionId();
 

  

  var ehrId = ehr;



  if (stpacienta==1) {

    var podatki = {
        // Struktura predloge je na voljo na naslednjem spletnem naslovu:
        // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
          "ctx/language": "en",
          "ctx/territory": "SI",
          "vital_signs/height_length/any_event/body_height_length": 173,
          "vital_signs/body_weight/any_event/body_weight": 90.00,
          "vital_signs/body_temperature/any_event/temperature|magnitude": 36.7,
          "vital_signs/body_temperature/any_event/temperature|unit": "°C",
          "vital_signs/blood_pressure/any_event/systolic": 122,
          "vital_signs/blood_pressure/any_event/diastolic": 88,
          "vital_signs/indirect_oximetry:0/spo2|numerator": 95
      };
      var parametriZahteve = {
          ehrId: ehrId,
          templateId: 'Vital Signs',
          format: 'FLAT',
          committer: 'Sestra Ivanka'
      };
   }
   else if (stpacienta==2){
    var podatki = {
        // Struktura predloge je na voljo na naslednjem spletnem naslovu:
        // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
          "ctx/language": "en",
          "ctx/territory": "SI",
          "vital_signs/height_length/any_event/body_height_length": 179,
          "vital_signs/body_weight/any_event/body_weight": 72.00,
          "vital_signs/body_temperature/any_event/temperature|magnitude": 36.5,
          "vital_signs/body_temperature/any_event/temperature|unit": "°C",
          "vital_signs/blood_pressure/any_event/systolic": 130,
          "vital_signs/blood_pressure/any_event/diastolic": 95,
          "vital_signs/indirect_oximetry:0/spo2|numerator": 98
      };
      var parametriZahteve = {
          ehrId: ehrId,
          templateId: 'Vital Signs',
          format: 'FLAT',
          committer: 'Sestra Ana'
      };
   }
   else  {
    var podatki = {
        // Struktura predloge je na voljo na naslednjem spletnem naslovu:
        // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
          "ctx/language": "en",
          "ctx/territory": "SI",
          "vital_signs/height_length/any_event/body_height_length": 190,
          "vital_signs/body_weight/any_event/body_weight": 110.00,
          "vital_signs/body_temperature/any_event/temperature|magnitude": 37.5,
          "vital_signs/body_temperature/any_event/temperature|unit": "°C",
          "vital_signs/blood_pressure/any_event/systolic": 150,
          "vital_signs/blood_pressure/any_event/diastolic": 110,
          "vital_signs/indirect_oximetry:0/spo2|numerator": 90
      };
      var parametriZahteve = {
          ehrId: ehrId,
          templateId: 'Vital Signs',
          format: 'FLAT',
          committer: 'Doktor Rudi'
      };

   }






    $.ajax({
        url: baseUrl + "/composition?" + $.param(parametriZahteve),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(podatki),
        success: function (res) {
           
        },
        error: function(err) {
          
        }
    }); 


    
  }
  
  function getAgeInYears(dateOfBirth) {

        var dob = new Date(dateOfBirth);

        var timeDiff = Math.abs(Date.now() - dob.getTime());

        return Math.floor(timeDiff / (1000 * 3600 * 24 * 365));
  }
  

function napolniTabelo(ehr) {
  sessionId = getSessionId();
  var ehrId = ehr;

   function osnovniPodatki() {
        return $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (data) {
                var party = data.party;

                $('#VitalniEhr').val(ehrId);
                $("#ime").val(party.firstNames);
                $('#priimek').val(party.lastNames);

                // Complete age
                
               
                 var star = getAgeInYears(party.dateOfBirth);

                $("#starost").val(star + ' let');

                sgraf.update(star);
                
            }
        });
    }

  function teza() {
        return $.ajax({
            url: baseUrl + "/view/" + ehrId + "/weight",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (res) {
                // display newest
                $('#TelesnaTeza').val(res[0].weight);
                
            }
        });
    }
  function visina() {
        return $.ajax({
            url: baseUrl + "/view/" + ehrId + "/height",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (res) {
                // display newest
                $('#TelesnaVisina').val(res[0].height);

                

               

                
            }
        });
    }
  function temperatura() {
        return $.ajax({
            url: baseUrl + "/view/" + ehrId + "/body_temperature",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (res) {
                // display newest
                $('#TelesnaTemperatura').val(res[0].temperature);
              
                

               

                
            }
        });
    }
  function tlak() {
        return $.ajax({
            url: baseUrl + "/view/" + ehrId + "/blood_pressure",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (res) {
                // display newest
                $('#KrvniTlakDiastolicni').val(res[0].diastolic);
                $('#KrvniTlakSistolicni').val(res[0].systolic);
              

                

               

                
            }
        });
    }
  function nasicenost() {
        return $.ajax({
            url: baseUrl + "/view/" + ehrId + "/spO2",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (res) {
                // display newest
                $('#NasicenostKrviSKisikom').val(res[0].spO2);
                

                

               

                
            }
        });
    }
    osnovniPodatki();
    teza();
    visina();
    tlak();
    nasicenost();
    temperatura();


}

// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
function spremeniPodatke(ehr) {
  sessionId = getSessionId();
  var visina = $('#TelesnaVisina').val();
  var teza = $('#TelesnaTeza').val();
  var temperatura =$('#TelesnaTemperatura').val();
  var sistolicni = $('#KrvniTlakSistolicni').val();
  var diastolicni= $('#KrvniTlakDiastolicni').val();
  var nasicenost = $('#NasicenostKrviSKisikom').val();
  var ehrId = ehr;
  sgraf.update(parseInt(teza));

  var podatki = {
        // Struktura predloge je na voljo na naslednjem spletnem naslovu:
        // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
          "ctx/language": "en",
          "ctx/territory": "SI",
          "vital_signs/height_length/any_event/body_height_length": visina,
          "vital_signs/body_weight/any_event/body_weight": teza,
          "vital_signs/body_temperature/any_event/temperature|magnitude": temperatura,
          "vital_signs/body_temperature/any_event/temperature|unit": "°C",
          "vital_signs/blood_pressure/any_event/systolic": sistolicni,
          "vital_signs/blood_pressure/any_event/diastolic": diastolicni,
          "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenost
      };
      var parametriZahteve = {
          ehrId: ehrId,
          templateId: 'Vital Signs',
          format: 'FLAT',
          committer: 'Bolnik'
      };

      $.ajax({
        url: baseUrl + "/composition?" + $.param(parametriZahteve),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(podatki),
        success: function (res) {
           
        },
        error: function(err) {
          
        }
    }); 
     

}


$(function() {
      // mouse-on example
      var mouseOnDiv = $('#visina input');
      var tipContent = $(
        '<p><b>Telesna višina</b></p>' +
        '<p><a href="https://www.google.si/search?q=vi%C5%A1ina&oq=vi%C5%A1ina&aqs=chrome..69i57j0l5.1148j0j7&sourceid=chrome&ie=UTF-8#q=telesna+vi%C5%A1ina">Telesna višina predstavlja razdaljo </p>od vrha glave pa do pet.</a></p>'
      );
      mouseOnDiv.data('powertipjq', tipContent);
      mouseOnDiv.powerTip({
        placement: 'w',
        mouseOnToPopup: true
      });
    });
$(function() {
      // mouse-on example
      var mouseOnDiv = $('#teza input');
      var tipContent = $(
        '<p><b>Telesna teža</b></p>' +
        '<p><a href="https://www.google.si/search?q=vi%C5%A1ina&oq=vi%C5%A1ina&aqs=chrome..69i57j0l5.1148j0j7&sourceid=chrome&ie=UTF-8#q=telesna+te%C5%BEa">Telesna teža predstavlja maso posameznika </p>in glede na višino odraža tudi </p>kvaliteto prehranjevanja.</a></p>'
      );
      mouseOnDiv.data('powertipjq', tipContent);
      mouseOnDiv.powerTip({
        placement: 'w',
        mouseOnToPopup: true
      });
    });
$(function() {
      // mouse-on example
      var mouseOnDiv = $('#temperatura input');
      var tipContent = $(
        '<p><b>Telesna temperatura</b></p>' +
        '<p><a href="https://www.google.si/search?q=vi%C5%A1ina&oq=vi%C5%A1ina&aqs=chrome..69i57j0l5.1148j0j7&sourceid=chrome&ie=UTF-8#q=telesna+temperatura">Če telesna temperatura presega </p>37 stopinj celzija, je previsoka </p>in je potrebno mirovati.</a></p>'
      );
      mouseOnDiv.data('powertipjq', tipContent);
      mouseOnDiv.powerTip({
        placement: 'w',
        mouseOnToPopup: true
      });
    });
$(function() {
      // mouse-on example
      var mouseOnDiv = $('#sistolicni input');
      var tipContent = $(
        '<p><b>Sistolični tlak</b></p>' +
        '<p><a href="https://www.google.si/search?q=vi%C5%A1ina&oq=vi%C5%A1ina&aqs=chrome..69i57j0l5.1148j0j7&sourceid=chrome&ie=UTF-8#q=Sistoli%C4%8Dni+tlak">Sistolični tlak je tlak v </p>arterijah med srčnim utripom, ko </p>se srce skrči in iztisne </p>kri v ožilje.</a></p>'
      );
      mouseOnDiv.data('powertipjq', tipContent);
      mouseOnDiv.powerTip({
        placement: 'w',
        mouseOnToPopup: true
      });
    });
$(function() {
      // mouse-on example
      var mouseOnDiv = $('#diastolicni input');
      var tipContent = $(
        '<p><b>Diastolični tlak</b></p>' +
        '<p><a href="https://www.google.si/search?q=vi%C5%A1ina&oq=vi%C5%A1ina&aqs=chrome..69i57j0l5.1148j0j7&sourceid=chrome&ie=UTF-8#q=Diastoli%C4%8Dni+tlak">Diastolični tlak je tlak v </p>arterijah med dvema utripoma, v </p>času relaksacije srca.</a></p>'
      );
      mouseOnDiv.data('powertipjq', tipContent);
      mouseOnDiv.powerTip({
        placement: 'w',
        mouseOnToPopup: true
      });
    });
$(function() {
      // mouse-on example
      var mouseOnDiv = $('#nasicenost input');
      var tipContent = $(
        '<p><b>Nasičenost krvi s kisikom</b></p>' +
        '<p><a href="https://www.google.si/search?q=vi%C5%A1ina&oq=vi%C5%A1ina&aqs=chrome..69i57j0l5.1148j0j7&sourceid=chrome&ie=UTF-8#q=nasi%C4%8Denost+krvi+s+kisikom">Nam pove, ali je v </p>krvi dovolj kisika ali ne.</a></p>'
      );
      mouseOnDiv.data('powertipjq', tipContent);
      mouseOnDiv.powerTip({
        placement: 'w',
        mouseOnToPopup: true
      });
    });



var config = {
  diameter: 50,
  max: 200,
  round: false,
  series: [{
    value: 0,
    color: ['#00FCFF','#FF0022']
  }],
   center: function (d) {
      return d.toFixed(0) + ' let'
    }

}


var sgraf = new RadialProgressChart('#graf', config);

var config2 = {
  diameter: 50,
  max: 200,
  round: false,
  series: [{
    value: 0,
    color: ['#00FCFF','#FF0022']
  }],
    center: function (d) {
      return d.toFixed(0) + ' let'
    }
}
var sgraf2 = new RadialProgressChart('#graf2', config2);


function pridobiPodatke() {

  $.ajax({
      type: 'GET',
      url: 'http://zk1148.github.io/eZdravje/podatki.json',
      crossDomain: true,
      cache: false,
      success: function(data) {
        
        
        starost = parseInt(data.fact[24].Value);
        
         sgraf2.update(starost);
         
         
        }

      
    });
 
}


pridobiPodatke();



    
