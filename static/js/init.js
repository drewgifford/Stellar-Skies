

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

if (typeof jsonObj !== 'undefined') {
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
    atmosphereImg = "/static/img/cloud_map.png";
} else {
    planetName = jsonObj.planetName;
    planetName = jsonObj.planetDescription;
    planetName = jsonObj.planetAuthor;
    planetName = jsonObj.publishDate;
    planetName = jsonObj.planetColor;
    planetName = jsonObj.planetTerrainImg;
    planetName = jsonObj.planetImg;
    planetName = jsonObj.planetSize;
    planetName = jsonObj.planetRoughness;
    planetName = jsonObj.planetContour;
    planetName = jsonObj.planetReflectiveness;
    planetName = jsonObj.planetSpeed;
    planetName = jsonObj.atmosphereColor;
    planetName = jsonObj.atmosphereDepth;
    planetName = jsonObj.atmosphereSpeed;
    planetName = jsonObj.atmosphereAura;
    planetName = jsonObj.atmosphereImg;
}

$(document).ready(function(){
    $("#planetName").val(planetName);
    $("#planetDescription").val(planetName);
    $("#planetName").html(planetName);
    $("#planetDescription").html(planetName);
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