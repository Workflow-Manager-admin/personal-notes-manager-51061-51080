import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

/**
 * Color scheme:
 * --primary: #1976d2 (main), --secondary: #424242, --accent: #ff9800
 */

/**
 * PUBLIC_INTERFACE
 * App main entrypoint. Renders sidebar, header, and main note area.
 * Provides add/edit/delete/view functionality for notes with Supabase integration.
 */
function App() {
  // Application state
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null); // id of selected note
  const [isEditing, setIsEditing] = useState(false); // editing mode
  const [loading, setLoading] = useState(true);

  // Note input states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Fetch notes from Supabase
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  async function fetchNotes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) {
      alert("Failed to fetch notes.");
      setNotes([]);
    } else {
      setNotes(data);
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  async function handleAddNote(e) {
    e.preventDefault();
    // Supabase schema: 'user_id', 'title', and 'content' are required and NOT NULL.
    // TODO: Replace the 'user_id' logic below with real auth/user id when implementing authentication.
    const DUMMY_USER_ID = 1; // Use a constant for now, but this must match a valid user in DB if foreign key exists.
    if (!newTitle.trim()) {
      alert("Title is required.");
      return;
    }
    if (!newContent.trim()) {
      alert("Content is required.");
      return;
    }
    const { data, error } = await supabase
      .from('notes')
      .insert([{ 
        user_id: DUMMY_USER_ID, 
        title: newTitle, 
        content: newContent 
      }])
      .select();
    if (error) {
      alert("Failed to add note. " + (error.message || ""));
    } else if (data && data.length > 0) {
      setNotes([data[0], ...notes]);
      setSelectedId(data[0].id);
      setIsEditing(false);
      setNewTitle('');
      setNewContent('');
    }
  }

  // PUBLIC_INTERFACE
  function handleSelectNote(id) {
    setSelectedId(id);
    setIsEditing(false);
    const note = notes.find(n => n.id === id);
    // Prefill edit fields just in case
    setNewTitle(note ? note.title : '');
    setNewContent(note ? note.content : '');
  }

  // PUBLIC_INTERFACE
  function handleStartEdit() {
    const note = notes.find(n => n.id === selectedId);
    setNewTitle(note?.title ?? '');
    setNewContent(note?.content ?? '');
    setIsEditing(true);
  }

  // PUBLIC_INTERFACE
  async function handleSaveEdit(e) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('notes')
      .update({ title: newTitle, content: newContent })
      .eq('id', selectedId)
      .select();
    if (error) {
      alert("Failed to update note.");
    } else if (data && data.length > 0) {
      // Replace updated note in list
      setNotes(notes =>
        notes.map(n => (n.id === selectedId ? { ...n, ...data[0] } : n))
      );
      setIsEditing(false);
    }
  }

  // PUBLIC_INTERFACE
  async function handleDeleteNote(id) {
    if (!window.confirm('Delete this note?')) return;
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    if (error) {
      alert("Failed to delete note.");
    } else {
      setNotes(notes => notes.filter(n => n.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setIsEditing(false);
      }
    }
  }

  // PUBLIC_INTERFACE
  function handleNewNoteClick() {
    setSelectedId(null);
    setIsEditing(true);
    setNewTitle('');
    setNewContent('');
  }

  // PUBLIC_INTERFACE
  function handleCancelEdit() {
    setIsEditing(false);
    setNewTitle('');
    setNewContent('');
  }

  // Find the currently selected note (if not creating new)
  const selectedNote = notes.find(n => n.id === selectedId);

  return (
    <div className="app-root">
      <header className="app-header-bar">
        <span className="app-title">Notes Manager</span>
      </header>
      <div className="app-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <button
            className="accent-btn newnote-btn"
            onClick={handleNewNoteClick}
          >
            + New Note
          </button>
          {loading ? (
            <div className="sidebar-loading">Loading notes...</div>
          ) : (
            <ul className="notes-list">
              {notes.length === 0 ? (
                <li className="notes-list-empty">No notes</li>
              ) : (
                notes.map(note => (
                  <li
                    key={note.id}
                    className={`notes-list-item${note.id === selectedId ? ' selected' : ''}`}
                    onClick={() => handleSelectNote(note.id)}
                  >
                    <span className="note-title">{note.title || <em>(Untitled)</em>}</span>
                    <button
                      className="delete-btn"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      title="Delete"
                    >🗑️</button>
                  </li>
                ))
              )}
            </ul>
          )}
        </aside>
        {/* Main area */}
        <main className="main-area">
          {isEditing ? (
            <form
              className="note-form"
              onSubmit={selectedId ? handleSaveEdit : handleAddNote}
              autoComplete="off"
            >
              <input
                type="text"
                className="note-title-input"
                placeholder="Title"
                maxLength={100}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
              <textarea
                className="note-content-input"
                placeholder="Content"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={12}
              />
              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-btn"
                >{selectedId ? "Save" : "Add"}</button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleCancelEdit}
                >Cancel</button>
              </div>
            </form>
          ) : selectedNote ? (
            <div className="note-view">
              <h2 className="note-view-title">{selectedNote.title}</h2>
              <div className="note-view-content">
                {selectedNote.content
                  ? selectedNote.content.split('\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))
                  : <span className="muted">No content</span>}
              </div>
              <div className="view-actions">
                <button
                  className="primary-btn"
                  onClick={handleStartEdit}
                >Edit</button>
                <button
                  className="secondary-btn"
                  onClick={() => setSelectedId(null)}
                >Close</button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <span>Select a note or create a new one.</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
