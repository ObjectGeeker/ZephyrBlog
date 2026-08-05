<script setup lang="ts">
import { ref, computed } from 'vue'
import { data as categories } from '../posts.data'

const activeKey = ref(categories[0]?.key ?? '')

const activeCategory = computed(
  () => categories.find((c) => c.key === activeKey.value) ?? categories[0],
)
</script>

<template>
  <section class="home-categories">
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.key"
        type="button"
        class="category-tab"
        :class="{ active: cat.key === activeKey }"
        @click="activeKey = cat.key"
      >
        {{ cat.title }}
      </button>
    </div>

    <div v-if="activeCategory.posts.length" class="post-grid">
      <a
        v-for="post in activeCategory.posts"
        :key="post.url"
        class="post-card"
        :href="post.url"
      >
        <h3 class="post-card-title">{{ post.title }}</h3>
        <p class="post-card-desc">{{ post.description }}</p>
        <div class="post-card-meta">
          <span class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">{{
              tag
            }}</span>
          </span>
          <span class="post-date">{{ post.date }}</span>
        </div>
      </a>
    </div>
    <p v-else class="post-empty">暂无文章</p>
  </section>
</template>
