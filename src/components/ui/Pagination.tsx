"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, perPage, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem', marginTop: '1.5rem', padding: '0.5rem 0' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '0.4rem',
          color: currentPage <= 1 ? 'var(--text-dim)' : 'var(--text-main)',
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          opacity: currentPage <= 1 ? 0.4 : 1,
        }}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} style={{ padding: '0 0.4rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            style={{
              background: currentPage === p ? 'var(--primary)' : 'transparent',
              border: currentPage === p ? '1px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.35rem 0.7rem',
              color: currentPage === p ? 'white' : 'var(--text-main)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: currentPage === p ? 600 : 400,
              minWidth: '32px',
              transition: 'all 0.15s',
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '0.4rem',
          color: currentPage >= totalPages ? 'var(--text-dim)' : 'var(--text-main)',
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          opacity: currentPage >= totalPages ? 0.4 : 1,
        }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
