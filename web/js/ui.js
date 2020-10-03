$(document).ready(function(){

    $(".option").click(function(){


        if($(this).attr("id")==="optionSurface"){
            changePanel("mainOptions", "surfaceOptions");
            //Open Surface

        } else if($(this).attr("id")==="optionAtmosphere"){
            changePanel("mainOptions", "surfaceOptions");
            //Open Surface

        }



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
    initializeColorPicker("#picker", "planetColor", mesh);
    initializeSlider("#planetRoughness", 1000, function(val){
        mesh.material.displacementScale = val;
    });

    

























});