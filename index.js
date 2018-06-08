/*globals THREE */
(() => {
    var dom = document.querySelector('canvas'),
    // width = dom.getAttribute('width'),
    // height = dom.getAttribute('height'),
    width = window.innerWidth,
    height = window.innerHeight,
    mp = Math.PI,
    x = 0,
    y = 1000,
    z = 3000,
    reqRet,
    rad = function(r){return r * (Math.PI / 180);};



    (function(w,r){
        w['r'+r] = w['r'+r] ||
        w['webkitR'+r] ||
        w['mozR'+r] ||
        w['oR'+r] ||
        w['msR'+r] ||
        function(callback){w.setTimeout(callback,1000/60);};
    })(window,'equestAnimationFrame');

    var renderer = new THREE.WebGLRenderer({
        canvas:dom
    });
    renderer.setSize(width,height);
    renderer.setPixelRatio(window.devicePixelRatio);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(30,width / height,1,30000);
    camera.position.set(x, y, z);

    var geometry = new THREE.BoxGeometry(300,300,300);
    // var geometry = new THREE.TetrahedronGeometry(100);
    // var geometry = new THREE.TorusGeometry(100,50,40,40);

    // var material = new THREE.MeshPhongMaterial({color:'rgb(210,255,255)'});
    var loader = new THREE.TextureLoader();
    var map = loader.load('map.jpg');
    var bump = loader.load('bump.jpg');
    var material = new THREE.MeshPhongMaterial({
        map:map,
        bumpMap:bump,
        bumpScale:12
    });
    var mesh = new THREE.Mesh(geometry,material);
    mesh.position.set(0,200,0);
    mesh.rotation.set(45,0,0);
    scene.add(mesh);

    var mat;
    new THREE.MTLLoader().load('IronMan.mtl',function(mtl){
        var obj = new THREE.OBJLoader();
        obj.setMaterials(mtl);

        obj.load('IronMan.obj',function(res){
            mat = res;
            res.position.set(400,0,0);
            res.castShadow = true;
            res.receiveShadow = true;
            scene.add(res);
        });
    });



    var ground = new THREE.Mesh(
        new THREE.BoxGeometry(2000, 1, 2000),
        new THREE.MeshLambertMaterial({color: 0x999999})
    );
    ground.position.set(0,-1,0);
    scene.add(ground);


    // var al = new THREE.AmbientLight(0xdddddd,0.4);
    // var light = new THREE.HemisphereLight(0xffffff, 0x00ffff, 1.0);
    var light = new THREE.DirectionalLight(0xffffff,1);
    // light.position.set(1,1,1);
    light.position.set(0,1400,800);
    // scene.add(al);
    light.shadow.camera.left = -1600;
    light.shadow.camera.right = 1600;
    light.shadow.camera.top = -1600;
    light.shadow.camera.bottom = 1600;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.far = 8000;
    scene.add(light);



    var lightHelper = new THREE.DirectionalLightHelper(light,200);
    scene.add(lightHelper);

    var directionalLightShadowHelper = new THREE.CameraHelper(light.shadow.camera);//カメラのヘルパー
    scene.add( directionalLightShadowHelper);

    var axis = new THREE.AxesHelper(4000);
    axis.position.set(0,0,0);
    scene.add(axis);

    var ctrl = new THREE.OrbitControls(camera,dom);
    // ctrl.autoRotate = true;


    //影を作る光源に影描画設定追加
    light.castShadow = true;
    //影を作るオブジェクトに影描画設定追加
    mesh.castShadow = true;
    //影を受けるオブジェクト(地面など)に影描画設定追加
    ground.receiveShadow = true;
    //レンダラーに影描画設定追加
    renderer.shadowMap.enabled = true;


    var load = function(){
        // mesh.rotation.x += 0.01;
        // mesh.rotation.y += 0.01;
        if(mat){
            mat.rotation.y += 0.01;
        }
        ctrl.update();
        renderer.render(scene,camera);
        requestAnimationFrame(load);
    };

    load();

    $(window).on('resize',function(){
        var w = window.innerWidth,
            h = window.innerHeight;
        renderer.setSize(w,h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
})();
