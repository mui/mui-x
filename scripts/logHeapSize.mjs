import v8 from 'v8';

// eslint-disable-next-line no-console
console.log('Current heap size:', v8.getHeapStatistics().total_available_size / 1024 / 1024, 'MB');
