import React, { useState , useEffect} from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { formatDistanceToNow, set } from 'date-fns';
import './styles/Comments.css';
const CommentForm = ({ postId }) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentUploaded, setCommentUploaded] = useState(false);
  const [uploadingComment, setUploadingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

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
    setUploadingComment(true);
    const response = await axios.post('/api/uploadComment', {
      postId: postId,
      userId: userId,
      comment: comment,
      userImg: userImg
    });
    setCommentUploaded(!commentUploaded)
    setUploadingComment(false);
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



    const userId = session.user.username;
    const userImg = session.user.image

    await uploadComment(postId, userId, commentText , userImg);
  };

  const deleteComment = async (commentId) => {
    try {
      setDeletingCommentId(commentId);
      await axios.delete("/api/uploadComment", {data: {
          id: commentId
        }
        });
      setComments(comments.filter((comment) => comment._id !== commentId));
      setCommentUploaded(!commentUploaded)
      setDeletingCommentId(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <>
    <div className={`comments ${comments.length === 0 ? 'hidden' : ''}`} >
      
      {comments.map((comment) => (
        <div className='comment-data' key={comment._id}>
          <div className="comment-with-delete">
          <div className='commentor-info'>
            <img className='commentor-profile-img' src={comment.userImg} alt={comment.username} />
            <h5 className='commentor-username'>{`${comment.userId} : ` }</h5>
            
          </div>
          {(session && session.user.username === comment.userId) ? <button disabled={deletingCommentId === comment._id} className='delete-comment-btn' onClick={() => deleteComment(comment._id)}>{(deletingCommentId === comment._id ) ?  'Deleting...' : 'Delete'}</button> : null}
          </div>

          <div className='commentor-comment'>
            <p className='commentor-text'>{<br/>}{comment.comment}</p>
            <p className='commentor-date'>{formatDistanceToNow(new Date(comment.commentedAt), { addSuffix: true })}</p>
        </div>
        </div>
      ))}
    </div>
    {session ? (
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
      <button disabled={!comment} className='comment-btn' type="submit">{uploadingComment ? 'Commneting...' : 'Comment'}</button>
    </form>) : null}
    </>
  );
};

export default CommentForm;
