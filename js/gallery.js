// 初始化Three.js场景
let scene, camera, renderer, model;

function init() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(document.getElementById('model-container').offsetWidth, 
                    document.getElementById('model-container').offsetHeight);
    document.getElementById('model-container').appendChild(renderer.domElement);
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // 添加轨道控制器
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // 加载示例模型
    loadModel('models/sample.obj');
    
    // 添加事件监听器
    document.getElementById('rotate-btn').addEventListener('click', toggleRotation);
    document.getElementById('zoom-in-btn').addEventListener('click', () => zoom(0.8));
    document.getElementById('zoom-out-btn').addEventListener('click', () => zoom(1.2));
    document.getElementById('model-upload').addEventListener('change', handleModelUpload);
    
    // 窗口大小调整
    window.addEventListener('resize', onWindowResize);
    
    // 开始动画循环
    animate();
}

let rotating = true;
function toggleRotation() {
    rotating = !rotating;
    document.getElementById('rotate-btn').textContent = rotating ? '停止旋转' : '旋转';
}

function zoom(factor) {
    camera.position.z *= factor;
}

function loadModel(path) {
    const loader = new THREE.OBJLoader();
    loader.load(
        path,
        function (object) {
            // 移除旧模型
            if (model) scene.remove(model);
            
            // 添加新模型
            model = object;
            scene.add(model);
            
            // 居中模型
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            // 调整相机
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            camera.position.z = maxDim * 1.5;
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading model:', error);
        }
    );
}

function handleModelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function (e) {
        const contents = e.target.result;
        const blob = new Blob([contents], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        loadModel(url);
        
        // 更新模型信息
        document.getElementById('model-title').textContent = file.name.replace('.obj', '');
        document.getElementById('model-description').textContent = '用户上传的3D模型';
    };
    reader.readAsText(file);
}

function onWindowResize() {
    const container = document.getElementById('model-container');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (model && rotating) {
        model.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
}

// 初始化场景
init();
