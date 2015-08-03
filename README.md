# ember-beam-intro-talk

Main Areas To Explore:
---

-> Slides on events and common problems
  -> different data going to different providers
  -> data normalization: different between providers
    ex. mixpanel might have user_id but then when we decided to add in keen tracking,
    we decided to send more data and ended up with: { user: { id: 1, name: "Kyle" } }
    This inconsistency starts becoming a problem down the road both for you the developer
    to explain what the data represents to other people in your company as well as when you
    eventually want to start writing your own data analsis packages that use the provider data
    as the basis
  -> formatting
    -> Some providers allow for nested JSON to be POSTed while others require flattened json payloads
  -> naming conventions
    You start out as Capitalized Keys, then some key is underscored, the another key is lowercase
  -> redundant code (adding the same data to each event)
    -> Increases events code footprint
    -> difficult when you need to change a key name (ex. user -> person). Have to find and replace
  -> unnecessary fields being sent
    -> You may be sending a user as part of your payload with a bunch of fields like "numPosts" that change all of the time and pollute your events.
  -> sanitization
    -> especially when you're working with prototyped objects (ember-data, jsData etc..) instead of POJO's, with methods, computed properties etc.., sending the complete object to certain providers can end up in a stack overflow.
  -> Event-adjacent methods start polluting your core code base.
    -> Let's say you built a simple messaging bus that allowed you to keep your code clean
    and centralize your event handling. Then you find out that not everything you want to track
    in a provider is an event. For example, when a user logs in you want to track the login. Then your
    product lead comes to you and say that each time a user logs in, we want to track the number of logins in that person's profile in mixpanel. Now you are either adding mixpanel.people.increment("logins") to your core code base or you are polluting your centralized and abstracted event handling code with provider specific code. If you decide to remove that provider, you then have to go to each place in your code and remove that provider specific code
