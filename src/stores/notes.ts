import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { INote } from '../types/note';

export const useNoteStore = defineStore('note', () => {
  const notes = ref([] as INote[]);
  const note = ref({} as INote);

  function GetAllNotes() {
    const notesFromLocalStorage = localStorage.getItem('notes');
    if (notesFromLocalStorage) {
      notes.value = JSON.parse(notesFromLocalStorage);
    }
  }

  function AddNewNote(newNote: INote) {
    notes.value.unshift(newNote);
    note.value = newNote;
    localStorage.setItem('notes', JSON.stringify(notes.value));
  }

  function UpdateNote(id: number, updatedNote: INote) {
    const index = notes.value.findIndex((note) => note.id === id);
    if (index !== -1) {
      notes.value[index] = updatedNote;
    }
    notes.value.splice(index, 1);
    notes.value.unshift(updatedNote);
    localStorage.setItem('notes', JSON.stringify(notes.value));
  }

  function DeleteNote(id: number) {
    const index = notes.value.findIndex((note) => note.id === id);
    if (index !== -1) {
      notes.value.splice(index, 1);
      note.value = {} as INote;
    }
    localStorage.setItem('notes', JSON.stringify(notes.value));
  }

  function SearchNotes(query: string) {
    if (query === '') return [];
    query = query.toLowerCase();
    return notes.value.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }

  return {
    note,
    notes,
    AddNewNote,
    UpdateNote,
    DeleteNote,
    GetAllNotes,
    SearchNotes,
  };
});
