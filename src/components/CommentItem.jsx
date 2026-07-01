import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { updateComment, deleteComment } from '../api/comments';
import { translateText } from '../api/translate';

gsap.registerPlugin(useGSAP);

function CommentItem({ comment, articleId, onReply, onDelete, currentUserId, isReply = false }) {
  const { t, i18n } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const repliesRef = useRef(null);
  
  // 翻译状态
  const [translatedContent, setTranslatedContent] = useState(null);
  const [showTranslated, setShowTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');

  const isAuthor = currentUserId === comment.user_id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  // 回复列表展开/收起动画
  useGSAP(() => {
    if (repliesRef.current) {
      gsap.fromTo(repliesRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, { dependencies: [showReplies] });

  // 格式化时间
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const locale = i18n.language === 'zh' ? 'zh-CN' : 'en-US';
    
    // 小于1分钟
    if (diff < 60000) {
      return t('time.justNow');
    }
    // 小于1小时
    if (diff < 3600000) {
      return t('time.minutesAgo', { count: Math.floor(diff / 60000) });
    }
    // 小于24小时
    if (diff < 86400000) {
      return t('time.hoursAgo', { count: Math.floor(diff / 3600000) });
    }
    // 小于7天
    if (diff < 604800000) {
      return t('time.daysAgo', { count: Math.floor(diff / 86400000) });
    }
    // 超过7天显示具体日期
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 保存编辑
  const handleSave = async () => {
    if (!editContent.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await updateComment(comment.id, editContent.trim());
      comment.content = editContent.trim();
      setEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    setEditContent(comment.content);
    setEditing(false);
  };

  // 删除评论
  const handleDelete = async () => {
    if (!confirm(t('comments.deleteConfirm'))) {
      return;
    }

    try {
      await deleteComment(comment.id);
      onDelete(comment.id, comment.parent_id);
    } catch (err) {
      alert(err.message);
    }
  };

  // 翻译评论
  const handleTranslate = async () => {
    // 如果已经翻译过，直接切换显示
    if (translatedContent) {
      setShowTranslated(!showTranslated);
      return;
    }

    setTranslating(true);
    setTranslateError('');

    try {
      const result = await translateText(comment.content);
      setTranslatedContent(result.translatedText);
      setShowTranslated(true);
    } catch (err) {
      setTranslateError(err.message || t('article.translateError'));
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className={`${isReply ? 'ml-12' : ''}`}>
      <div className={`py-6 ${!isReply ? 'border-b border-stone-100 dark:border-stone-800/50' : ''}`}>
        <div className="flex gap-4">
          {/* 头像 */}
          <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center shrink-0">
            {comment.user_avatar ? (
              <img 
                src={comment.user_avatar} 
                alt={comment.user_name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-serif text-stone-500">
                {comment.user_name?.[0] || t('comments.user')}
              </span>
            )}
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            {/* 用户信息和时间 */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-stone-800 dark:text-stone-200">
                {comment.user_name || t('comments.anonymous')}
              </span>
              <span className="text-xs text-stone-400">
                {formatTime(comment.created_at)}
              </span>
              {isAuthor && (
                <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                  {t('comments.author')}
                </span>
              )}
            </div>

            {/* 评论内容 */}
            {editing ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 resize-none"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={submitting || !editContent.trim()}
                    className="px-4 py-1.5 text-xs text-white bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-300 disabled:opacity-50"
                  >
                    {submitting ? t('common.saving') : t('common.save')}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-1.5 text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors duration-300"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-wrap">
                  {showTranslated && translatedContent ? translatedContent : comment.content}
                </p>
                {translateError && (
                  <p className="mt-1 text-xs text-red-500">{translateError}</p>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            {!editing && (
              <div className="mt-3 flex items-center gap-4">
                {!isReply && (
                  <button
                    onClick={() => onReply(comment)}
                    className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-300"
                  >
                    {t('article.reply')}
                  </button>
                )}
                <button
                  onClick={handleTranslate}
                  disabled={translating}
                  className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-300 disabled:opacity-50"
                >
                  {translating ? t('article.translating') : (showTranslated ? t('article.showOriginal') : t('article.translate'))}
                </button>
                {isAuthor && (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-300"
                    >
                      {t('article.edit')}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-xs text-stone-400 hover:text-red-500 transition-colors duration-300"
                    >
                      {t('article.delete')}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* 回复列表 */}
            {hasReplies && !isReply && (
              <div className="mt-4">
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 ${showReplies ? 'rotate-90' : ''}`}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  {showReplies ? t('comments.collapse') : t('comments.expand')} {t('comments.replies', { count: comment.replies.length })}
                </button>

                {showReplies && (
                  <div ref={repliesRef} className="overflow-hidden">
                    <div className="mt-2 space-y-0">
                      {comment.replies.map((reply) => (
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          articleId={articleId}
                          onReply={onReply}
                          onDelete={onDelete}
                          currentUserId={currentUserId}
                          isReply={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
