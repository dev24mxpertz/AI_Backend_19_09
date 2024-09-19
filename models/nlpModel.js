const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], forceNER: true });

// Adds an example for the intent 'greetings.hello'
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'hey', 'greetings.hello');
manager.addDocument('en','hello','greeting')
manager.addDocument('en','hii','greeting')
manager.addDocument('en','hey you','greeting')
manager.addDocument('en','yo','greeting')
manager.addDocument('en','good morning','greeting')
manager.addDocument('en','good afternoon','greeting')
manager.addDocument('en','good day','greeting')

// Adds an example for the intent 'greetings.bye'
manager.addDocument('en', 'bye', 'greetings.bye');
manager.addDocument('en', 'goodbye', 'greetings.bye');
manager.addDocument('en', 'see you', 'greetings.bye');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Hello!');
manager.addAnswer('en', 'greetings.bye', 'Goodbye!');
manager.addAnswer('en', 'greetings.bye', 'See you!');

// Define responses for the intents

manager.addAnswer('en','greeting','Hey');
manager.addAnswer('en','greeting','Hey there');
manager.addAnswer('en','good morning','greeting')
manager.addAnswer('en','greeting','Hi');
manager.addAnswer('en','greeting','yo whatsup');

async function trainAndSave() {
    await manager.train();
    manager.save();
    console.log("Training complete and model saved.");
}

// Train and save the model
trainAndSave();

module.exports = manager;