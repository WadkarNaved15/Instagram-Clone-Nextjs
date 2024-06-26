import React, { useState , useEffect} from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import './styles/Comments.css';
const CommentForm = ({ postId }) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentUploaded, setCommentUploaded] = useState(false);

  const getComments = async (postId) => {
    try {
      const response = await axios.get(`/api/getComments?postId=${postId}`);
      return response.data.comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadComments = async () => {
        const fetchedComments =await getComments(postId);
        setComments(fetchedComments);
          };
    loadComments();

  }, [postId, commentUploaded]);

const uploadComment = async (postId, userId, comment , userImg) => {
  try {
    const response = await axios.post('/api/uploadComment', {
      postId: postId,
      userId: userId,
      comment: comment,
      userImg: userImg
    });
    setCommentUploaded(!commentUploaded)
    if (response.data.message) {
      console.log('Comment uploaded:', response.data.comment);
      
    }
  } catch (error) {
    console.error('Error uploading comment:', error);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const commentText = comment;
    setComment('');

    if (!session) {
      return alert('You must be logged in to comment.');
    }

    const userId = session.user.username;
    const userImg = session.user.image

    await uploadComment(postId, userId, commentText , userImg);
  };

  return (
    <>
    <div className={`comments ${comments.length === 0 ? 'hidden' : ''}`} >
      
      {comments.map((comment) => (
        <div className='comment-data' key={comment._id}>
          <img className='commentor-profile-img' src={comment.userImg} alt={comment.username} />
            <h5 className='commentor-username'>{`${comment.userId} : ` }</h5>
            <p className='commentor-text'>{comment.comment}</p>
        </div>
      ))}
    </div>
    <form className='comment-form' onSubmit={handleSubmit}>
      <img className='comment-profile-img' src={session.user.image} alt={session.user.username} />
      <input
        className='comment-input'
        autoComplete='off'
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button disabled={!comment} className='comment-btn' type="submit">Post</button>
    </form>
    </>
  );
};

export default CommentForm;
