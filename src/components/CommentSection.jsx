import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth.jsx';
import { getComments, addComment } from '../api/comments';
import CommentItem from './CommentItem';

gsap.registerPlugin(useGSAP);

function CommentSection({ articleId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const replyRef = useRef(null);
  const commentRefs = useRef([]);

  // 获取评论
  useEffect(() => {
    fetchComments();
  }, [articleId]);

  // 回复提示动画
  useGSAP(() => {
    if (replyRef.current) {
      gsap.from(replyRef.current, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.out' });
    }
  }, { dependencies: [replyTo], scope: replyRef });

  // 评论列表交错入场
  useGSAP(() => {
    if (commentRefs.current.length > 0) {
      gsap.from(commentRefs.current, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, { dependencies: [comments.length] });

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(articleId);
      setComments(data || []);
    } catch (err) {
      console.error('获取评论失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 提交评论
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError(t('comments.loginFirst'));
      return;
    }

    if (!content.trim()) {
      setError(t('comments.emptyContent'));
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const newComment = await addComment(articleId, content.trim(), replyTo?.id || null);
      
      // 更新评论列表
      if (replyTo) {
        setComments(prev => prev.map(comment => {
          if (comment.id === replyTo.id) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          }
          return comment;
        }));
      } else {
        setComments(prev => [newComment, ...prev]);
      }

      // 清空表单
      setContent('');
      setReplyTo(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 处理回复
  const handleReply = (comment) => {
    setReplyTo(comment);
    setContent('');
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 取消回复
  const cancelReply = () => {
    setReplyTo(null);
    setContent('');
  };

  // 删除评论
  const handleDelete = (commentId, parentId) => {
    if (parentId) {
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: (comment.replies || []).filter(reply => reply.id !== commentId)
          };
        }
        return comment;
      }));
    } else {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    }
  };

  // 评论总数（包括回复）
  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-light tracking-wide text-stone-900 dark:text-stone-100">
          {t('comments.title')}
          <span className="ml-2 text-sm text-stone-400 font-normal">
            ({totalComments})
          </span>
        </h3>
      </div>

      {/* 评论表单 */}
      <div id="comment-form" className="mb-10">
        {user ? (
          <form onSubmit={handleSubmit}>
            {/* 回复提示 */}
            {replyTo && (
              <div ref={replyRef} className="mb-4 flex items-center gap-2 text-sm text-stone-500">
                <span>{t('comments.replyTo')} {replyTo.user_name}：</span>
                <button
                  type="button"
                  onClick={cancelReply}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {t('comments.cancelReply')}
                </button>
              </div>
            )}

            {/* 用户头像和输入框 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-sm font-serif text-stone-500">
                    {user.name?.[0] || '用'}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setError('');
                  }}
                  placeholder={replyTo ? t('comments.replyPlaceholder', { name: replyTo.user_name }) : t('comments.placeholder')}
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide resize-none"
                />
                
                {/* 错误提示 */}
                {error && (
                  <p className="mt-2 text-xs text-red-500">{error}</p>
                )}
                
                {/* 提交按钮 */}
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="px-6 py-2.5 text-sm text-white bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-300 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? t('comments.submitting') : t('comments.submit')}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 bg-stone-50 dark:bg-stone-900/50 rounded-lg">
            <p className="text-sm text-stone-500 mb-3">{t('comments.loginRequired')}</p>
            <a
              href="/login"
              className="inline-block px-6 py-2.5 text-sm text-white bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-300 tracking-wider"
            >
              {t('comments.goLogin')}
            </a>
          </div>
        )}
      </div>

      {/* 评论列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-0">
          {comments.map((comment, index) => (
            <div key={comment.id} ref={el => commentRefs.current[index] = el}>
              <CommentItem
                comment={comment}
                articleId={articleId}
                onReply={handleReply}
                onDelete={handleDelete}
                currentUserId={user?.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-stone-400">{t('comments.noComments')}</p>
        </div>
      )}
    </div>
  );
}

export default CommentSection;
