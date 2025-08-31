const client = require('./client');

async function init(){
    // await client.set("msg:6", "Hello World 6");
    // await client.expire("msg:6", 20); // expire in 20 seconds
    const result = await client.get('msg:6');
    console.log("result: "+ result);
}
init();