<template>
  <div class="relative">
    <div
      class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
    >
      <svg
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>
    <input
      v-model="query"
      type="search"
      id="default-search"
      class="block w-full p-2 ps-9 max-md:text-xs focus:outline-none text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
      placeholder="Search Notes..."
      required
    />
    <div
      class="absolute z-20 top-9 overflow-auto max-h-[50vh] w-full"
      v-if="searchedNotes.length"
    >
      <ul>
        <li
          v-for="note in searchedNotes"
          @click="
            query = '';
            selectNote(note);
          "
          class="flex justify-between items-center p-2 bg-amber-300 hover:bg-amber-100 rounded-md mt-1 cursor-pointer"
          :class="{ border: store.note.id === note.id }"
        >
          <span class="font-semibold">{{ note.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from '@/stores/notes';
import type { INote } from '@/types/note';
import { ref, watch, type Ref } from 'vue';

const store = useNoteStore();

const props = defineProps<{
  selectNote: Function;
}>();

const query = ref('');
const searchedNotes = ref([]) as Ref<INote[]>;

watch(query, (newQuery) => {
  searchedNotes.value = store.SearchNotes(newQuery);
});
</script>

<style scoped></style>