-> Intro Beam
  -> Main Tenants
    -> one input, multiple outputs
      -> I should be able to add and start tracking all events for a new provider in < 5 minutes
    -> Input the data however you like, let the lib do the cleanup for you
    -> minimize core code footprint
      -> ensure that each event handler has access to the event's original context to allow for event hydration (adding additional objects to the event) to be handled outside of core code base
    -> enable extensibility for custom providers
    -> Allow each step in the event processing process to be opt-in (ex. transforms are optional)
    -> Allow for centralized place to handle event-adjacent code (like mixpanel.people.increment)
  -> Concept
    -> 
    -> There are six main concepts, the first we'll cover is the service
      (eventual concepts: Service, Adapters, Transforms, Sanitizers, Mappers (serializers?), Hooks)
      -> would be great to have a slide showing the flow of data but with only the service box and provider boxes readable at this point
  -> [Slide] install
  -> [Slide] common useage (using our app's code) this.get('Beam').push...

-> Show app

*NOTE*: set global keyFormat to false in the beginning

-> Already have one action setup and only our debug adapter:
  -> PageView
    -> Show event in code. This is how we use the service to track an event: push
    -> Show event coming out in debugger adapter.


ADAPTERS
    -> Slide on adapters. Adapters extend from the BeamBase adapter. They have a bunch of methods already built in for you, so creating a new adapter is really quick and easy.
      -> Main methods: setup, emit
    -> Create mixpanel adapter (just the setup and emit method)
      -> make sure to include the client() method and return mixpanel
      -> use keyCase: camelcase
      -> use flattenPayload: true
      -> "I'll explain these later"
    -> Now we can see events going out to mixpanel (fallback to console logging if no internet)

USER INFO

Different analytics providers give you means to track user's. Sort of like a CRM
  -> Show mixpanel methods (alias, identify, people.set)
  -> Show another one (KissMetrics?)
  -> They usually have a method when a new user is being added to your system (identify) and when an existing user is returning (alias). And then a method to set properties on that person (people.set)

-> Slide on: setCurrentUser and what that does

So let's update our mixpanel adapter and add an identify and alias method. These already exist in the BaseAdapter but just return Ember.K. Since these methods are already in the BaseAdapter, if a custom adapter you're building doesn't have user specific methods like this, just don't include them in your adapter -- and you won't break anything.

-> Login
  -> Set current user
  -> Show output from debug adapter
  -> Show user in mixpanel

Now we can see our new user in mixpanel, and then as we generate pageviews, we can see that pageview in the user's profile. However, I like to also attach my user data to each event for reporting etc..

Could add it as a property on our payload:

this.get('beam').push('Login', { user: this.get('currentUser') });

But that increases our code footprint and we'd have to do that everywhere (duplicate code).

Beam has a configuration option that allows me to do just that.
  -> Using config to set the currentUser on all events
  -> Now generate events and see the user data added to event

Now let's add an event for when a new post is created
  -> event name: "Post Created"

See in providers

Now add an event for when a post is edited
  -> event name: "Post Edited"

See in providers

-> Slide on best practice. (Thinking of events as Objects instead of POJOs). These should not be 2 separate event groups but rather one group (object) with attributes that allow us to decipher. So I typically name the event group something like: "Post Event" and then use an action and sometimes subAction property to tell me what action the user performed on said object.

So we could refactor our events to be:

this.get('Beam').push('Post Event', { action: "created" })
this.get('Beam').push('Post Event', { action: "updated" })

But our goal should be to minimize footprint within our core code. As we'll generally want to add more and more data to our events as time goes on. So now let's introduce the second concept:

TRANSFORMS

Transforms allow you to change the data before it goes out to the providers. Transforms are opt in.
-> Application Transforms
-> Provider transforms

Provider transforms take precedence over application transforms.

-> Create an application transform
-> Add the Post Created handler and Post Edited handler
  -> gets the eventPackage and the context as arguments. The transform method is called in the context of the adapter.
  -> Should return the eventPackage { eventName: "", payload: {} }
-> set transforms to return "Post Event" as the name and the proper action

-> Now we can see our clean events coming through in mixpanel

now let's move on to the next topic:

SANITIZATION

-> Add some nested arbitrary json to our post created event with different style keys:

```{
  "Is An Author": true,
  author: {
    numPosts: 12,
    user_id: 1,
    Profile: {
      url: "www.profile.com",
      IP_address: 123.123.123.123
    }
  }
}```

-> Create post
-> See dot syntax in mixpanel
-> See non-dot syntax in debug adapter

One of the original problems was data formatted differently in providers and leading to annoying problems down the road. When we created the mixpanel adapter, we added these sanitization options: keyCase and flattenpayload. KeyCase is a built in sanitizer that allows you to determine how you want the keys in your JSON payload to be formatted. Recursive, so all keys no matter the nesting level will be formatted as you subscribe. FlattenPayload is a convenience method built in. Mixpanel doesn't like nested JSON but other vendors do, like Keen. So flattenPayload is an option that will automatically reduce your nested JSON to dot syntax for that a particular providers payload. Right now I have keyCase to false -- which means it won't change the formatting of any of the data keys. Usually leads to untidy data, so globally set keyCase to camelcase. Now all of our data is nicely formatted for output. This can be done globally or at the provider level.

The adapter should have default sanitization options but doesn't need to. Since anyone can create a custom adapter and submit it to npm as an addon, you the developer need to be able to configure that adapter to your own tastes, which you can easily do in the beam config in your environment file

-> Compare debug adapter vs. mixpanel adapter payload. 

Sanitization is a powerful but annoying thing to setup, so the goal here was to build this in with the most common options. My preference is camelcase'd keys but you have the option of lowercase, uppercase, camelcase, capitalized or false (which will not format your keys).

So to recap the current flow of your data:

-> this.get('Beam').push("Event Name", {}, this);
-> Service the dynamically finds all adapters
-> Sends a cloned copy of the payload to the application transforms and provider specific transforms
-> Sanitizes each payload for each provider
-> Finally converts your transformed payload into a POJO
-> Calls the emit method on your adapter with the eventName and payload
-> The adapter's emit method then simply calls the provider specific methods to submit your data


MAPPINGS

Sometimes we're just going to pass in a few models to our payload but we don't necessarily always want each model property to go to our analytics provider -- but we also don't want to handle picking the keys for each model in our core code -- again, trying to maintain our events footprint. That's where mappings come in. Again, an opt-in thing and you are more than welcome to come up with your own strategy. Essentially, right before the emit method is called on your adapter, Beam calls a method called "runMappings". If you have specified a mappings property in your adapter, it will essentially look through each key in your payload and if it finds a mapping for that key in your mappings property, it picks only the attributes for that key that you specified in your mappings. This allows you to maintain consistent data structures as well as protect certain fields from being sent to 3rd party analytics providers. It's not event specific but rather, a generic mapping on payload keys. It doesn't traverse a nested payload right now, it only looks at the top level keys.

So let's add a quick mapping for our author field:

{
  mappings: {
    "author": ['numPosts','user_id']
  }
}

So now we can see that our event no longer includes the Profile data went sending to mixpanel.


Cool, so almost done. One thing that I'd like to track on a user profile in mixpanel is the number of posts a user has created as well as the number of posts they've edited. This isn't an event but something that occurs because of an event.

HOOKS

-> Slide On Hooks. Hooks can only be applied at the provider specific level. Once Beam has emitted your events, it will automatically check if you've specified any post-emit hooks for that event. If so, it calls them otherwise it moves on.

-> generate a hook file for mixpanel
-> The only thing here is an events property. So let's add a Hook for "Post Edited". Quick Note, While your transforms may change the formatting of your eventName or the eventName all together, Hooks and transforms should use the event name that you specify in your core code. Beam camelcases the lookup incase you accidentlly used a differently formatted key.

Now in our post edited, we're going to increment the number of posts edited. To try and keep adapter, hook and transform code as abstracted as possible, each adapter should has a method called this.client() should should return the provider's library.

```
this.client() //-> mixpanel
```
So now in our hook:

```
this.client().people.increment("posts edited");
```

And now we can see that new property in our mixpanel people properties.

Now add the Post Created

```
this.client().people.increment("posts created");
```

And now we can see that new property in our user again.

So to recap the flow of the data with hooks now;

-> this.get('Beam').push("Event Name", {}, this);
-> Service the dynamically finds all adapters
-> Sends a cloned copy of the payload to the application transforms and provider specific transforms
-> Sanitizes each payload for each provider
-> Finally converts your transformed payload into a POJO
-> Calls the emit method on your adapter with the eventName and payload
-> The adapter's emit method then simply calls the provider specific methods to submit your data
-> The adapter then checks to see if there's a hook for "Event Name" for that specific provider and calls it if found
-> Done.

So that's pretty much it. It's still a work in progress as i haven't had much time to iron it out but I do have it in a production app so I know that it works. I'm currently still working on the API so while there are some general tests, it's currently not the most unit tested thing in the world. I think that it has a lot of promise and is the culmination of years of mistakes and lessons on my part. So I hope some of you get to use it, contribute to it etc..

Thanks.