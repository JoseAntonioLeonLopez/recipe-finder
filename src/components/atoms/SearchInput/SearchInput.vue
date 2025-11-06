<template>
  <div class="search-input">
    <label v-if="label" :for="id" class="search-input__label">{{ label }}</label>
    <input :id="id" :type="type" :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" @blur="handleBlur"
      :placeholder="placeholder" class="search-input__field" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

/**
 * Handles input sanitization and trimming on blur event.
 * This cleans the format and whitespace, complementing the API service's deeper sanitization.
 */
const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value.trim();

  // Basic format cleanup (replace multiple spaces with single space)
  value = value.replace(/\s+/g, ' ');

  // Update the model only if the value has changed after trimming/cleaning
  if (value !== props.modelValue) {
    emit('update:modelValue', value);
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/global.scss' as *;

/* BEM styles for Search Input Atom */
.search-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  &__label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  &__field {
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: $primary-400;
      box-shadow: $primary-700;
      outline: none;
    }
  }
}
</style>