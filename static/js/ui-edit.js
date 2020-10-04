$(document).ready(function(){
    $('#planetDescription').on('keyup', function(){
        $(this).val($(this).val().replace(/[\r\n\v]+/g, ''));
        var e = $("#planetDescription").val().length+"/500";
        $("#planetDescriptionIndicator").html(e);
      });


      $('#planetDescription').on('keydown', function(){
        $(this).val($(this).val().replace(/[\r\n\v]+/g, ''));
        var e = $("#planetDescription").val().length+"/500";
        $("#planetDescriptionIndicator").html(e);
      });
    var currentPanel = "mainOptions";
    $(".option").click(function(){


        if($(this).attr("id")==="optionSurface"){
            changePanel("mainOptions", "surfaceOptions");
            currentPanel = "surfaceOptions";
            //Open Surface

        } else if($(this).attr("id")==="optionAtmosphere"){
            changePanel("mainOptions", "atmosphereOptions");
            currentPanel = "atmosphereOptions";

        }



    });
    $(".back").click(function(){
        changePanel(currentPanel, "mainOptions");
        currentPanel = "mainOptions";
    });

    function changePanel(before, after){
        $("#"+before).removeClass("visible");
        $("#"+after).addClass("visible");


    }

    function initializeSlider(id, func){
        $(id).on("input", function(){
            var val = $(this).val();
            func(val);
            $(id+"Indicator").html(val+"%");

        });
    }
    function initializeFileUpload(id, func){
        $(id).on("change", function(){
            var input = this;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                console.log(id);
                reader.onload = function (e) {
                    $(id+"Preview")
                        .attr('src', e.target.result);
                    func(e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
            }
        });
    }
    function initializeColorPicker(id, rgbInput, func){
        var colorPicker = new iro.ColorPicker(id, {
            width: 200,
            layout: [
                { 
                  component: iro.ui.Box,
                  options: {}
                },
                { 
                    component: iro.ui.Slider,
                    options: {
                      // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
                      sliderType: 'hue'
                    }
                  },
              ]
        });
    
    
        colorPicker.on('color:change', function(color) {
            // if the first color changed
            if (color.index === 0) {
              $("#"+rgbInput+"R").val(color.red);
              $("#"+rgbInput+"G").val(color.green);
              $("#"+rgbInput+"B").val(color.blue);
              func(color.hexString);
    
              
            }
          });
          $("."+rgbInput).change(function(){
              console.log("Fired!")
              var r = $("#"+rgbInput+"R").val()
              var g = $("#"+rgbInput+"G").val();
              var b = $("#"+rgbInput+"B").val();
              var rgb = "rgb("+r+","+g+","+b+")";
              colorPicker.color = rgb;
              func(rgb);
          });   
    }
    initializeColorPicker("#planetColorPicker", "planetColor", function(color){
        planetColor = color;
        planetMesh.material.color = new THREE.Color(color);
    });
    initializeColorPicker("#atmosphereColorPicker", "atmosphereColor", function(color){
        atmosphereColor = color;
        atmosphereMesh.material.color = new THREE.Color(color);
    });

    initializeSlider("#planetRoughness", function(val){
        planetRoughness = val;
        planetMesh.material.displacementScale = val/333;
    });
    initializeSlider("#planetContour", function(val){
        planetContour = val;
        planetMesh.material.bumpScale = val/100;
    });
    initializeSlider("#planetReflectiveness", function(val){
        planetReflectiveness = val;
        planetMesh.material.shininess = val/60;
    });
    initializeSlider("#planetSize", function(val){
        planetSize = val;

        planetMesh.scale.x = val/100;
        planetMesh.scale.y = val/100;
        planetMesh.scale.z = val/100;
        atmosphereMesh.scale.x = (val/100)*(1+(atmosphereDepth/300));
        atmosphereMesh.scale.y = (val/100)*(1+(atmosphereDepth/300));
        atmosphereMesh.scale.z = (val/100)*(1+(atmosphereDepth/300));
    });

    initializeSlider("#atmosphereDepth", function(val){
        atmosphereDepth = val;
        atmosphereMesh.scale.x = planetMesh.scale.x*(1+(atmosphereDepth/300));
        atmosphereMesh.scale.y = planetMesh.scale.y*(1+(atmosphereDepth/300));
        atmosphereMesh.scale.z = planetMesh.scale.z*(1+(atmosphereDepth/300));
    });
    initializeSlider("#atmosphereOpacity", function(val){
        atmosphereOpacity = val;
        atmosphereMesh.material.opacity = val/100;
    });
    initializeSlider("#atmosphereSpeed", function(val){
        atmosphereSpeed = val;
    });
    initializeSlider("#planetSpeed", function(val){
        planetSpeed = val;
    });
    initializeSlider("#atmosphereAura", function(val){
        atmosphereAura = val;
        bloomPass.strength = val/100;
    });

    initializeFileUpload("#atmosphereImg", function(val){
        atmosphereImg = val;
        var texture = new THREE.TextureLoader().load(val);
        atmosphereMesh.material.map = texture;
    });

    initializeFileUpload("#planetTerrain", function(val){
        planetTerrainImg = val;
        var texture = new THREE.TextureLoader().load(val);
        planetMesh.material.displacementMap = texture;
        planetMesh.material.bumpMap = texture;
    });
    initializeFileUpload("#planetImg", function(val){
        var texture = new THREE.TextureLoader().load(val);

        planetImg = val;
        planetMesh.material.map = texture;
        planetMesh.material.needsUpdate = true;
    });


    

























});