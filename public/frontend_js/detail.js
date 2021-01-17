const loadButton = document.getElementById('loadComments');
const commentsTitle = document.getElementById('commentsTitle');
const commentsDiv = document.getElementById('comments');
const commentForm = document.getElementById('commentForm');
const noComments = document.createElement('h4');

function createComment(commentData) {
    const comment = document.createElement('div');
    const commentText = document.createElement('p');
    const commenter = document.createElement('a');

    comment.classList.add('comment');
    commenter.innerText = `${commentData.commenter.firstName} ${commentData.commenter.lastName}`;
    commenter.href = `/users/profile/${commentData.commenter._id}`;
    commenter.style.fontSize = '1.5rem';
    commentText.innerText = commentData.text;

    comment.appendChild(commenter);
    comment.appendChild(commentText);
    commentsDiv.insertBefore(comment, commentForm.parentNode.nextSibling);
}

loadButton.addEventListener('click', () => {
    fetch(`/comments/dog/${loadButton.dataset.dog}`)
    .then(res => res.json())
    .then(comments => {
        loadButton.style.display = 'none';
        commentsTitle.style.display = 'block';
        commentsDiv.style.display = 'block';
        comments.forEach(comment => {
            createComment(comment);
        });
        if (comments.length === 0) {
            noComments.innerText = 'There are currently no comments. Write one!';
            noComments.style.marginBottom = '3rem';
            noComments.style.textAlign = 'center';
            commentsDiv.appendChild(noComments);
        }
    })
    .catch(err => console.log('There has been connection error while fetching comments ' + err));
});

commentForm.addEventListener('submit', function(event) {
    event.preventDefault();

    noComments.style.display = 'none';

    const textAreaComment = document.getElementById('commentArea');

    fetch(`/comments/dog/${loadButton.dataset.dog}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: textAreaComment.value })
    })
    .then(res => res.json())
    .then(res => {
        textAreaComment.value = '';
        createComment(res);
    })
    .catch(err => console.log('There has been error while posting comment ' + err));
});

if (commentsDiv.dataset.isAuthenticated == 'false') { //isAuthenticated is a string
    commentForm.style.display = 'none';
}