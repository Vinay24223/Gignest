import React, { useState } from 'react';
import { useGigNest } from '../context/GigNestContext';
import { GIG_CATEGORIES, PAY_TYPES, CAT_ICONS } from '../data/initialData';

export default function ExploreView() {
  const {
    activeGigs,
    getEmployerForGig,
    savedGigIds,
    toggleSave,
    navigate,
  } = useGigNest();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPayType, setSelectedPayType] = useState('');
  const [sortBy, setSortBy] = useState('new');

  // Filter gigs
  let filtered = activeGigs.filter(g => {
    const employer = getEmployerForGig(g);
    const textMatch =
      !query ||
      g.title.toLowerCase().includes(query.toLowerCase()) ||
      g.description.toLowerCase().includes(query.toLowerCase()) ||
      g.area.toLowerCase().includes(query.toLowerCase()) ||
      (employer && employer.business_name.toLowerCase().includes(query.toLowerCase()));

    const catMatch = !selectedCategory || g.category === selectedCategory;
    const payMatch = !selectedPayType || g.pay_type === selectedPayType;

    return textMatch && catMatch && payMatch;
  });

  // Sort gigs
  filtered.sort((a, b) => {
    if (sortBy === 'new') return b.id - a.id;
    if (sortBy === 'spots') return b.openings - a.openings;
    if (sortBy === 'soon') return new Date(a.end_date) - new Date(b.end_date);
    return 0;
  });

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedPayType('');
    setSortBy('new');
  };

  return (
    <div className="wrap">
      <div className="page-top">
        <div className="kicker">Explore</div>
        <h1>Find work that fits your week</h1>

        <div className="searchbar" style={{ boxShadow: 'var(--shadow)', maxWidth: '700px', marginTop: '18px' }}>
          <input
            type="text"
            placeholder="Search by role, shop, area, or skill..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 0, padding: '0 12px', cursor: 'pointer', fontSize: '18px' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="explore" style={{ marginTop: '24px' }}>
        {/* Sidebar Filters */}
        <aside className="filters">
          <h4>Category</h4>
          <button
            className={`opt ${!selectedCategory ? 'on' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            <span>All categories</span>
            <small>{activeGigs.length}</small>
          </button>
          {GIG_CATEGORIES.map(cat => {
            const count = activeGigs.filter(g => g.category === cat).length;
            return (
              <button
                key={cat}
                className={`opt ${selectedCategory === cat ? 'on' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              >
                <span>{CAT_ICONS[cat] || '💼'} {cat}</span>
                <small>{count}</small>
              </button>
            );
          })}

          <h4>Pay type</h4>
          <button
            className={`opt ${!selectedPayType ? 'on' : ''}`}
            onClick={() => setSelectedPayType('')}
          >
            <span>All pay types</span>
          </button>
          {Object.entries(PAY_TYPES).map(([typeKey, label]) => (
            <button
              key={typeKey}
              className={`opt ${selectedPayType === typeKey ? 'on' : ''}`}
              onClick={() => setSelectedPayType(selectedPayType === typeKey ? '' : typeKey)}
            >
              <span>{label.replace('/', 'Per ')}</span>
            </button>
          ))}

          {(selectedCategory || selectedPayType || query) && (
            <button
              className="btn btn-ghost btn-sm btn-block"
              style={{ marginTop: '20px' }}
              onClick={clearFilters}
            >
              Reset filters
            </button>
          )}
        </aside>

        {/* Results List */}
        <main>
          <div className="results-bar">
            <div>
              <strong>{filtered.length}</strong> {filtered.length === 1 ? 'gig' : 'gigs'} available
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: 'auto', marginBottom: 0, padding: '6px 12px', fontSize: '13px' }}
              >
                <option value="new">Newest first</option>
                <option value="spots">Most openings</option>
                <option value="soon">Closing soon</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <h3>No gigs matched your criteria</h3>
              <p className="muted">Try adjusting your search terms or resetting filters.</p>
              <button className="btn btn-violet btn-sm" onClick={clearFilters}>
                Clear all filters
              </button>
            </div>
          ) : (
            filtered.map(gig => {
              const employer = getEmployerForGig(gig);
              const isSaved = savedGigIds.includes(gig.id);
              const payLabel = `₹${gig.pay_amount.toLocaleString('en-IN')} ${PAY_TYPES[gig.pay_type] || gig.pay_type}`;
              const cleanCatClass = `c-${gig.category.replace(/\s+/g, '')}`;

              return (
                <div key={gig.id} className="listrow">
                  <div className={`ic ${cleanCatClass}`}>
                    {CAT_ICONS[gig.category] || '💼'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="pill verified" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        ✔ Verified
                      </span>
                      <span className="muted" style={{ fontSize: '12px' }}>
                        {gig.category}
                      </span>
                    </div>

                    <h3>
                      <span
                        style={{ cursor: 'pointer', color: 'var(--ink)' }}
                        onClick={() => navigate('view', gig.id)}
                      >
                        {gig.title}
                      </span>
                    </h3>

                    <div className="meta">
                      <strong>{employer?.business_name || 'Business'}</strong> · 📍 {gig.area} · ⏱️ {gig.schedule}
                    </div>
                  </div>

                  <div className="right">
                    <div className="pay">{payLabel}</div>
                    <div className="muted" style={{ fontSize: '12px', marginBottom: '8px' }}>
                      {gig.openings} opening{gig.openings > 1 ? 's' : ''}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <button
                        className="save-btn"
                        onClick={() => toggleSave(gig.id)}
                        title={isSaved ? 'Remove from saved' : 'Save gig'}
                      >
                        {isSaved ? '❤️' : '🤍'}
                      </button>
                      <button
                        className="btn btn-ink btn-sm"
                        onClick={() => navigate('view', gig.id)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}

