import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Banner } from '../components/ui/Banner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getZoneName } from '../data/mockData';
import { BoardPost, ZoneData } from '../types';

interface PostDetailScreenProps {
  post: BoardPost;
  zones: ZoneData[];
  onBack: () => void;
  onToggleLike: (postId: string) => void;
  onAddReply: (postId: string, text: string) => void;
}

export const PostDetailScreen: React.FC<PostDetailScreenProps> = ({
  post,
  zones,
  onBack,
  onToggleLike,
  onAddReply,
}) => {
  const [replyText, setReplyText] = useState('');
  const [replyError, setReplyError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      setReplyError(true);
      return;
    }
    setReplyError(false);
    onAddReply(post.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header title="Dettaglio post" onBack={onBack} />

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col gap-4">
        <Card tone="subtle" className="p-4 flex flex-col gap-3 border-neutral-900">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900">
                {post.anonymous ? 'Anonimo' : post.author}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="border border-neutral-500 px-1.5 py-0.5 text-[11px] rounded bg-white text-neutral-900">
                {getZoneName(zones, post.zoneId)}
              </span>
            </div>
            <span className="text-[11px] text-neutral-600">
              {post.timestamp}
            </span>
          </div>

          <p className="text-sm text-neutral-900 leading-relaxed">{post.text}</p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onToggleLike(post.id)}
              aria-pressed={post.likedByMe}
              className={`min-h-[44px] px-3 rounded border text-xs font-medium cursor-pointer ${
                post.likedByMe
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-900 border-neutral-500'
              }`}
            >
              Mi piace ({post.likes})
            </button>
          </div>
        </Card>

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Risposte ({post.replies.length})
          </h2>

          {post.replies.length === 0 ? (
            <div className="border border-dashed border-neutral-300 rounded-md p-4 text-center">
              <p className="text-xs text-neutral-500">
                Ancora nessuna risposta. Scrivi la prima qui sotto.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {post.replies.map((reply) => (
                <Card key={reply.id} className="p-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="font-semibold text-neutral-900">
                      {reply.author}
                    </span>
                    <span>{reply.timestamp}</span>
                  </div>
                  <p className="text-xs text-neutral-800 leading-relaxed">
                    {reply.text}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reply composer */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-neutral-300 p-3 bg-white flex flex-col gap-2"
      >
        {replyError && (
          <Banner
            title="Risposta vuota"
            message="Scrivi un testo prima di inviare."
          />
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => {
              setReplyText(e.target.value);
              if (replyError) setReplyError(false);
            }}
            placeholder="Scrivi una risposta..."
            aria-label="Scrivi una risposta"
            className={`flex-1 min-h-[44px] px-3 text-sm rounded-md border bg-white text-neutral-900 focus:outline-none ${
              replyError
                ? 'border-red-600'
                : 'border-neutral-400 focus:border-neutral-900'
            }`}
          />
          <Button type="submit" variant="primary" size="md">
            Invia
          </Button>
        </div>
      </form>
    </div>
  );
};
