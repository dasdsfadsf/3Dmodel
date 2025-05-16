// threejs-app.js
let scene, camera, renderer, model, controls;
let isRotating = false;

init();

function init() {
    // 初始化场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // 初始化相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 初始化渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('model-container').appendChild(renderer.domElement);
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // 添加控制器
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // 文件上传处理
    document.getElementById('model-upload').addEventListener('change', handleFileUpload);
    
    // 旋转开关
    document.getElementById('rotate-toggle').addEventListener('click', () => {
        isRotating = !isRotating;
    });
    
    // 窗口大小调整
    window.addEventListener('resize', onWindowResize);
    
    animate();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const loader = new THREE.OBJLoader();
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const contents = e.target.result;
        if (model) scene.remove(model);
        
        model = loader.parse(contents);
        scene.add(model);
        
        // 自动调整模型位置和大小
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);
        
        camera.position.z = size.length() * 1.5;
        controls.update();
    };
    
    reader.readAsText(file);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (isRotating && model) {
        model.rotation.y += 0.01;
    }
    
    controls.update();
    renderer.render(scene, camera);
}
