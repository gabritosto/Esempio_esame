import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { getZoneName } from '../data/mockData';
import { BoardPost, ZoneData, ZoneId } from '../types';

interface BoardScreenProps {
  posts: BoardPost[];
  zones: ZoneData[];
  onToggleLike: (postId: string) => void;
  onOpenPost: (postId: string) => void;
  onOpenNewPost: (preselectedZone?: ZoneId) => void;
}

export const BoardScreen: React.FC<BoardScreenProps> = ({
  posts,
  zones,
  onToggleLike,
  onOpenPost,
  onOpenNewPost,
}) => {
  const [zoneFilter, setZoneFilter] = useState<'all' | ZoneId>('all');

  const filteredPosts =
    zoneFilter === 'all'
      ? posts
      : posts.filter((p) => p.zoneId === zoneFilter);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <Header
        title="Bacheca anonima"
        rightSlot={
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              onOpenNewPost(zoneFilter === 'all' ? undefined : zoneFilter)
            }
          >
            Nuovo post
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto wireframe-scroll px-4 py-4 flex flex-col gap-4">
        {/* Zone Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
          <Chip
            label="Tutte"
            selected={zoneFilter === 'all'}
            onClick={() => setZoneFilter('all')}
          />
          {zones.map((z) => (
            <Chip
              key={z.id}
              label={z.name}
              selected={zoneFilter === z.id}
              onClick={() => setZoneFilter(z.id)}
            />
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <EmptyState
            title="Nessun post in questa zona"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
            primaryLabel="Scrivi il primo post"
            onPrimary={() =>
              onOpenNewPost(zoneFilter === 'all' ? undefined : zoneFilter)
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">
                      {post.anonymous ? 'Anonimo' : post.author}
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="border border-neutral-400 px-1.5 py-0.5 text-[11px] rounded text-neutral-800">
                      {getZoneName(zones, post.zoneId)}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    {post.timestamp}
                  </span>
                </div>

                <p className="text-sm text-neutral-900 leading-relaxed">
                  {post.text}
                </p>

                <div className="flex items-center gap-2 pt-1 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => onToggleLike(post.id)}
                    aria-pressed={post.likedByMe}
                    className={`min-h-[44px] px-3 rounded border text-xs font-medium cursor-pointer ${
                      post.likedByMe
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-900 border-neutral-400 hover:border-neutral-900'
                    }`}
                  >
                    Mi piace ({post.likes})
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenPost(post.id)}
                    className="min-h-[44px] px-3 rounded border border-neutral-400 bg-white text-neutral-900 text-xs font-medium hover:border-neutral-900 cursor-pointer"
                  >
                    Rispondi ({post.replies.length})
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
