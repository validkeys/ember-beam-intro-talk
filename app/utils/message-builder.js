
export function buildMessage(data) {
  let id    = data.id || faker.random.number();
  let imgId = 350 + id;
  let def = {
      id:     faker.random.number(),
      body:   faker.lorem.sentence(),
      avatar: "http://lorempixel.com/people/400/" + imgId,
      name:   faker.name.firstName(),
      date:   faker.date.recent()
    }
  return _.extend(def, data);
}

export function generateMessages(numMessages = 10) {
  let messages = Ember.A([]);
  for (var i = 1; i <= numMessages; i++) {
    messages.pushObject(buildMessage({id: i}))
  };
  return messages;
}