import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, Mail, MailOpen, Reply, Search, Trash2 } from 'lucide-react';
import { api } from '../services/api';

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
};

const getGmailReplyUrl = (message) => {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: message.email,
    su: `Re: ${message.subject || 'Portfolio inquiry'}`
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
};

export const ManageMessages = () => {
  const { setUnreadCount } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAdminMessages();
      setMessages(data);
      setUnreadCount(data.filter(message => !message.read).length);
      setSelectedId(current => data.some(message => (message.id || message._id) === current)
        ? current
        : (data[0]?.id || data[0]?._id || null));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMessages(); }, []);

  const visibleMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return messages.filter(message => {
      const matchesStatus = filter === 'all' || (filter === 'unread' ? !message.read : message.read);
      const matchesSearch = !query
        || [message.name, message.email, message.subject, message.message]
          .some(value => value?.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [messages, filter, search]);

  const selectedMessage = messages.find(message => (message.id || message._id) === selectedId) || null;
  const unreadCount = messages.filter(message => !message.read).length;

  const handleToggleRead = async (message) => {
    const id = message.id || message._id;
    const read = !message.read;
    setBusyId(id);
    setError('');
    setNotice('');
    try {
      await api.markMessageRead(id, read);
      const updatedMessages = messages.map(item => (item.id || item._id) === id ? { ...item, read } : item);
      setMessages(updatedMessages);
      setUnreadCount(updatedMessages.filter(item => !item.read).length);
      setNotice(read ? 'Inquiry marked as read.' : 'Inquiry marked as unread.');
    } catch (requestError) {
      setError(`Could not update inquiry: ${requestError.message}`);
    } finally {
      setBusyId(null);
    }
  };

  const handleSelectMessage = (message) => {
    setSelectedId(message.id || message._id);
    if (!message.read && busyId !== (message.id || message._id)) {
      handleToggleRead(message);
    }
  };

  const handleDelete = async (message) => {
    const id = message.id || message._id;
    if (!window.confirm(`Permanently delete the inquiry from ${message.name || 'this sender'}?`)) return;
    setBusyId(id);
    setError('');
    setNotice('');
    try {
      await api.deleteMessage(id);
      const remaining = messages.filter(item => (item.id || item._id) !== id);
      setMessages(remaining);
      setUnreadCount(remaining.filter(item => !item.read).length);
      if (selectedId === id) setSelectedId(remaining[0]?.id || remaining[0]?._id || null);
      setNotice('Inquiry deleted.');
    } catch (requestError) {
      setError(`Could not delete inquiry: ${requestError.message}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-page">
      <section className="admin-welcome">
        <div>
          <span className="admin-eyebrow">Contact inbox · {unreadCount} unread</span>
          <h1>Messages & inquiries</h1>
          <p>Review and reply to people who contacted you through your portfolio.</p>
        </div>
      </section>

      {error && <div className="admin-alert error" role="alert"><span>{error}</span><button className="btn btn-sm btn-outline" onClick={loadMessages}>Retry</button></div>}
      {notice && <div className="admin-alert success" role="status"><CheckCircle2 size={17} />{notice}</div>}

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search sender, email, or message…" aria-label="Search messages" />
        </div>
        <select value={filter} onChange={event => setFilter(event.target.value)} aria-label="Filter message read status">
          <option value="all">All messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {loading ? (
        <section className="admin-panel admin-empty-state">Loading inquiries from the server…</section>
      ) : !messages.length ? (
        <section className="admin-panel admin-empty-state">
          <Mail size={28} />
          <h2>No inquiries yet</h2>
          <p>Messages submitted through your public contact form will appear here.</p>
        </section>
      ) : (
        <div className="admin-messages-grid">
          {visibleMessages.length ? (
            <section className="admin-panel admin-message-list" aria-label="Messages">
              {visibleMessages.map(message => {
                const id = message.id || message._id;
                return (
                  <button
                    type="button"
                    key={id}
                    className={`admin-message-item${!message.read ? ' unread' : ''}${selectedId === id ? ' selected' : ''}`}
                    onClick={() => handleSelectMessage(message)}
                    disabled={busyId === id}
                  >
                    <div className="admin-message-item-head">
                      <strong>
                        {message.name || 'Unknown sender'}
                        {!message.read && <span className="admin-message-unread-dot" aria-label="Unread message" title="Unread" />}
                      </strong>
                      <time>{formatDate(message.createdAt)}</time>
                    </div>
                    <h3>{message.subject || 'Portfolio inquiry'}</h3>
                    <p>{message.email}</p>
                    <p>{message.message}</p>
                  </button>
                );
              })}
            </section>
          ) : (
            <section className="admin-panel admin-empty-state">No messages match your search or filter.</section>
          )}

          {selectedMessage ? (
            <article className="admin-panel admin-message-details">
              <div className="admin-panel-heading">
                <div>
                  <span className={`admin-status ${selectedMessage.read ? 'read' : 'unread'}`}>
                    {selectedMessage.read ? 'Read' : 'Unread'}
                  </span>
                  <h2>{selectedMessage.subject || 'Portfolio inquiry'}</h2>
                </div>
                <span className="admin-stat-icon purple"><Mail size={18} /></span>
              </div>

              <div className="admin-message-meta">
                <span><strong>{selectedMessage.name}</strong></span>
                {selectedMessage.email
                  ? <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                  : <span>Email address unavailable</span>}
                <time>{formatDate(selectedMessage.createdAt)}</time>
              </div>

              <div className="admin-message-content">{selectedMessage.message}</div>

              <div className="admin-message-actions">
                {selectedMessage.email ? (
                  <a
                    href={getGmailReplyUrl(selectedMessage)}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Reply size={16} /> Reply in Gmail
                  </a>
                ) : (
                  <button className="btn btn-primary" type="button" disabled>
                    <Reply size={16} /> Sender email unavailable
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => handleToggleRead(selectedMessage)}
                  disabled={busyId === (selectedMessage.id || selectedMessage._id)}
                >
                  {selectedMessage.read ? <Mail size={16} /> : <MailOpen size={16} />}
                  Mark as {selectedMessage.read ? 'unread' : 'read'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => handleDelete(selectedMessage)}
                  disabled={busyId === (selectedMessage.id || selectedMessage._id)}
                  style={{ color: 'var(--status-error)' }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </article>
          ) : (
            <section className="admin-panel admin-empty-state">Choose an inquiry to read it.</section>
          )}
        </div>
      )}
    </div>
  );
};
