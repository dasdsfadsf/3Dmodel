// social-app.js
document.addEventListener('DOMContentLoaded', () => {
    const postContent = document.getElementById('post-content');
    const imageUpload = document.getElementById('image-upload');
    const drawBtn = document.getElementById('draw-btn');
    const postBtn = document.getElementById('post-btn');
    const drawingCanvas = document.getElementById('drawing-canvas');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const drawColor = document.getElementById('draw-color');
    const drawSize = document.getElementById('draw-size');
    const clearCanvas = document.getElementById('clear-canvas');
    const saveDrawing = document.getElementById('save-drawing');
    const postsFeed = document.getElementById('posts-feed');
    
    let isDrawing = false;
    let currentImage = null;
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    // 初始化画布
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 渲染已有帖子
    renderPosts();
    
    // 绘图功能
    drawBtn.addEventListener('click', () => {
        drawingCanvas.style.display = drawingCanvas.style.display === 'none' ? 'block' : 'none';
    });
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    clearCanvas.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    
    saveDrawing.addEventListener('click', () => {
        currentImage = canvas.toDataURL('image/png');
        drawingCanvas.style.display = 'none';
    });
    
    // 图片上传
    imageUpload.addEventListener('change', handleImageUpload);
    
    // 发布帖子
    postBtn.addEventListener('click', createPost);
    
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.lineWidth = drawSize.value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = drawColor.value;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    
    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }
    
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImage = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    function createPost() {
        const content = postContent.value.trim();
        if (!content && !currentImage) return;
        
        const newPost = {
            id: Date.now(),
            content: content,
            image: currentImage,
            timestamp: new Date().toLocaleString(),
            likes: 0,
            comments: []
        };
        
        posts.unshift(newPost);
        savePosts();
        renderPosts();
        
        // 重置表单
        postContent.value = '';
        currentImage = null;
        imageUpload.value = '';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    function renderPosts() {
        postsFeed.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <div class="post-header">
                    <span class="post-time">${post.timestamp}</span>
                </div>
                ${post.content ? `<div class="post-content">${post.content}</div>` : ''}
                ${post.image ? `<div class="post-image"><img src="${post.image}" alt="帖子图片"></div>` : ''}
                <div class="post-actions">
                    <button class="like-btn" data-id="${post.id}">👍 ${post.likes}</button>
                    <button class="comment-btn" data-id="${post.id}">💬 评论</button>
                </div>
                <div class="comments-section" id="comments-${post.id}" style="display:none;">
                    <input type="text" class="comment-input" placeholder="添加评论...">
                    <button class="add-comment" data-id="${post.id}">发布</button>
                    <div class="comments-list"></div>
                </div>
            `;
            
            postsFeed.appendChild(postElement);
        });
        
        // 添加事件监听
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', handleLike);
        });
        
        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', toggleComments);
        });
        
        document.querySelectorAll('.add-comment').forEach(btn => {
            btn.addEventListener('click', addComment);
        });
    }
    
    function handleLike(e) {
        const postId = parseInt(e.target.dataset.id);
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            savePosts();
            renderPosts();
        }
    }
    
    function toggleComments(e) {
        const postId = e.target.dataset.id;
        const commentsSection = document.getElementById(`comments-${postId}`);
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }
    
    function addComment(e) {
        const postId = parseInt(e.target.dataset.id);
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        
        const commentInput = e.target.previousElementSibling;
        const commentText = commentInput.value.trim();
        if (!commentText) return;
        
        post.comments.push({
            id: Date.now(),
            text: commentText,
            timestamp: new Date().toLocaleString()
        });
        
        savePosts();
        renderPosts();
        commentInput.value = '';
    }
    
    function savePosts() {
        localStorage.setItem('posts', JSON.stringify(posts));
    }
});
