// 图片预览功能
document.getElementById('image-input').addEventListener('change', function(e) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) continue;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            preview.appendChild(img);
        }
        reader.readAsDataURL(file);
    }
});

// 发布帖子功能
document.getElementById('post-btn').addEventListener('click', function() {
    const content = document.getElementById('post-content').value.trim();
    const imageInput = document.getElementById('image-input');
    
    if (!content && imageInput.files.length === 0) {
        alert('请输入内容或添加图片');
        return;
    }
    
    // 创建新帖子
    const post = document.createElement('div');
    post.className = 'post';
    
    // 帖子头部
    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';
    
    const avatar = document.createElement('img');
    avatar.src = 'https://via.placeholder.com/40';
    avatar.className = 'avatar';
    avatar.alt = '用户头像';
    
    const username = document.createElement('span');
    username.className = 'post-user';
    username.textContent = '用户名';
    
    const time = document.createElement('span');
    time.className = 'post-time';
    time.textContent = '刚刚';
    
    postHeader.appendChild(avatar);
    postHeader.appendChild(username);
    postHeader.appendChild(time);
    
    // 帖子内容
    const postContent = document.createElement('div');
    postContent.className = 'post-content';
    postContent.textContent = content;
    
    // 帖子图片
    const postImages = document.createElement('div');
    postImages.className = 'post-images';
    
    const files = imageInput.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) continue;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'post-image';
            img.alt = '帖子图片';
            postImages.appendChild(img);
        }
        reader.readAsDataURL(file);
    }
    
    // 帖子操作
    const postActions = document.createElement('div');
    postActions.className = 'post-actions';
    
    const likeBtn = document.createElement('div');
    likeBtn.className = 'action-btn like-btn';
    likeBtn.textContent = '点赞';
    
    const commentBtn = document.createElement('div');
    commentBtn.className = 'action-btn comment-btn';
    commentBtn.textContent = '评论';
    
    const shareBtn = document.createElement('div');
    shareBtn.className = 'action-btn share-btn';
    shareBtn.textContent = '分享';
    
    postActions.appendChild(likeBtn);
    postActions.appendChild(commentBtn);
    postActions.appendChild(shareBtn);
    
    // 评论部分
    const comments = document.createElement('div');
    comments.className = 'comments';
    comments.style.display = 'none';
    
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.className = 'comment-input';
    commentInput.placeholder = '评论...';
    
    const commentBtn = document.createElement('button');
    commentBtn.className = 'comment-btn';
    commentBtn.textContent = '发布评论';
    
    const commentList = document.createElement('ul');
    commentList.className = 'comment-list';
    
    comments.appendChild(commentInput);
    comments.appendChild(commentBtn);
    comments.appendChild(commentList);
    
    // 添加事件监听器
    likeBtn.addEventListener('click', function() {
        alert('你点赞了这条帖子！');
    });
    
    commentBtn.addEventListener('click', function() {
        const commentText = commentInput.value.trim();
        if (!commentText) {
            alert('请输入评论内容');
            return;
        }
        
        const commentItem = document.createElement('li');
        commentItem.className = 'comment-item';
        
        const commentAvatar = document.createElement('img');
        commentAvatar.src = 'https://via.placeholder.com/30';
        commentAvatar.className = 'comment-avatar';
        commentAvatar.alt = '评论用户头像';
        
        const commentContent = document.createElement('div');
        commentContent.className = 'comment-content';
        
        const commentUser = document.createElement('span');
        commentUser.className = 'post-user';
        commentUser.textContent = '用户名';
        
        const commentTime = document.createElement('span');
        commentTime.className = 'comment-time';
        commentTime.textContent = '刚刚';
        
        const commentTextDiv = document.createElement('div');
        commentTextDiv.textContent = commentText;
        
        commentContent.appendChild(commentUser);
        commentContent.appendChild(commentTime);
        commentContent.appendChild(commentTextDiv);
        
        commentItem.appendChild(commentAvatar);
        commentItem.appendChild(commentContent);
        
        commentList.appendChild(commentItem);
        commentInput.value = ''; // 清空评论框
    });
    
    shareBtn.addEventListener('click', function() {
        alert('你分享了这条帖子！');
    });
    
    commentBtn.addEventListener('click', function() {
        comments.style.display = comments.style.display === 'none' ? 'block' : 'none';
    });
    
    // 将所有元素添加到帖子中
    post.appendChild(postHeader);
    post.appendChild(postContent);
    post.appendChild(postImages);
    post.appendChild(postActions);
    post.appendChild(comments);
    
    // 将新帖子添加到帖子流中
    const feed = document.getElementById('feed');
    feed.prepend(post);
    
    // 清空输入框
    document.getElementById('post-content').value = '';
    document.getElementById('image-input').value = '';
    document.getElementById('image-preview').innerHTML = '';
});

// 初始化评论按钮事件监听
document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const comments = this.nextElementSibling;
        comments.style.display = comments.style.display === 'none' ? 'block' : 'none';
    });
});

// 初始化点赞、评论和分享按钮事件监听
document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('你点赞了这条帖子！');
    });
});

document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('你分享了这条帖子！');
    });
});
``
