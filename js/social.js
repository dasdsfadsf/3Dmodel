// social.js - 3D社交平台的核心交互逻辑
document.addEventListener('DOMContentLoaded', () => {
    // ====================== 全局变量 ======================
    const API_URL = 'https://your-api-endpoint.com'; // 替换为实际API地址
    let currentUser = JSON.parse(localStorage.getItem('user')) || { id: 0, name: 'Guest', avatar: 'default.obj' };
    let scene, camera, renderer, avatarMesh;

    // ====================== 3D头像初始化 ======================
    function init3DAvatar() {
        // 1. 创建场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // 2. 相机设置 (透视相机)
        camera = new THREE.PerspectiveCamera(75, 200 / 200, 0.1, 1000);
        camera.position.z = 5;

        // 3. 渲染器
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(200, 200);
        document.getElementById('avatar-container').appendChild(renderer.domElement);

        // 4. 加载用户3D头像
        loadAvatar(currentUser.avatar);

        // 5. 控制器 (允许鼠标旋转查看)
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 1.5;

        // 6. 动画循环
        function animate() {
            requestAnimationFrame(animate);
            if (avatarMesh) avatarMesh.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();
    }

    // 加载OBJ格式头像模型
    async function loadAvatar(modelPath) {
        try {
            // 1. 清除旧模型
            if (avatarMesh) scene.remove(avatarMesh);

            // 2. 加载模型
            const loader = new THREE.OBJLoader();
            const model = await loader.loadAsync(`models/${modelPath}`);
            
            // 3. 标准化模型尺寸和位置
            model.scale.set(0.8, 0.8, 0.8);
            model.position.y = -1;
            
            // 4. 添加环境光 + 定向光
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 20, 10);
            
            scene.add(ambientLight, directionalLight, model);
            avatarMesh = model;

        } catch (error) {
            console.error('Avatar loading failed:', error);
            // 加载默认头像
            loadAvatar('default.obj');
        }
    }

    // ====================== 社交功能 ======================
    // 1. 加载好友动态
    async function loadPosts() {
        try {
            const response = await fetch(`${API_URL}/posts?userId=${currentUser.id}`);
            const posts = await response.json();
            renderPosts(posts);
        } catch (error) {
            console.error('Failed to load posts:', error);
            showToast('动态加载失败，请检查网络');
        }
    }

    // 2. 渲染动态列表
    function renderPosts(posts) {
        const container = document.getElementById('posts-container');
        container.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="mini-avatar" data-model="${post.user.avatar}"></div>
                    <span>${post.user.name}</span>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-footer">
                    <button class="like-btn" data-postid="${post.id}">
                        ❤️ ${post.likes} 点赞
                    </button>
                    <button class="comment-btn" data-postid="${post.id}">
                        💬 ${post.comments.length} 评论
                    </button>
                </div>
            `;
            container.appendChild(postElement);
        });

        // 添加事件监听
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', handleLike);
        });
    }

    // 3. 点赞处理
    async function handleLike(event) {
        const postId = event.target.dataset.postid;
        try {
            const response = await fetch(`${API_URL}/posts/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, postId })
            });
            
            const result = await response.json();
            if (result.success) {
                event.target.innerHTML = `❤️ ${result.newCount} 点赞`;
                showToast('点赞成功!');
            }
        } catch (error) {
            console.error('Like failed:', error);
            showToast('操作失败，请重试');
        }
    }

    // 4. 消息通知系统
    function setupNotifications() {
        const eventSource = new EventSource(`${API_URL}/notifications?userId=${currentUser.id}`);
        
        eventSource.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            showNotification(notification);
            
            // 更新角标
            const badge = document.getElementById('notification-badge');
            badge.textContent = parseInt(badge.textContent || 0) + 1;
        };
    }

    // ====================== UI辅助函数 ======================
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }

    function showNotification(notif) {
        // 实际项目中可以使用更精美的通知UI
        console.log('New notification:', notif);
        if (Notification.permission === 'granted') {
            new Notification(notif.title, { body: notif.message });
        }
    }

    // ====================== 初始化执行 ======================
    init3DAvatar();
    loadPosts();
    setupNotifications();

    // 请求通知权限
    if (Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
});
