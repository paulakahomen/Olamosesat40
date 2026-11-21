import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Section } from '../layout/Section';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import './Wishes.css';

type Wish = {
  id: string;
  name: string;
  wish: string;
  created_at: string;
};

type LoadState = 'loading' | 'ready' | 'error';

const NAME_MAX = 60;
const WISH_MAX = 400;

/**
 * Birthday wishes wall: name + wish, stored in Supabase and streamed back in
 * through Realtime. Wishes are shown as a loose, floating note wall.
 */
export function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loadState, setLoadState] = useState<LoadState>(
    isSupabaseConfigured ? 'loading' : 'error',
  );
  const [name, setName] = useState('');
  const [wish, setWish] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [activeWish, setActiveWish] = useState<Wish | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /* Initial load + live inserts. */
  useEffect(() => {
    if (!supabase) return undefined;
    const client = supabase;
    let cancelled = false;

    const load = async () => {
      const { data, error } = await client
        .from('wishes')
        .select('id, name, wish, created_at')
        .order('created_at', { ascending: false })
        .limit(200);

      if (cancelled) return;
      if (error) {
        setLoadState('error');
        return;
      }
      setWishes((data ?? []) as Wish[]);
      setLoadState('ready');
    };

    void load();

    const channel = client
      .channel('wishes-wall')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'wishes' },
        (payload) => {
          const row = payload.new as Wish;
          if (!row?.id) return;
          setWishes((current) =>
            current.some((item) => item.id === row.id)
              ? current
              : [row, ...current],
          );
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase?.removeChannel(channel);
    };
  }, []);

  /* Modal: escape to close, lock page scroll, focus the close button. */
  useEffect(() => {
    if (!activeWish) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveWish(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeWish]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || submitting) return;

    const trimmedName = name.trim();
    const trimmedWish = wish.trim();

    if (!trimmedName || !trimmedWish) {
      setFeedback({
        type: 'error',
        message: 'Please add your name and a birthday wish.',
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const { data, error } = await supabase
      .from('wishes')
      .insert({ name: trimmedName, wish: trimmedWish })
      .select('id, name, wish, created_at')
      .single();

    setSubmitting(false);

    if (error || !data) {
      setFeedback({
        type: 'error',
        message: 'Your wish could not be sent. Please try again.',
      });
      return;
    }

    const saved = data as Wish;
    setWishes((current) =>
      current.some((item) => item.id === saved.id) ? current : [saved, ...current],
    );
    setName('');
    setWish('');
    setFeedback({
      type: 'success',
      message: 'Thank you — your wish is now on the wall.',
    });
  };

  const canSubmit =
    isSupabaseConfigured && !submitting && name.trim() && wish.trim();

  return (
    <Section
      id="wishes"
      eyebrow="03 — Birthday Wishes"
      title="Make his fortieth unforgettable."
      description="Share a message, a memory, or a few words to celebrate Olamoses. Every note becomes part of his wall."
      tone="default"
    >
      <div className="wishes">
        {!isSupabaseConfigured && (
          <p className="wishes__notice" role="status">
            The wishes wall is not connected yet. Add{' '}
            <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>{' '}
            to your <code>.env.local</code> to enable submissions.
          </p>
        )}

        <form className="wishes__form" onSubmit={handleSubmit} noValidate>
          <div className="wishes__fields">
            <label className="wishes__field">
              <span className="wishes__label">Your name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                maxLength={NAME_MAX}
                placeholder="Anonymous"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={!isSupabaseConfigured || submitting}
                required
              />
            </label>

            <label className="wishes__field">
              <span className="wishes__label">Your message</span>
              <textarea
                name="wish"
                rows={3}
                maxLength={WISH_MAX}
                placeholder="Happy fortieth — may the next forty be your best yet."
                value={wish}
                onChange={(event) => setWish(event.target.value)}
                disabled={!isSupabaseConfigured || submitting}
                required
              />
            </label>
          </div>

          <div className="wishes__actions">
            <button
              className="wishes__submit"
              type="submit"
              disabled={!canSubmit}
            >
              {submitting ? 'Sending…' : 'Send your wish'}
            </button>
            <p
              className="wishes__feedback"
              role="status"
              aria-live="polite"
              data-tone={feedback?.type ?? 'idle'}
            >
              {feedback?.message ?? ''}
            </p>
          </div>
        </form>

        <div className="wishes__wall" aria-busy={loadState === 'loading'}>
          {loadState === 'loading' && (
            <div className="wishes__skeletons" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          )}

          {loadState === 'loading' && (
            <p className="wishes__status visually-hidden">Gathering wishes…</p>
          )}

          {loadState === 'error' && isSupabaseConfigured && (
            <p className="wishes__status">
              Wishes could not be loaded right now. Please try again later.
            </p>
          )}

          {loadState === 'ready' && wishes.length === 0 && (
            <p className="wishes__status">
              No wishes yet — be the first to leave one.
            </p>
          )}

          {wishes.length > 0 && (
            <ul className="wishes__notes" role="list">
              {wishes.map((item, index) => (
                <li
                  key={item.id}
                  className="wishes__note"
                  data-variant={index % 5}
                >
                  <button
                    type="button"
                    className="wishes__note-button"
                    onClick={() => setActiveWish(item)}
                  >
                    <span className="wishes__note-text">{item.wish}</span>
                    <span className="wishes__note-name">
                      <span className="wishes__note-avatar" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                          <circle cx="12" cy="8" r="3.6" />
                          <path d="M4.8 20.2a7.6 7.6 0 0 1 14.4 0" />
                        </svg>
                      </span>
                      {item.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {activeWish && (
        <div
          className="wishes__overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveWish(null);
          }}
        >
          <div
            className="wishes__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wish-modal-title"
          >
            <p className="eyebrow">A birthday wish</p>
            <p id="wish-modal-title" className="wishes__modal-text">
              {activeWish.wish}
            </p>
            <p className="wishes__modal-name">— {activeWish.name}</p>
            <button
              ref={closeButtonRef}
              type="button"
              className="wishes__modal-close"
              onClick={() => setActiveWish(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
