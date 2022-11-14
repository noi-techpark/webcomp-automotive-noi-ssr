<template>
  <div>
    <WebComponent />
  </div>
</template>

<script>
import WebComponent from '@/components/bundle/WebComponent';
import vueI18n from '@/plugins/vueI18n';

export default {
  i18n: vueI18n,
  components: { WebComponent }
};
</script>
