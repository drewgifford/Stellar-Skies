

var camera, 
    scene, 
    renderer,
    geometry,
    material,
    mesh,
    controls,
    composer,
    planetMesh,
    atmosphereMesh,
    bloomStrength,
    bloomPass; 
var 
    planetName,
    planetDescription,
    planetAuthor,
    publishDate,
    planetTerrainImg,
    planetImg,
    planetColor,
    planetSize,
    planetRoughness,
    planetContour,
    planetReflectiveness,
    planetSpeed,
    atmosphereColor,
    atmosphereDepth,
    atmosphereOpacity,
    atmosphereSpeed,
    atmosphereAura,
    atmosphereImg;


planetName = "Earth";
planetDescription = "A planet";
planetAuthor = "Toadally";
publishDate = Date.now();
planetColor = "#ffffff";
planetTerrainImg ="https://miro.medium.com/max/4092/1*-vO6vIHeE67CAm6Mk3AcSA.png";
planetImg = "https://miro.medium.com/max/4092/1*-vO6vIHeE67CAm6Mk3AcSA.png";
planetColor = "#ffffff";
planetSize = 100;
planetRoughness = 0;
planetContour = 0;
planetReflectiveness = 0;
planetSpeed = 25;
atmosphereColor = "#ffffff";
atmosphereDepth = 25;
atmosphereOpacity = 50;
atmosphereSpeed = 10;
atmosphereAura = 50;
atmosphereImg = "https://i.imgur.com/MUWqhvj.png";
$(document).ready(function(){
    initSlider("#planetSize", planetSize);
    initSlider("#planetRoughness", planetRoughness);
    initSlider("#planetContour", planetContour);
    initSlider("#planetReflectiveness", planetReflectiveness);
    initSlider("#planetSpeed", planetSpeed);
    initSlider("#atmosphereDepth", atmosphereDepth);
    initSlider("#atmosphereOpacity", atmosphereDepth);
    initSlider("#atmosphereSpeed", atmosphereSpeed);
    initSlider("#atmosphereAura", atmosphereAura);
    
    $("#planetImgPreview").attr("src", planetImg);
    $("#planetTerrainPreview").attr("src", planetTerrainImg);
    $("#atmosphereImgPreview").attr("src", atmosphereImg);

    function initSlider(id, val){
        $(id).val(val);
        $(id+"Indicator").html(val+"%");
    }
});