import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { INote } from '../types/note';
import axios from 'axios';

export const useNoteStore = defineStore('note', () => {
  const notes = ref([] as INote[]);
  const note = ref({} as INote);

  async function GetAllNotes() {
    try {
      const res = await axios.get('/api/note');
      notes.value = res.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  async function AddNewNote(newNote: INote) {
    try {
      await axios.post('/api/note', newNote);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
    notes.value.unshift(newNote);
    note.value = newNote;
  }

  async function UpdateNote(id: number, updatedNote: INote) {
    try {
      await axios.put('/api/note/' + id, updatedNote);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
    GetAllNotes();
  }

  async function DeleteNote(id: number) {
    try {
      await axios.delete('/api/note/' + id);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
    const index = notes.value.findIndex((note) => note.id === id);
    if (index !== -1) {
      notes.value.splice(index, 1);
      note.value = {} as INote;
    }
  }

  function SearchNotes(query: string) {
    if (query === '') return [];
    query = query.toLowerCase();
    return notes.value.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
    );
  }

  function SortNotesByDate(type: string) {
    if (type === 'asc') {
      return notes.value.sort((a, b) => {
        return (
          new Date(a.created_at ?? 0).getTime() -
          new Date(b.created_at ?? 0).getTime()
        );
      });
    } else if (type === 'desc') {
      notes.value.sort((a, b) => {
        return (
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
        );
      });
    }
  }

  return {
    note,
    notes,
    AddNewNote,
    UpdateNote,
    DeleteNote,
    GetAllNotes,
    SearchNotes,
    SortNotesByDate,
  };
});
