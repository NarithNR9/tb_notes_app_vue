<template>
  <div class="shadow-lg shadow-gray-800 rounded-md mx-6 md:mx-[10vw] my-[5vh]">
    <div
      class="bg-blue-500 h-[10vh] rounded-t-md text-white px-6 py-3 flex justify-between items-center"
    >
      <div class="md:text-2xl font-bold">Notes Application</div>
      <Search :selectNote="selectNote" />
    </div>
    <div class="grid grid-cols-12 h-[80vh] rounded-b-md">
      <div
        id="note-list"
        class="col-span-12 md:col-span-4 p-6 bg-amber-200 rounded-bl-md"
      >
        <div class="flex justify-between">
          <div
            class="flex items-center space-x-1 cursor-pointer"
            @click="
              sort = sort === 'asc' ? 'desc' : 'asc';
              store.SortNotesByDate(sort);
            "
          >
            <h2 class="text-xl font-semibold">All Notes</h2>
            <IconsSort class="w-4 h-4" :sort="sort" />
          </div>
          <div class="flex space-x-3">
            <IconsDelete
              class="w-6 h-6 cursor-pointer"
              v-if="store.note.id"
              @click="
                store.DeleteNote(store.note.id);
                formData.title = '';
                formData.content = '';
              "
            />
            <IconsPlus
              class="w-6 h-6 cursor-pointer"
              @click="
                switchNoteView();
                store.note = {} as INote;
                formData.title = '';
                formData.content = '';
              "
            />
          </div>
        </div>
        <div v-if="store.notes.length > 0" class="overflow-auto max-h-[70vh]">
          <ul>
            <li
              v-for="note in store.notes"
              @click="selectNote(note)"
              class="flex justify-between items-center p-2 bg-yellow-50 hover:bg-amber-100 rounded-md mt-3 cursor-pointer"
              :class="{ border: store.note.id === note.id }"
            >
              <span class="font-semibold">{{ note.title }}</span>
              <span class="text-xs">{{
                note.created_at
                  ? new Date(note.created_at).toLocaleDateString('en-GB')
                  : ''
              }}</span>
            </li>
          </ul>
        </div>
        <div v-else class="text-center text-xl my-32">
          Currently No Note ...
        </div>
      </div>
      <div
        id="note-form"
        class="hidden md:block col-span-12 md:col-span-8 relative bg-yellow-50 rounded-br-md p-6 cursor-"
      >
        <div
          class="absolute left-3 top-1 underline md:hidden"
          @click="switchNoteView"
        >
          < Back
        </div>
        <div
          class="absolute right-3 top-1 underline md:hidden"
          @click="switchNoteView"
        >
          <IconsDelete
            class="w-6 h-6 cursor-pointer"
            v-if="store.note.id"
            @click="
              store.DeleteNote(store.note!.id);
              formData.title = '';
              formData.content = '';
            "
          />
        </div>
        <div
          class="absolute top-0 flevx w-full text-center text-xs text-gray-600"
          v-if="store.note.updated_at"
        >
          Updated At: {{ timeAgo(store.note.updated_at) }}
        </div>
        <form @submit.prevent="handleAddNewNote">
          <input
            v-model="formData.title"
            type="text"
            name=""
            id=""
            required
            class="w-full focus:outline-none font-semibold text-xl max-md:mt-6"
            placeholder="Note Title*"
          />
          <hr />
          <textarea
            v-model="formData.content"
            name=""
            id=""
            cols="30"
            rows="15"
            class="w-full mt-3 resize-none focus:outline-none"
            placeholder=""
          ></textarea>
          <button
            class="absolute bottom-0 right-0 p-3 rounded-full bg-blue-500 m-6 shadow-xl cursor-pointer"
            type="submit"
          >
            <IconsSave @click="switchNoteView" class="w-6 h-6" type="submit" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconsSave from '../components/icons/Save.vue';
import IconsSort from '../components/icons/Sort.vue';
import IconsDelete from '../components/icons/Delete.vue';
import IconsPlus from '../components/icons/Plus.vue';
import { useNoteStore } from '@/stores/notes';
import { onMounted, ref } from 'vue';
import type { INote } from '@/types/note';
import Search from '../components/Search.vue';

const store = useNoteStore();

const sort = ref('');
const formData = ref({
  title: '',
  content: '',
});

const handleAddNewNote = () => {
  if (store.note.id) {
    store.UpdateNote(store.note.id, {
      title: formData.value.title,
      content: formData.value.content,
    });
  } else {
    store.AddNewNote({
      title: formData.value.title,
      content: formData.value.content,
    });
  }
};

const switchNoteView = () => {
  // for mobile view changes note-list and note-form visibility
  if (window.matchMedia('(max-width: 768px)').matches) {
    document.getElementById('note-list')?.classList.toggle('hidden');
    document.getElementById('note-form')?.classList.toggle('hidden');
  }
};

const selectNote = (note: INote) => {
  switchNoteView();
  store.note = note;
  formData.value.title = note.title;
  formData.value.content = note.content || '';
};

function timeAgo(date: Date) {
  const now = new Date();
  const updatedDate = new Date(date);

  // Adjust for UTC+7 timezone (subtract 7 hours from UTC time)
  updatedDate.setHours(updatedDate.getHours() + 7);

  const diffInSeconds = Math.floor(
    ((now as any) - (updatedDate as any)) / 1000
  );

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

onMounted(() => {
  store.GetAllNotes();
});
</script>

<style scoped></style>
