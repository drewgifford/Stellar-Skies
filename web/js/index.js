var camera, scene, renderer;
var geometry, material, mesh, controls, composer, atmosphereMesh, bloomStrength, bloomPass;
var surfaceSpeed = 0.0015;
var atmosphereSpeed = 0.001;

var atmosphereDepth = 0.05;


$("window").resize(function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
})

    init();
    animate();
    function init() {
        

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 3;

        scene = new THREE.Scene();

        THREE.ImageUtils.crossOrigin = '';
        var bmap = new THREE.TextureLoader().load( 'https://miro.medium.com/max/4092/1*-vO6vIHeE67CAm6Mk3AcSA.png' );
        var cloudMap = new THREE.TextureLoader().load("https://i.imgur.com/MUWqhvj.png");
        var skyBoxMap = new THREE.TextureLoader().load("https://lightshaderdevlog.files.wordpress.com/2016/06/milkyway-galaxy-sky-stars_ccsa-crop.jpg");
        console.log(bmap);




        
        //CREATE SKYBOX IMAGE
        var cubeMaterials = [
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://i.imgur.com/Yh8mbF1.png' ), side: THREE.DoubleSide }), //front
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://i.imgur.com/As8zp9y.png' ), side: THREE.DoubleSide }), //back
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://i.imgur.com/uMVt7dm.png' ), side: THREE.DoubleSide }), //up
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://i.imgur.com/P86GJDz.png' ), side: THREE.DoubleSide }), //down
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://i.imgur.com/J5VhovR.png' ), side: THREE.DoubleSide }), //right
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://i.imgur.com/7A5l4sm.png' ), side: THREE.DoubleSide }), //left
        ]



        var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
        skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
        skybox = new THREE.Mesh(skyboxGeo, cubeMaterial);

        var planetGeometry = new THREE.SphereGeometry(1, 32 , 32);
        planetMaterial = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            bumpMap: bmap,
            bumpScale:  0.1,
            displacementMap: bmap,
            displacementScale: 0,
            specular : new  THREE.Color("grey"),
            shininess: 5
        });
        planetMaterial.side = THREE.DoubleSide
        planetMaterial.onBeforeCompile = function( shader ) {

            shader.fragmentShader = shader.fragmentShader.replace(
        
                `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
        
                `gl_FragColor = ( gl_FrontFacing ) ? vec4( outgoingLight, diffuseColor.a ) : vec4( diffuse, opacity );`
        
            );
        };

        mesh = new THREE.Mesh(planetGeometry, planetMaterial);


        atmosphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        atmosphereMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            map: cloudMap,
            opacity: 0.9,
            //blending: THREE.AdditiveBlending
        });
        

        var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.02 );
        scene.add( ambientLight );

        atmosphereMesh = new THREE.Mesh(atmosphereGeometry,atmosphereMaterial);
        atmosphereMesh.scale.x = 1*(1+atmosphereDepth);
        atmosphereMesh.scale.y = 1*(1+atmosphereDepth);
        atmosphereMesh.scale.z = 1*(1+atmosphereDepth);

        

        atmosphereMesh.position.set(0,0,0);
        mesh.position.set(0,0,0);


        var light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
        light.position.set(1,1,1); 			//default; light shining from top
        light.castShadow = true;            // default false
        scene.add( light);

        //Set up shadow properties for the light
        light.shadow.mapSize.width = 512;  // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5;    // default
        light.shadow.camera.far = 500;     // default


        scene.add(mesh);
        scene.add(atmosphereMesh);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.LinearToneMapping;

        renderer.shadowMapEnabled = true;
        renderer.shadowMapType = THREE.PCFShadowMap;

        document.body.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls( camera, renderer.domElement );

        controls.minDistance = 2.5;
        controls.maxDistance = 10;


        renderScene = new THREE.RenderPass(scene, camera);

        var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );

        var copyShader = new THREE.ShaderPass(THREE.CopyShader);
        copyShader.renderToScreen = true;
        
        bloomStrength = 0.25;
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

        scene.add(skybox);

        }

        function animate() {
            try{
            requestAnimationFrame(animate);
            
            mesh.rotation.y += surfaceSpeed;
            atmosphereMesh.rotation.y += atmosphereSpeed;
            renderer.render(scene, camera);
            composer.render();
            } catch(e) {
                
            }

        }