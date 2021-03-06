

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

if (jsonObj == null) {
    planetName = "My Planet";
    planetDescription = "";
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
    planetDescription = jsonObj.planetDescription;
    planetAuthor = jsonObj.planetAuthor;
    publishDate = jsonObj.publishDate;
    planetColor = jsonObj.planetColor;
    planetTerrainImg = jsonObj.planetTerrainImg;
    planetImg = jsonObj.planetImg;
    planetSize = parseInt(jsonObj.planetSize);
    planetRoughness = parseInt(jsonObj.planetRoughness);
    planetContour = parseInt(jsonObj.planetContour);
    planetReflectiveness = parseInt(jsonObj.planetReflectiveness);
    planetSpeed = parseInt(jsonObj.planetSpeed);
    atmosphereColor = jsonObj.atmosphereColor;
    atmosphereDepth = parseInt(jsonObj.atmosphereDepth);
    atmosphereSpeed = parseInt(jsonObj.atmosphereSpeed);
    atmosphereAura = parseInt(jsonObj.atmosphereAura);
    atmosphereImg = jsonObj.atmosphereImg;
    atmosphereOpacity = parseInt(jsonObj.atmosphereOpacity);

    document.title = "Stellar Skies - "+planetName;
}

$(document).ready(function(){
    $("#planetName").val(planetName);
    $("#planetDescription").val(planetDescription);
    $("#planetName").html(planetName);
    $("#planetDescription").html(planetDescription);
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