const autocannon = require('autocannon');

async function runLoadTest() {
  console.log('🚀 Starting autocannon load test for http://localhost:3000');
  console.log('⏱️  Duration: 30 seconds');
  console.log('📊 Testing with 10 concurrent connections...\n');

  const result = await autocannon({
    url: 'http://localhost:3000',
    connections: 10, // Number of concurrent connections
    duration: 30, // Duration in seconds
    pipelining: 1, // Number of pipelined requests
    timeout: 10, // Request timeout in seconds
    headers: {
      'Content-Type': 'application/json',
    },
    // Optional: Add custom request body if needed
    // body: JSON.stringify({ test: 'data' }),
    // method: 'POST',
  });

  console.log('\n📈 Load Test Results:');
  console.log('====================');
  console.log(`Average Latency: ${result.latency.average}ms`);
  console.log(`P95 Latency: ${result.latency.p95}ms`);
  console.log(`P99 Latency: ${result.latency.p99}ms`);
  console.log(`Requests/sec: ${result.requests.average}`);
  console.log(`Total Requests: ${result.requests.total}`);
  console.log(`Total Duration: ${result.duration}s`);
  console.log(`Errors: ${result.errors}`);
  console.log(`Timeouts: ${result.timeouts}`);
  console.log(`Non-2xx Responses: ${result.non2xx}`);
}

// Handle errors gracefully
process.on('unhandledRejection', (err) => {
  console.error('❌ Error during load test:', err.message);
  process.exit(1);
});

// Run the load test
runLoadTest().catch((err) => {
  console.error('❌ Failed to run load test:', err.message);
  process.exit(1);
});

