


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

    init();
    animate();
    function init() {
        

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 3;

        scene = new THREE.Scene();

        THREE.ImageUtils.crossOrigin = '';
        

        //Grab Image Maps
        var planetMap = null;
        var atmosphereMap = null;
        var planetTerrainMap = null;
        if(planetImg || (planetImg != "")){ 
            planetMap = new THREE.TextureLoader().load(planetImg);
        }
        if(planetTerrainImg || (planetTerrainImg != "")){ 
            planetTerrainMap = new THREE.TextureLoader().load(planetImg);
        }
        if(atmosphereImg || (atmosphereImg != "")){ 
            atmosphereMap = new THREE.TextureLoader().load(atmosphereImg);
        }
        




        
        //Create Skybox
        var cubeMaterials = [
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '/static/img/skybox/corona_ft.png' ), side: THREE.DoubleSide }), //front
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '/static/img/skybox/corona_bk.png' ), side: THREE.DoubleSide }), //back
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '/static/img/skybox/corona_up.png' ), side: THREE.DoubleSide }), //up
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '/static/img/skybox/corona_dn.png' ), side: THREE.DoubleSide }), //down
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '/static/img/skybox/corona_rt.png' ), side: THREE.DoubleSide }), //right
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '/static/img/skybox/corona_lf.png' ), side: THREE.DoubleSide }), //left
        ]

        //Create Skybox
        var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
        skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
        skyboxMesh = new THREE.Mesh(skyboxGeometry, cubeMaterial);

        //Create Planet
        var planetGeometry = new THREE.SphereGeometry((planetSize/100), 32 , 32);
        planetMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(planetColor),
            bumpMap: planetTerrainMap,
            bumpScale: (planetContour / 100),
            displacementMap: planetTerrainMap,
            displacementScale: (planetRoughness / 333),
            specular : new THREE.Color("grey"),
            shininess: (planetReflectiveness / 20),
            map: planetMap,
            side: THREE.DoubleSide
        });
        

        

        //Fix planet interior lighting
        planetMaterial.onBeforeCompile = function( shader ) {

            shader.fragmentShader = shader.fragmentShader.replace(
        
                `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
        
                `gl_FragColor = ( gl_FrontFacing ) ? vec4( outgoingLight, diffuseColor.a ) : vec4( diffuse, opacity );`
        
            );
        };

        planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

        //Create Atmosphere
        atmosphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        atmosphereMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(atmosphereColor),
            transparent: true,
            map: atmosphereMap,
            opacity: (atmosphereOpacity/100),
        });
        //Fix atmosphere size
        atmosphereMesh = new THREE.Mesh(atmosphereGeometry,atmosphereMaterial);

        atmosphereMesh.scale.x = 1*(1+(atmosphereDepth/300));
        atmosphereMesh.scale.y = 1*(1+(atmosphereDepth/300));
        atmosphereMesh.scale.z = 1*(1+(atmosphereDepth/300));
        
        //Create ambient light
        var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.02 );

        //Create directional sunlight
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1, 100 );
        directionalLight.position.set(1,1,1);
        directionalLight.castShadow = true;


        //Set up shadow properties for the light
        directionalLight.shadow.mapSize.width = 512;
        directionalLight.shadow.mapSize.height = 512;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;


        //Create and configure Renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.LinearToneMapping;
        renderer.shadowMapEnabled = true;
        renderer.shadowMapType = THREE.PCFShadowMap;
        //Put Renderer on page
        document.body.appendChild(renderer.domElement);

        //Initialize Controls
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        //Set maximum and minimum zoom distance
        controls.minDistance = 2.5;
        controls.maxDistance = 10;


        //Initialize post-processing
        renderScene = new THREE.RenderPass(scene, camera);

        var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );

        var copyShader = new THREE.ShaderPass(THREE.CopyShader);
        copyShader.renderToScreen = true;
        
        //Apply aura
        bloomStrength = (atmosphereAura/100);
		var bloomRadius = 2;
		var bloomThreshold = 0.01;

        bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), bloomStrength, bloomRadius, bloomThreshold);

		composer = new THREE.EffectComposer(renderer);

        composer.setSize(window.innerWidth, window.innerHeight);
        composer.addPass(renderScene);
        composer.addPass(effectFXAA);
        composer.addPass(effectFXAA);

        composer.addPass(bloomPass);
        composer.addPass(copyShader);

        //Add all objects to the scene
        scene.add(planetMesh, directionalLight, ambientLight, skyboxMesh, atmosphereMesh);


        if (typeof console._commandLineAPI !== 'undefined') {
            console.API = console._commandLineAPI;
        } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
            console.API = console._inspectorCommandLineAPI;
        } else if (typeof console.clear !== 'undefined') {
            console.API = console;
        }
        //console.API.clear();
        }

        //Render frames
        function animate() {
            requestAnimationFrame(animate);
            //Rotate planet and atmosphere
            planetMesh.rotation.y += (planetSpeed/10000);
            atmosphereMesh.rotation.y += (atmosphereSpeed/10000);


            renderer.render(scene, camera);
            //Render post-processing
            composer.render();

        }