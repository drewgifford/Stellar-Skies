$(document).ready(function(){
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

    function initializeSlider(id, divideBy, func){
        $(id).on("input", function(){
            var val = $(this).val();
            if(divideBy && (divideBy != 0)){
                val = val / divideBy;
            }
            func(val);
            

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
    function initializeColorPicker(id, rgbInput, targetMesh){
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
    
              targetMesh.material.color = new THREE.Color(color.hexString);
    
              
            }
          });
          $("."+rgbInput).change(function(){
              console.log("Fired!")
              var r = $("#"+rgbInput+"R").val()
              var g = $("#"+rgbInput+"G").val();
              var b = $("#"+rgbInput+"B").val();
                targetMesh.material.color = new THREE.Color("rgb("+r+","+g+","+b+")");
          });   
    }
    initializeColorPicker("#planetColorPicker", "planetColor", mesh);
    initializeColorPicker("#atmosphereColorPicker", "atmosphereColor", atmosphereMesh);

    initializeSlider("#planetRoughness", 1000, function(val){
        mesh.material.displacementScale = val;
    });
    initializeSlider("#planetContour", 300, function(val){
        mesh.material.bumpScale = val;
    });
    initializeSlider("#planetReflectiveness", 60, function(val){
        mesh.material.shininess = val;
    });
    initializeSlider("#planetSize", 400, function(val){
        mesh.scale.x = val;
        mesh.scale.y = val;
        mesh.scale.z = val;
        atmosphereMesh.scale.x = val*(1+atmosphereDepth);
        atmosphereMesh.scale.y = val*(1+atmosphereDepth);
        atmosphereMesh.scale.z = val*(1+atmosphereDepth);
    });

    initializeSlider("#atmosphereDepth", 900, function(val){
        atmosphereDepth = val;
        atmosphereMesh.scale.x = mesh.scale.x*(1+atmosphereDepth);
        atmosphereMesh.scale.y = mesh.scale.y*(1+atmosphereDepth);
        atmosphereMesh.scale.z = mesh.scale.z*(1+atmosphereDepth);
    });
    initializeSlider("#atmosphereOpacity", 300, function(val){
        atmosphereMesh.material.opacity = val;
    });
    initializeSlider("#atmosphereSpeed", 30000, function(val){
        atmosphereSpeed = val;
    });
    initializeSlider("#planetSpeed", 30000, function(val){
        surfaceSpeed = val;
    });
    initializeSlider("#atmosphereAura", 300, function(val){
        bloomPass.strength = val;
    });

    initializeFileUpload("#atmosphereImg", function(val){
        var texture = new THREE.TextureLoader().load(val);
        atmosphereMesh.material.map = texture;
    });

    initializeFileUpload("#planetTerrain", function(val){
        var texture = new THREE.TextureLoader().load(val);
        mesh.material.displacementMap = texture;
        mesh.material.bumpMap = texture;
    });
    initializeFileUpload("#planetImg", function(val){
        var texture = new THREE.TextureLoader().load(val);
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
    });

    

























});